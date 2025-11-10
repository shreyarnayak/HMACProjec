
---

## 💠 `web/README.md`
Copy this into `HMACProject/web/README.md`:

```markdown
# 💠 NeonGlass HMAC Studio (Web Frontend)

This folder contains a **modern web-based UI** to generate and verify  
**HMAC-SHA256** messages directly in your browser — all client-side (no server).

---

## ✨ Features
- Compute **HMAC-SHA256** using the browser's **Web Crypto API**.
- Output in **Base64** and **Hex** formats.
- Beautiful **neon glassmorphism design**.
- Copy buttons for quick sharing.
- Local-only: No data leaves your device.
- Built for VS Code Live Server or any browser.

---

## 🏗️ How to Run
1. Open VS Code.
2. Right-click on `hmac_designer.html` → **Open with Live Server**  
   (or simply double-click the file to open in your browser).

---

## 🧮 How to Use
1. Enter your **secret key**.
2. Type or paste your **message**.
3. Click **Generate HMAC**.
4. Copy Base64/Hex outputs using the buttons.
5. To verify a MAC:
   - Paste a Base64 MAC in the “Verification input” field.
   - Click **Verify (Base64)**.
   - The status will show ✅ VALID or ❌ INVALID.

---

## 🎨 Design
- Uses **CSS glassmorphism + neon gradient** style.
- Adaptive layout for desktop & mobile.
- No frameworks — only HTML, CSS, and Vanilla JS.

---

## 🧩 Files
| File | Description |
|------|--------------|
| `hmac_designer.html` | Frontend app with HTML, CSS, and JS in one file |
| `README.md` | This documentation file |

---

## 🖼️ Screenshot
*(You can add your screenshot later)*  
Example look:  

![screenshot-demo](https://user-images.githubusercontent.com/example/hmac-ui.png)

---

## 🔒 Security
- Uses the **Web Crypto API** (`crypto.subtle`) for real cryptographic HMAC.
- Data stays entirely on your local system.
- Safe for demonstrations, testing, or learning purposes.

---

## 👩‍💻 Author
Project by **Shreya**  
Built with ❤️ and JavaScript in VS Code.
