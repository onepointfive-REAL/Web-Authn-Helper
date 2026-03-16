# Simple WebAuthn Helper

A small client-side **WebAuthn helper** for registering and logging in with security keys or platform authenticators.
Designed to be **very simple to integrate** into any webpage.

---

## Features

* Simple register and login functions
* Works with security keys and platform authenticators
* Optional restriction to **USB security keys only**
* Uses secure browser randomness (`crypto.getRandomValues`)
* User-defined success and failure callbacks
* Stores credential ID in `localStorage`
* Can clear stored credentials easily

---

## Installation

Download `webauthn-helper.js` and include it on your page:

```html
<script src="webauthn-helper.js"></script>
```

---

## Example Usage

```html
<script src="webauthn-helper.js"></script>
<script>
// User-defined callbacks
function registerSuccess(cred) { alert("Registered!"); }
function registerFail(err) { alert("Register failed!"); }
function loginSuccess(assertion) { alert("Login success!"); }
function loginFail(err) { alert("Login failed!"); }
function loginFailedNotRegistered() { alert("Login failed: No key registered!"); }
</script>

<button onclick="WebAuthnHelper.register(1,'me@example.com','My Name')">
Register All Devices
</button>

<button onclick="WebAuthnHelper.register(2,'me@example.com','My Name')">
Register USB only
</button>

<button onclick="WebAuthnHelper.login()">
Login
</button>

<button onclick="WebAuthnHelper.clear()">
Clear Saved Key
</button>
```

---

## Functions

### Register

```js
WebAuthnHelper.register(deviceType, email, username)
```

Example:

```js
WebAuthnHelper.register(1,"user@example.com","John")
```

Parameters:

| Parameter  | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| deviceType | `1` = all authenticators (phone + external), `2` = external security keys only |
| email      | user identifier                                                                |
| username   | display name                                                                   |

### Login

```js
WebAuthnHelper.login()
```

Attempts to authenticate with the saved credential.

### Clear Stored Credential

```js
WebAuthnHelper.clear()
```

Removes stored WebAuthn data from `localStorage`.

---

## Callbacks

Callbacks are **optional but recommended**.
If a callback is not defined, the helper will **skip it safely without errors**.

### Registration

```js
registerSuccess(credential)
registerFail(error)
```

### Login

```js
loginSuccess(assertion)
loginFail(error)
loginFailedNotRegistered()
```

---

## How It Works

### Registration

1. Browser generates a **random challenge**
2. The authenticator (security key or platform authenticator) creates a credential
3. The credential ID (`rawId`) is stored in `localStorage`

### Login

1. Browser generates a **new random challenge**
2. The stored credential ID is used for authentication
3. The authenticator signs the challenge to prove identity

---

## Storage

The helper stores data in:

```js
localStorage.webauthnKey
localStorage.webauthnDeviceType
```

---

## Security Notes

This helper is intended for:

* demos
* prototypes
* learning WebAuthn
* simple local authentication experiments

**For production systems**, you should:

* verify signatures on a server
* store credentials in a database
* implement proper user account management

---

## Requirements

* HTTPS website
* Modern browser with WebAuthn support
* Security key or platform authenticator

---

## License

Free to use and modify.
