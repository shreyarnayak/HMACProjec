import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * HMACUtil
 * - Generates HMAC-SHA256 for a message and secret key.
 * - Verifies given MAC against message+key.
 *
 * Usage (command line):
 *   Compile: javac HMACUtil.java
 *   Run generate: java HMACUtil gen "secretKey" "message"
 *   Run verify:   java HMACUtil ver "secretKey" "message" "base64-mac"
 *
 * Examples:
 *   java HMACUtil gen mySecret "Hello World"
 *   java HMACUtil ver mySecret "Hello World" "expectedBase64MAC"
 *
 * Notes:
 * - Outputs/accepts MAC encoded in Base64.
 * - Uses UTF-8 for message and key bytes.
 */

public class HMACUtil {

    private static final String HMAC_ALGO = "HmacSHA256";

    // Compute raw HMAC bytes
    public static byte[] computeHmac(byte[] key, byte[] message) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(key, HMAC_ALGO);
        Mac mac = Mac.getInstance(HMAC_ALGO);
        mac.init(keySpec);
        return mac.doFinal(message);
    }

    // Helper: compute HMAC and return Base64 string
    public static String computeHmacBase64(String secretKey, String message) throws Exception {
        byte[] macBytes = computeHmac(secretKey.getBytes(StandardCharsets.UTF_8),
                                      message.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(macBytes);
    }

    // Timing-safe comparison to avoid timing attacks
    public static boolean constantTimeEquals(byte[] a, byte[] b) {
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
        int result = 0;
        for (int i = 0; i < a.length; i++) {
            result |= a[i] ^ b[i];
        }
        return result == 0;
    }

    // Verify Base64 MAC
    public static boolean verifyHmacBase64(String secretKey, String message, String base64Mac) throws Exception {
        byte[] expected = Base64.getDecoder().decode(base64Mac);
        byte[] actual = computeHmac(secretKey.getBytes(StandardCharsets.UTF_8),
                                    message.getBytes(StandardCharsets.UTF_8));
        return constantTimeEquals(expected, actual);
    }

    private static void printUsage() {
        System.out.println("HMACUtil - HMAC-SHA256 generator & verifier");
        System.out.println("Usage:");
        System.out.println("  java HMACUtil gen <secretKey> <message>");
        System.out.println("  java HMACUtil ver <secretKey> <message> <base64-mac>");
        System.out.println();
        System.out.println("You can also supply a file for the message using @file:path");
        System.out.println("Example: java HMACUtil gen mySecret @file:./payload.txt");
    }

    // If messageArg starts with "@file:", read the file contents
    private static String readMessageArg(String messageArg) throws IOException {
        if (messageArg.startsWith("@file:")) {
            String path = messageArg.substring(6);
            byte[] bytes = Files.readAllBytes(Paths.get(path));
            return new String(bytes, StandardCharsets.UTF_8);
        } else {
            return messageArg;
        }
    }

    public static void main(String[] args) {
        try {
            if (args.length < 3) {
                printUsage();
                System.exit(1);
            }

            String action = args[0].trim().toLowerCase();
            String key = args[1];
            String messageArg = args[2];
            String message = readMessageArg(messageArg);

            if ("gen".equals(action)) {
                String macBase64 = computeHmacBase64(key, message);
                System.out.println("HMAC (Base64): " + macBase64);
            } else if ("ver".equals(action)) {
                if (args.length < 4) {
                    System.err.println("verify mode requires a base64 mac as 4th argument.");
                    printUsage();
                    System.exit(2);
                }
                String mac = args[3];
                boolean ok = verifyHmacBase64(key, message, mac);
                System.out.println("Verified\n" + //
                                        "action result: " + (ok ? "VALID" : "INVALID"));
            } else {
                System.err.println("Unknown action: " + action);
                printUsage();
                System.exit(3);
            }
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            System.exit(4);
        }
    }
}
