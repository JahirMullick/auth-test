# 📊 Evaluator Guide — React Native Auth Machine Test

> This document is for the **interviewer / hiring team only**. Do not share with candidates.

---

## What We're Evaluating

This test is intentionally scoped to 2–3 hours to evaluate *decision-making under time pressure*, not encyclopaedic knowledge. We want to see how a candidate thinks, structures code, and handles edge cases — not if they can memorise APIs.

---

## Scoring Rubric (100 points)

### 1. Auth Flow Correctness — 25 pts

| Points | Criteria |
|--------|----------|
| 25 | Token checked on app launch (Splash/loading screen), correct navigation guard, clean logout that clears storage |
| 18–24 | Most flow works but minor gaps (e.g. back button accessible, no splash screen) |
| 10–17 | Login works but no persistence / no guard on Home screen |
| < 10 | Flow is broken or incomplete |

**Watch for:**
- Does the app check for an existing token on launch before showing Login or Home?
- Is the Home screen unreachable without a token?
- Does logout actually clear storage, not just in-memory state?

---

### 2. Global State Design — 25 pts

| Points | Criteria |
|--------|----------|
| 25 | Auth state (`token`, `user`, `isLoading`, `isAuthenticated`) in global store; clean separation of concerns; `useAuth` or equivalent hook |
| 18–24 | Global state used correctly but some leakage (logic in component, no custom hook) |
| 10–17 | Context used but only partly lifted; most state is local |
| < 10 | All state is local to Login component; no global store |

**Watch for:**
- Is `isLoading` tracked globally so a Splash screen can use it?
- Is the state shape sensible? (`isAuthenticated` as a derived value vs stored)
- Does the store handle the login async lifecycle (request → success/failure)?

---

### 3. Error & Loading State Handling — 20 pts

| Points | Criteria |
|--------|----------|
| 20 | Loading spinner during `fakeLogin()`, error message shown on failure, button disabled during load, error clears on retry |
| 14–19 | Loading and error shown but minor UX gaps |
| 8–13 | Error shown but no loading state, or vice versa |
| < 8 | Neither loading nor error is handled |

**Watch for:**
- The helper randomly fails ~30% of the time — does the candidate handle it gracefully?
- Is the submit button disabled while a request is in-flight?
- Does the error reset when the user edits the form or retries?

---

### 4. Code Quality — 20 pts

| Points | Criteria |
|--------|----------|
| 20 | Readable variable names, functions do one thing, clear component structure, no dead code, `NOTES.md` is thoughtful |
| 14–19 | Generally clean with minor issues |
| 8–13 | Works but messy: large components, inconsistent naming, unclear logic |
| < 8 | Difficult to follow; spaghetti logic; no separation of concerns |

**Watch for:**
- Are screens fat with business logic, or is that logic in the store/hooks?
- Are magic strings/numbers avoided?
- Does the `NOTES.md` show self-awareness about trade-offs?

---

### 5. Navigation Architecture — 10 pts

| Points | Criteria |
|--------|----------|
| 10 | Auth stack vs app stack separation; initial route determined by token state; no back-navigation possible post-login |
| 7–9 | Navigation works but minor structural issues |
| 4–6 | Navigation works for happy path but auth guarding is incomplete |
| < 4 | Hard-coded navigation or no guarding at all |

**Watch for:**
- Is there a clear split between "auth screens" and "app screens" in the navigator?
- After login, can the user press Back to return to the Login screen?

---

## Total Score Interpretation

| Score | Recommendation |
|-------|---------------|
| 85–100 | Strong hire — proceed to final round |
| 70–84 | Good hire — minor concerns worth discussing |
| 55–69 | Possible — needs in-depth follow-up discussion |
| < 55 | Not recommended at this time |

---

## Follow-Up Discussion Questions

Ask these in the debrief regardless of score — the answers often tell more than the code:

1. **"Walk me through your global state design. Why did you choose [their library]?"**
   — Listen for: trade-off awareness, not just "I've used it before"

2. **"What happens if the app is killed mid-login request?"**
   — Good answer: loading state clears on next launch, storage is untouched

3. **"How would you handle token refresh in a real app?"**
   — Good answer: interceptor pattern, refresh token flow, silent re-auth

4. **"Your Splash screen checks AsyncStorage — what if that's slow on a low-end device?"**
   — Good answer: skeleton screens, perceived performance, critical path loading

5. **"If you had another 2 hours, what would you add first?"**
   — Reveals priorities: test coverage, refresh tokens, better UX, error boundaries

---

## Red Flags

- No Splash screen / token check on launch (most common miss)
- All state living in `LoginScreen.jsx`
- No error handling (`fakeLogin` will fail — they must handle it)
- `authHelper.js` was modified
- `decodeToken` not used — user info hard-coded or not shown at all
- `isAuthenticated` derived from checking if `token !== null` in the component, not in the store

---

## Green Flags

- Uses `isTokenValid()` from the helper to check expiry, not just existence
- `isAuthenticated` is a derived/computed value in the store
- Custom `useAuth()` hook cleanly abstracts store access
- Error message is user-friendly (not raw error string dump)
- `NOTES.md` mentions what they would test or improve

---

## Reference: What a Strong Solution Looks Like

```
src/
  store/authStore.js          — Zustand/Context with: token, user, isLoading, error, isAuthenticated
  hooks/useAuth.js            — login(), logout(), computed isAuthenticated
  navigation/RootNavigator    — <AuthStack> / <AppStack> split on isAuthenticated
  screens/SplashScreen        — checks AsyncStorage, dispatches setToken or clears
  screens/LoginScreen         — form + validation + calls useAuth().login()
  screens/HomeScreen          — shows decoded user info, logout button
```

**Auth store shape (Zustand example):**
```js
{
  token: string | null,
  user: { name, email, exp } | null,
  isLoading: boolean,
  error: string | null,
  isAuthenticated: boolean,  // derived: !!token && isTokenValid(token)
  login: async (email, pass) => void,
  logout: () => void,
  hydrate: () => void,        // called on app launch to restore from storage
}
```
