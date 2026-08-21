package com.platform.auth.security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {
    @Value("${jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String jwtSecret;

    public String generateToken(String email, String role, String userId) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(userId).claim("email", email).claim("role", role)
                .setIssuedAt(now).setExpiration(new Date(now.getTime() + 86400000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
    }
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }
}
