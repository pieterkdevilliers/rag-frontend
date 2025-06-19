// middleware/auth.ts
import { useAuthStore } from '~/stores/auth';

// The middleware function. `to` is the route the user is trying to go to.
export default defineNuxtRouteMiddleware((to) => {
  // We need to access the auth store to check for a token or user.
  const authStore = useAuthStore();

  // A common pattern is to have a getter in your store for this.
  // If the user is not logged in, redirect them to the login page.
  if (!authStore.isLoggedIn) {
    console.log('User is not authenticated. Redirecting to /login.');
    
    // Stop the current navigation and redirect to the login page.
    // We also add a `redirect` query parameter to remember where the user
    // was trying to go, so we can send them back there after they log in.
    return navigateTo(`/login?redirect=${to.fullPath}`);
  }
  
  // If the user is logged in, the middleware does nothing and
  // allows the user to proceed to the requested page.
});