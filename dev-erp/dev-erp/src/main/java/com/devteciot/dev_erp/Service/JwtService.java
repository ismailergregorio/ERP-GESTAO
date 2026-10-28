package com.devteciot.dev_erp.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Service
public class JwtService {
    private final ObjectMapper mapper = new ObjectMapper();
    private final byte[] secret;
    private final long expirationSeconds;

    public JwtService(@Value("${erp.security.jwt-secret}") String secret,
                      @Value("${erp.security.jwt-expiration-seconds:28800}") long expirationSeconds) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32)
            throw new IllegalStateException("ERP_JWT_SECRET precisa ter pelo menos 32 bytes.");
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationSeconds;
    }

    public long getExpirationSeconds() { return expirationSeconds; }

    public String gerar(String username) {
        try {
            long now = Instant.now().getEpochSecond();
            String header = encode(mapper.writeValueAsBytes(Map.of("alg", "HS256", "typ", "JWT")));
            String payload = encode(mapper.writeValueAsBytes(Map.of("sub", username, "iat", now, "exp", now + expirationSeconds)));
            String content = header + "." + payload;
            return content + "." + sign(content);
        } catch (Exception e) { throw new IllegalStateException("Não foi possível gerar o token.", e); }
    }

    public String validarEObterUsuario(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return null;
            String content = parts[0] + "." + parts[1];
            if (!java.security.MessageDigest.isEqual(sign(content).getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) return null;
            Map<?, ?> payload = mapper.readValue(Base64.getUrlDecoder().decode(parts[1]), Map.class);
            Object exp = payload.get("exp");
            Object sub = payload.get("sub");
            if (!(exp instanceof Number) || ((Number) exp).longValue() <= Instant.now().getEpochSecond() || !(sub instanceof String)) return null;
            return (String) sub;
        } catch (Exception e) { return null; }
    }

    private String sign(String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return encode(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }
    private String encode(byte[] value) { return Base64.getUrlEncoder().withoutPadding().encodeToString(value); }
}
