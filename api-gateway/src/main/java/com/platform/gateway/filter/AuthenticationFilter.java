package com.platform.gateway.filter;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import java.util.List;

@Component
public class AuthenticationFilter implements GlobalFilter {
    @Value("${jwt.secret}")
    private String jwtSecret;

    private final List<String> openApiEndpoints = List.of("/api/v1/auth/register", "/api/v1/auth/login", "/eureka");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        if (isSecured(request)) {
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) return onError(exchange, HttpStatus.UNAUTHORIZED);
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && authHeader.startsWith("Bearer ")) authHeader = authHeader.substring(7);
            try {
                Claims claims = Jwts.parserBuilder().setSigningKey(jwtSecret).build().parseClaimsJws(authHeader).getBody();
                ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                        .header("X-User-Id", claims.getSubject())
                        .header("X-User-Role", claims.get("role", String.class)).build();
                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            } catch (Exception e) { return onError(exchange, HttpStatus.UNAUTHORIZED); }
        }
        return chain.filter(exchange);
    }
    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }
    private boolean isSecured(ServerHttpRequest request) {
        return openApiEndpoints.stream().noneMatch(uri -> request.getURI().getPath().contains(uri));
    }
}
