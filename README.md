# 🧪 React Native Machine Test — Auth & State Management

> **Time Limit:** 2–3 hours
> **Platform:** Expo (Web) — No Android/iOS build required
> **Level:** Mid-level React Native Developer

---

## 📋 Overview

You will build a **demo login & authentication system** in React Native (Expo). The goal is to demonstrate your understanding of:

- Local and global state management
- Authentication flows (login, protected routes, logout)
- Handling async operations (loading, success, failure states)
- Token storage and session persistence
- Clean component architecture

---

## 🚀 Getting Started

### 1. Create the Expo project

```bash
npx create-expo-app@latest rn-auth-test --template blank
cd rn-auth-test
```

### 2. Install dependencies

```bash
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install expo-secure-store
```

> You may install any additional state management library of your choice (Zustand, Redux Toolkit, Context API, Jotai, etc.)

### 3. Copy the helper file

Copy the provided `authHelper.js` file into your `src/` or root directory (do **not** modify it).

### 4. Run the project on web

```bash
npx expo start --web
```

---

## 📁 Required File Structure

Your submission should follow a structure similar to this:

```
rn-auth-test/
├── src/
│   ├── navigation/
│   │   └── RootNavigator.jsx       # Stack/Tab navigator with auth guarding
│   ├── screens/
│   │   ├── LoginScreen.jsx         # Login UI + form logic
│   │   ├── HomeScreen.jsx          # Protected screen showing user info
│   │   └── SplashScreen.jsx        # Initial loading / token check screen
│   ├── store/                      # Your global state (context / zustand / redux)
│   │   └── authStore.js
│   ├── hooks/
│   │   └── useAuth.js              # Custom hook exposing auth state & actions
│   └── components/
│       └── (any reusable components)
├── authHelper.js                   # ⛔ PROVIDED — DO NOT MODIFY
├── App.jsx
└── package.json
```

> Structure can vary slightly — what matters is clean separation of concerns.

---

## ✅ Requirements

### 1. Login Screen
- Email and password input fields
- Basic validation (non-empty fields, valid email format)
- Show loading indicator while login is in progress
- Show error message on failure (the helper randomly fails — handle it gracefully)
- On success, navigate to the Home screen

### 2. Authentication Flow
- Use the provided `fakeLogin()` function from `authHelper.js` — do not write your own login logic
- Store the returned JWT token securely using `expo-secure-store` or `AsyncStorage`
- On app launch, check if a token exists and auto-navigate to Home if valid (Splash screen pattern)
- Token should persist across refreshes (web localStorage is acceptable fallback)

### 3. Home / Dashboard Screen
- Display a welcome message with the **decoded user info** from the JWT token (name, email)
- Show the raw token (truncated) somewhere on screen
- A working **Logout** button that clears the token and redirects to Login

### 4. Global State Management
- Auth state (`token`, `user`, `isLoading`, `isAuthenticated`) must live in **global state** — not just local component state
- Use any solution: React Context + useReducer, Zustand, Redux Toolkit, etc.
- The choice and implementation will be discussed in the follow-up review

### 5. Navigation Guarding
- Unauthenticated users must not be able to reach the Home screen
- Authenticated users must not be able to go back to the Login screen
- Handle the initial loading state before the token check resolves

---

## 🛠️ The Auth Helper

A file called `authHelper.js` is provided. It exports one function:

```js
import { fakeLogin } from './authHelper';

const result = await fakeLogin(email, password);
// result = { success: true, token: "eyJ..." }
// OR
// result = { success: false, error: "Invalid credentials" }
```

**Behavior:**
- Simulates a ~1.5 second network delay
- Returns a fake (but structurally valid) JWT token on success
- Randomly fails ~30% of the time to simulate real-world API errors
- Always fails if the password is less than 4 characters (for testing the error state)
- The token payload contains `name`, `email`, and `exp` fields you can decode

---

## 🚫 Rules

- Do **not** modify `authHelper.js`
- Do **not** use a real backend or real auth service
- Do **not** spend time on pixel-perfect UI — basic, clean styling is fine
- You **may** use any component library (NativeBase, Tamagui, RN Paper, etc.)
- You **may** use any state management library
- Keep commits clean — at least 2–3 meaningful commits showing your progress

---

## 📤 Submission

1. Push your code to a **public GitHub repository**
2. Include a brief `NOTES.md` file (10–15 lines) explaining:
   - What state management approach you chose and why
   - Any trade-offs or decisions you made
   - What you would improve given more time
3. Share the repository link

---

## 🏆 Evaluation Criteria

| Area | Weight | What We Look For |
|------|--------|-----------------|
| Auth Flow Correctness | 25% | Token check on launch, guards, logout |
| Global State Design | 25% | Clean, scalable, well-structured |
| Error & Loading Handling | 20% | All async states handled gracefully |
| Code Quality | 20% | Readable, well-named, separation of concerns |
| Navigation Architecture | 10% | Correct guarding, clean stack structure |

---

## 💡 Tips

- Start with the global store and `useAuth` hook before building screens
- Build the Splash screen token-check logic early — it's easy to forget
- Test the error state by using a password shorter than 4 characters
- Don't over-engineer — clean and working beats fancy and broken

---

Good luck! 🚀
