package com.platform.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.security.Key;

/**
 * Verifies the JWT on protected routes and forwards the caller's identity to the
 * services as X-User-Id / X-User-Role.
 *
 * Downstream services trust those two headers completely, so the gateway always
 * removes any copy the client sent - on public routes too. Without that, a caller
 * could reach a public path with a forged X-User-Id and act as anyone.
 */
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    static final String USER_ID = "X-User-Id";
    static final String USER_ROLE = "X-User-Role";

    private final Key signingKey;

    public AuthenticationFilter(@Value("${jwt.secret}") String jwtSecret) {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpRequest.Builder sanitized = request.mutate()
                .headers(headers -> {
                    headers.remove(USER_ID);
                    headers.remove(USER_ROLE);
                });

        if (RouteAccess.isPublic(request.getMethod(), request.getURI().getPath())) {
            return chain.filter(exchange.mutate().request(sanitized.build()).build());
        }

        String header = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) {
            return reject(exchange);
        }
        try {
            Claims claims = Jwts.parserBuilder().setSigningKey(signingKey).build()
                    .parseClaimsJws(header.substring(7)).getBody();
            ServerHttpRequest authenticated = sanitized
                    .header(USER_ID, claims.getSubject())
                    .header(USER_ROLE, String.valueOf(claims.get("role", String.class)))
                    .build();
            return chain.filter(exchange.mutate().request(authenticated).build());
        } catch (Exception e) {
            return reject(exchange);
        }
    }

    private Mono<Void> reject(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        // Before routing, so no request reaches a service unchecked.
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
