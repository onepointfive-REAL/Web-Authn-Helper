// webauthn-helper.js

const WebAuthnHelper = (() => {
    function encodeBase64(buf) {
        return btoa(String.fromCharCode(...new Uint8Array(buf)));
    }

    function decodeBase64(str) {
        const binary = atob(str);
        const buf = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
        return buf;
    }

    async function register(deviceType = 1, email = "demo@example.com", userName = "Demo User") {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        const publicKey = {
            challenge: challenge,
            rp: { name: "Demo" },
            user: {
                id: new TextEncoder().encode(email),
                name: email,
                displayName: userName
            },
            pubKeyCredParams: [{ type: "public-key", alg: -7 }],
            timeout: 60000,
            attestation: "none"
        };
        if (deviceType === 2) publicKey.authenticatorSelection = { authenticatorAttachment: "cross-platform" };

        try {
            const cred = await navigator.credentials.create({ publicKey });
            const credBase64 = encodeBase64(cred.rawId);
            localStorage.setItem("webauthnKey", credBase64);
            localStorage.setItem("webauthnDeviceType", deviceType);
            if (typeof registerSuccess === "function") registerSuccess(cred, credBase64, deviceType);
        } catch (err) {
            if (typeof registerFail === "function") registerFail(err);
        }
    }

    async function login() {
        const storedRawId = localStorage.getItem("webauthnKey");
        const deviceType = parseInt(localStorage.getItem("webauthnDeviceType") || "1");
        if (!storedRawId) {
            if (typeof loginFailedNotRegistered === "function") loginFailedNotRegistered();
            return;
        }

        const allowCreds = [{ type: "public-key", id: decodeBase64(storedRawId) }];
        const publicKey = {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            allowCredentials: allowCreds,
            timeout: 60000,
            userVerification: "preferred"
        };
        if (deviceType === 2) publicKey.authenticatorSelection = { authenticatorAttachment: "cross-platform" };

        try {
            const assertion = await navigator.credentials.get({ publicKey });
            if (typeof loginSuccess === "function") loginSuccess(assertion, storedRawId, deviceType);
        } catch (err) {
            if (err.name === "NotAllowedError" && typeof loginFailedWrongDevice === "function") {
                loginFailedWrongDevice();
            } else if (typeof loginFail === "function") loginFail(err);
        }
    }

    async function loginWithBase64Cred(rawIdB64, deviceType = 1) {
        if (!rawIdB64) {
            if (typeof loginFailedNotRegistered === "function") loginFailedNotRegistered();
            return;
        }

        const allowCreds = [{ type: "public-key", id: decodeBase64(rawIdB64) }];
        const publicKey = {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            allowCredentials: allowCreds,
            timeout: 60000,
            userVerification: "preferred"
        };
        if (deviceType === 2) publicKey.authenticatorSelection = { authenticatorAttachment: "cross-platform" };

        try {
            const assertion = await navigator.credentials.get({ publicKey });
            if (typeof loginSuccess === "function") loginSuccess(assertion, rawIdB64, deviceType);
        } catch (err) {
            if (err.name === "NotAllowedError" && typeof loginFailedWrongDevice === "function") {
                loginFailedWrongDevice();
            } else if (typeof loginFail === "function") loginFail(err);
        }
    }

    function clear() {
        localStorage.removeItem("webauthnKey");
        localStorage.removeItem("webauthnDeviceType");
    }

    return { register, login, loginWithBase64Cred, clear };
})();
