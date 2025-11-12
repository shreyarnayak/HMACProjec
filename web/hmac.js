// ==================== HMAC CORE FUNCTIONS ====================
async function importKey(secret) {
    const enc = new TextEncoder();
    return crypto.subtle.importKey(
        "raw",
        enc.encode(secret), { name: "HMAC", hash: { name: "SHA-256" } },
        false, ["sign", "verify"]
    );
}

function toBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let b of bytes) binary += String.fromCharCode(b);
    return btoa(binary);
}

function toHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

async function sign(secret, message) {
    const key = await importKey(secret);
    const enc = new TextEncoder();
    return crypto.subtle.sign("HMAC", key, enc.encode(message));
}

// ==================== UNIVERSAL COPY FUNCTION ====================
function copyText(id, statusId = null) {
    const text = document.getElementById(id).value;
    if (!text) {
        alert("Nothing to copy!");
        return;
    }

    // Try modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopied(statusId);
        }).catch(() => fallbackCopy(text, statusId));
    } else {
        // Fallback for file:// or insecure contexts
        fallbackCopy(text, statusId);
    }
}

function fallbackCopy(text, statusId) {
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    showCopied(statusId);
}

function showCopied(statusId) {
    if (!statusId) return;
    const el = document.getElementById(statusId);
    if (!el) return;
    const oldText = el.textContent;
    el.textContent = "📋 Copied!";
    el.style.color = "#00ffae";
    setTimeout(() => {
        el.textContent = oldText;
        el.style.color = "#aaa";
    }, 1500);
}

// ==================== SENDER PAGE LOGIC ====================
if (document.getElementById("gen")) {
    const genBtn = document.getElementById("gen");
    const clearBtn = document.getElementById("clear");
    const copyBase64Btn = document.getElementById("copyBase64");
    const copyHexBtn = document.getElementById("copyHex");

    genBtn.addEventListener("click", async() => {
        const key = document.getElementById("key").value.trim();
        const msg = document.getElementById("message").value.trim();
        if (!key || !msg) {
            alert("Please enter both a key and a message.");
            return;
        }
        const mac = await sign(key, msg);
        document.getElementById("output").value = toBase64(mac);
        document.getElementById("outputHex").value = toHex(mac);
    });

    clearBtn.addEventListener("click", () => {
        document.getElementById("key").value = "";
        document.getElementById("message").value = "";
        document.getElementById("output").value = "";
        document.getElementById("outputHex").value = "";
    });

    copyBase64Btn.addEventListener("click", () => copyText("output", "copyStatus"));
    copyHexBtn.addEventListener("click", () => copyText("outputHex", "copyStatus"));
}

// ==================== RECEIVER PAGE LOGIC ====================
if (document.getElementById("verify")) {
    const verifyBtn = document.getElementById("verify");
    const clearBtn = document.getElementById("clear");

    verifyBtn.addEventListener("click", async() => {
        const key = document.getElementById("key").value.trim();
        const msg = document.getElementById("message").value.trim();
        const macB64 = document.getElementById("verifyInput").value.trim();
        const status = document.getElementById("status");

        if (!key || !msg || !macB64) {
            alert("Please fill in all fields before verifying.");
            return;
        }

        try {
            const keyObj = await importKey(key);
            const enc = new TextEncoder();
            const sig = Uint8Array.from(atob(macB64), c => c.charCodeAt(0));
            const valid = await crypto.subtle.verify("HMAC", keyObj, sig, enc.encode(msg));

            status.textContent = valid ?
                "✅ VALID — Message is authentic" :
                "❌ INVALID — Message was altered or wrong key used";
            status.style.color = valid ? "#00ffae" : "#ff5c5c";
        } catch (e) {
            status.textContent = "Error: " + e.message;
            status.style.color = "#ff5c5c";
        }
    });

    clearBtn.addEventListener("click", () => {
        document.getElementById("key").value = "";
        document.getElementById("message").value = "";
        document.getElementById("verifyInput").value = "";
        document.getElementById("status").textContent = "Cleared";
        document.getElementById("status").style.color = "#aaa";
    });
}