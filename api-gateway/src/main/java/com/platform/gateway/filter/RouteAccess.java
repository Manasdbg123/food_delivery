package com.platform.gateway.filter;

import org.springframework.http.HttpMethod;

import java.util.List;

/**
 * Which requests may pass the gateway without a token.
 *
 * Browsing is public - anyone can look at restaurants and menus before signing in -
 * but everything that reads or changes a user's data needs a valid JWT. Matching is
 * on whole path prefixes, never substrings, so "/api/v1/orders/x/api/v1/auth/login"
 * does not slip through as a login request.
 */
public final class RouteAccess {

    private static final List<String> PUBLIC_ANY_METHOD = List.of(
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/eureka");

    private static final List<String> PUBLIC_READ_ONLY = List.of(
            "/api/v1/restaurants",
            "/api/v1/menus");

    private RouteAccess() {
    }

    public static boolean isPublic(HttpMethod method, String path) {
        if (path == null) {
            return false;
        }
        if (PUBLIC_ANY_METHOD.stream().anyMatch(prefix -> matches(path, prefix))) {
            return true;
        }
        return HttpMethod.GET.equals(method)
                && PUBLIC_READ_ONLY.stream().anyMatch(prefix -> matches(path, prefix));
    }

    private static boolean matches(String path, String prefix) {
        return path.equals(prefix) || path.startsWith(prefix + "/");
    }
}
