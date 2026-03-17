# Simple WebAuthn Helper

[![](https://data.jsdelivr.com/v1/package/gh/onepointfive-REAL/Web-Authn-Helper/badge)](https://www.jsdelivr.com/package/gh/onepointfive-REAL/Web-Authn-Helper)

A minimal/simple **WebAuthn helper** for registering and logging in security keys (USB, NFC, etc.) with **optional callbacks**. Designed for easy testing and demos.

Supports:

* Register all devices or only external (USB/NFC) devices
* Login with stored key or a raw Base64 credential
* Optional callbacks for success/failure
* Access to **Base64 rawId** and **device type** in callbacks

---

## Installation

Include the helper JS in your HTML:

```html
<script src="webauthn-helper.js"></script>
```
Or use

```html
<script src="https://cdn.jsdelivr.net/gh/onepointfive-REAL/Web-Authn-Helper/webauthn-helper.js"></script>
```
---

## Usage

### Callbacks (optional, recommended)

```javascript
function registerSuccess(cred, base64Cred, deviceType) {
    console.log("REGISTER SUCCESS", base64Cred, deviceType);
}

function registerFail(err) {
    console.log("REGISTER FAIL", err);
}

function loginSuccess(assertion, base64Cred, deviceType) {
    console.log("LOGIN SUCCESS", base64Cred, deviceType);
}

function loginFail(err) {
    console.log("LOGIN FAIL", err);
}

function loginFailedNotRegistered() {
    console.log("LOGIN FAIL: No key registered");
}

function loginFailedWrongDevice() {
    console.log("LOGIN FAIL: Wrong device");
}
```

---

### Register a key

```javascript
// Register all devices
WebAuthnHelper.register(1, "me@example.com", "My Name");

// Register USB/NFC only
WebAuthnHelper.register(2, "me@example.com", "My Name");
```

| Parameter  | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| deviceType | `1` = all authenticators , `2` = external security keys only                   |
| email      | user identifier                                                                |
| username   | display name                                                                   |

`registerSuccess` will receive the **credential object**, **Base64 rawId**, and **device type** used.

---

### Login

```javascript
// Login with stored key
WebAuthnHelper.login();

// Login with a specific rawId (Base64)
WebAuthnHelper.loginWithBase64Cred("BASE64_RAWID_HERE", DEVICE_ID_HERE);
```

`loginSuccess` will receive the **assertion object**, **Base64 rawId used**, and **device type used**.

---

### Clear stored key

```javascript
WebAuthnHelper.clear();
```

---

## Example HTML Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>WebAuthn Helper Demo</title>
<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    button, input { margin: 5px; padding: 8px; }
    #output { margin-top: 20px; padding: 10px; border: 1px solid #ccc; min-height: 50px; white-space: pre-wrap; }
</style>
</head>
<body>

<h2>WebAuthn Helper Demo</h2>

<button onclick="WebAuthnHelper.register(1,'me@example.com','My Name')">Register All Devices</button>
<button onclick="WebAuthnHelper.register(2,'me@example.com','My Name')">Register USB Only</button>
<button onclick="WebAuthnHelper.login()">Login</button>
<button onclick="WebAuthnHelper.clear()">Clear Key</button>

<hr>

<h3>Login With RawId</h3>
<input type="text" id="rawIdInput" placeholder="Paste Base64 rawId here"><br>
<input type="number" id="deviceTypeInput" value="1" min="1" max="2"><br>
<button onclick="loginWithInput()">Login With RawId</button>

<div id="output"></div>

<script src="webauthn-helper.js"></script>
<script>
const output = document.getElementById("output");
function show(msg) { output.textContent = msg; }

// Callbacks
function registerSuccess(cred, base64Cred, deviceType) {
    show(`REGISTER SUCCESS\nBase64 rawId: ${base64Cred}\nDevice Type: ${deviceType}`);
}
function registerFail(err) { show("REGISTER FAIL: " + err); }
function loginSuccess(assertion, base64Cred, deviceType) {
    show(`LOGIN SUCCESS\nBase64 rawId: ${base64Cred}\nDevice Type: ${deviceType}`);
}
function loginFail(err) { show("LOGIN FAIL: " + err); }
function loginFailedNotRegistered() { show("LOGIN FAIL: No key registered"); }
function loginFailedWrongDevice() { show("LOGIN FAIL: Wrong device"); }

// Login with rawId input
function loginWithInput() {
    const rawId = document.getElementById("rawIdInput").value.trim();
    const deviceType = parseInt(document.getElementById("deviceTypeInput").value) || 1;
    if (!rawId) { alert("Please paste a Base64 rawId!"); return; }
    WebAuthnHelper.loginWithBase64Cred(rawId, deviceType);
}
</script>

</body>
</html>
```

---

**Notes:**

* This helper is for **demo/testing purposes** only.
* For **real authentication**, you need a **server to verify the cryptographic signature** of WebAuthn assertions.
* Callbacks are **optional** but recommended to handle login/register events.
* `base64Cred` and `deviceType` are always provided in success callbacks for convenience.
