# 🧩 HMAC-SHA256 Generator & Verifier (Java)

This folder contains a **Java command-line implementation** of the  
**Hash-based Message Authentication Code (HMAC)** using **SHA-256**.

---

## 📜 Description
The program:
- Generates a Message Authentication Code (MAC) for a message and a secret key.
- Verifies whether a given MAC matches the message and key.
- Uses the Java `javax.crypto.Mac` and `SecretKeySpec` classes.
- Outputs Base64-encoded MAC for easy sharing.

---

## ⚙️ Requirements
- Java JDK 8 or higher  
- A terminal or VS Code with the Java Extension Pack

---

## 🏗️ How to Run

### 1. Compile
```bash
javac HMACUtil.java
