document.addEventListener('DOMContentLoaded', () => {
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
        let binary = '';
        for (let b of bytes) binary += String.fromCharCode(b);
        return btoa(binary);
    }

    function toHex(buffer) {
        const bytes = new Uint8Array(buffer);
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function sign(secret, message) {
        const key = await importKey(secret);
        const enc = new TextEncoder();
        return crypto.subtle.sign("HMAC", key, enc.encode(message));
    }

    document.getElementById('gen').addEventListener('click', async() => {
        const key = document.getElementById('key').value || '';
        const msg = document.getElementById('message').value || '';
        if (!key) {
            alert('Please enter a secret key');
            return;
        }
        try {
            const mac = await sign(key, msg);
            document.getElementById('out').textContent = toBase64(mac);
            document.getElementById('outHex').textContent = toHex(mac);
            document.getElementById('status').textContent = 'Generated ✓';
        } catch (e) {
            document.getElementById('status').textContent = 'Error: ' + e.message;
        }
    });

    document.getElementById('verify').addEventListener('click', async() => {
        const key = document.getElementById('key').value || '';
        const msg = document.getElementById('message').value || '';
        const macB64 = document.getElementById('verifyInput').value.trim();
        if (!key || !macB64) {
            alert('Secret key and MAC required');
            return;
        }
        try {
            const keyObj = await importKey(key);
            const enc = new TextEncoder();
            const sig = Uint8Array.from(atob(macB64), c => c.charCodeAt(0));
            const ok = await crypto.subtle.verify("HMAC", keyObj, sig, enc.encode(msg));
            document.getElementById('status').textContent = ok ? 'VALID ✓' : 'INVALID ✕';
        } catch (e) {
            document.getElementById('status').textContent = 'Error: ' + e.message;
        }
    });

    document.getElementById('copyOut').addEventListener('click', () => {
        const text = document.getElementById('out').textContent;
        navigator.clipboard.writeText(text).then(() => {
            document.getElementById('status').textContent = 'Copied';
        });
    });

    document.getElementById('copyHex').addEventListener('click', () => {
        const text = document.getElementById('outHex').textContent;
        navigator.clipboard.writeText(text).then(() => {
            document.getElementById('status').textContent = 'Copied hex';
        });
    });

    document.getElementById('clear').addEventListener('click', () => {
        document.getElementById('key').value = '';
        document.getElementById('message').value = '';
        document.getElementById('out').textContent = '—';
        document.getElementById('outHex').textContent = '—';
        document.getElementById('verifyInput').value = '';
        document.getElementById('status').textContent = 'Cleared';
    });
});