package com.example.jwt.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;
import java.nio.charset.StandardCharsets;
@Service
public class JwtService {

    // Use a sufficiently long secret (at least 256 bits for HS256).
    // You can store this in application.properties as a Base64 string.
    @Value("${jwt.secret}")
    private String SECRET_KEY; // Example: a base64-encoded 32+ byte key

    private Key getSigningKey() {
        // If SECRET_KEY is base64, decode it. If plain text, use its bytes (less recommended).
    //    byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
    //    return Keys.hmacShaKeyFor( keyBytes);
    	  byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
    	    return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate token (example)
    public String generateToken(UserDetails userDetails) {
        long now = System.currentTimeMillis();
        long expireMillis = now + 1000 * 60 * 60*3; // 3 hour

        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // email
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(expireMillis))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

  
   


    private Claims extractAllClaims(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("JWT token is null or empty");
        }

        // <-- IMPORTANT: use parseClaimsJws for signed tokens (the common case) -->
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)   // parses signed JWT (JWS)
                .getBody();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Validate token against userDetails
    public boolean isTokenValid(String token, UserDetails userDetails) {
        if (token == null || token.trim().isEmpty()) return false;
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
