package com.platform.gateway.filter;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RouteAccessTest {

    @Test
    void loginAndRegisterArePublic() {
        assertTrue(RouteAccess.isPublic(HttpMethod.POST, "/api/v1/auth/login"));
        assertTrue(RouteAccess.isPublic(HttpMethod.POST, "/api/v1/auth/register"));
    }

    @Test
    void browsingRestaurantsAndMenusIsPublic() {
        assertTrue(RouteAccess.isPublic(HttpMethod.GET, "/api/v1/restaurants"));
        assertTrue(RouteAccess.isPublic(HttpMethod.GET, "/api/v1/restaurants/3"));
        assertTrue(RouteAccess.isPublic(HttpMethod.GET, "/api/v1/menus/restaurant/3"));
    }

    @Test
    void changingRestaurantsOrMenusNeedsAToken() {
        assertFalse(RouteAccess.isPublic(HttpMethod.POST, "/api/v1/restaurants"));
        assertFalse(RouteAccess.isPublic(HttpMethod.POST, "/api/v1/menus"));
    }

    @Test
    void userDataIsProtected() {
        assertFalse(RouteAccess.isPublic(HttpMethod.GET, "/api/v1/orders/me"));
        assertFalse(RouteAccess.isPublic(HttpMethod.POST, "/api/v1/orders"));
        assertFalse(RouteAccess.isPublic(HttpMethod.GET, "/api/v1/users/me"));
    }

    @Test
    void aPublicPathEmbeddedInAnotherPathDoesNotBypassAuth() {
        // The previous filter used String.contains, which let this through.
        assertFalse(RouteAccess.isPublic(HttpMethod.GET, "/api/v1/orders/1/api/v1/auth/login"));
        assertFalse(RouteAccess.isPublic(HttpMethod.GET, "/api/v1/restaurantsXYZ"));
    }
}
