# CreditIQ

## Current State
Full-stack credit appraisal app with a React frontend (dashboard, cases, analytics, settings, new appraisal). The authorization component is installed and the `useInternetIdentity` hook exists, but the app shell (`App.tsx`) never checks authentication — all routes are accessible without logging in.

## Requested Changes (Diff)

### Add
- A branded **Login page** (`pages/Login.tsx`) shown when the user is not authenticated. It should feature the CreditIQ logo, a short tagline about AI-powered credit decisioning, and a prominent "Sign In with Internet Identity" button that calls the `login()` function from `useInternetIdentity`.
- An **auth gate** in `App.tsx`: wrap the router/app shell in `InternetIdentityProvider`, and before rendering the main `AppShell`, check if the user is authenticated. If not, show the `Login` page. While the auth client is initializing, show a full-screen loading spinner.
- A **sign-out button** in the sidebar or header that calls `clear()` from `useInternetIdentity`.

### Modify
- `App.tsx`: import `InternetIdentityProvider` and `useInternetIdentity`, wrap everything in the provider, add auth-gate logic before rendering the router.
- Header/sidebar: replace the hardcoded "Priya Sharma / Credit Manager" placeholder with the authenticated principal (shortened) and a sign-out button.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/pages/Login.tsx` — branded login screen with CreditIQ logo, tagline, and Internet Identity sign-in button. Include loading and error states.
2. Update `App.tsx` to:
   a. Wrap the root component in `InternetIdentityProvider`.
   b. Add an `AuthGate` component that reads `useInternetIdentity` and renders the login page when not authenticated, a spinner while initializing, and the router when authenticated.
3. Update the `Header` component in `App.tsx` to show a sign-out button and the user principal (shortened).
4. Add deterministic `data-ocid` markers to all new interactive elements.
