// webauthn-helper.js

// Base64 helpers
function encodeBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
function decodeBase64(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

// WebAuthn helper
const WebAuthnHelper = {
  register: async (deviceType = 1, email = "demo@example.com", username = "Demo User") => {
    try {
      const attachment = deviceType === 2 ? "cross-platform" : undefined;

      const publicKey = {
        challenge: window.crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: "Demo Site" },
        user: {
          id: window.crypto.getRandomValues(new Uint8Array(16)),
          name: email,
          displayName: username
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        timeout: 60000,
        attestation: "direct",
        authenticatorSelection: {
          authenticatorAttachment: attachment,
          userVerification: "preferred"
        }
      };

      const cred = await navigator.credentials.create({ publicKey });
      const rawIdB64 = encodeBase64(cred.rawId);
      localStorage.setItem("webauthnKey", rawIdB64);
      localStorage.setItem("webauthnDeviceType", deviceType);

      if (typeof registerSuccess === "function") registerSuccess(cred);
    } catch (err) {
      if (typeof registerFail === "function") registerFail(err);
    }
  },

  login: async () => {
    try {
      const stored = localStorage.getItem("webauthnKey");
      const deviceType = Number(localStorage.getItem("webauthnDeviceType")) || 1;

      if (!stored) {
        if (typeof loginFailedNotRegistered === "function") {
          loginFailedNotRegistered();
        }
        return;
      }

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: window.crypto.getRandomValues(new Uint8Array(32)),
          allowCredentials: [{ type: "public-key", id: decodeBase64(stored) }],
          timeout: 60000,
          userVerification: "preferred"
        }
      });

      if (typeof loginSuccess === "function") loginSuccess(assertion);
    } catch (err) {
      if (typeof loginFail === "function") loginFail(err);
    }
  },

  clear: () => {
    localStorage.removeItem("webauthnKey");
    localStorage.removeItem("webauthnDeviceType");
    console.log("WebAuthnHelper: cleared saved key and device type.");
  }
};