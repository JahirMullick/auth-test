# NOTES.md — Candidate Submission Notes

---

## State Management Choice

**Library/Pattern used:** React Context + useState/useMemo

**Why I chose it:**
Zero extra dependencies, and the auth state shape is simple enough that Context handles it cleanly without Redux/Zustand overhead. `useMemo` derives the `user` from the token efficiently.

## Key Decisions & Trade-offs

- **Conditional navigator rendering**: `AppNavigator` mounts either Auth or Home stack — never both — making unauthorized access impossible. Trade-off: nav state resets on login/logout.
- **expo-secure-store + localStorage fallback**: Encrypted on native, plain storage on web (explicitly allowed by requirements).
- **Formik for validation**: Adds a dependency but eliminates manual validation boilerplate.

## What I Would Improve Given More Time

- Migrate to `useReducer` for explicit state transitions (`SIGN_IN`, `SIGN_OUT`, `RESTORE_TOKEN`)
- Auto-logout when JWT expires mid-session (background timer checking `exp`)
- Add `accessibilityLabel`/`accessibilityRole` to all interactive elements
- Add a "Tap to retry" affordance on login error instead of requiring re-submit

## Anything Else

- The `authHelper.js` ~30% random failure rate is by design, not a bug.
- The empty `store/` directory is unused — global state lives in `context/AuthContext.tsx`.
