# Integration Plan - Frontend (`smart_trip_planner`) & Backend (`smart_trip_backend`)

This document outlines the step-by-step plan to replace the current client-side local storage authentication mock with a fully integrated production-ready Node.js API client connected to `http://localhost:5001/api/`.

## 1. Field and Validation Mismatches Detected
We need to align the frontend form schemas and the backend database model:

| Field / Feature | Frontend (`smart_trip_planner`) | Backend (`smart_trip_backend`) | Resolution / Alignment |
| :--- | :--- | :--- | :--- |
| **Aadhar Field Name** | `aadhaar` | `aadharNumber` | Map `aadhaar` key to `aadharNumber` before sending request payloads. |
| **Phone Number** | Collected in `RegisterModal.jsx` | Not present in User model | Omit `phone` from request payloads, or update backend model to include phone if desired. |
| **Password Min Length** | `Yup` requires min 6 characters | `mongoose`/`validator` requires min 8 characters | Update frontend validation schema to match backend rules (min 8 chars, containing uppercase, lowercase, number, and special char). |
| **Authentication Flow** | Reads/writes from `localStorage.getItem("users")` | Validates credentials via `bcryptjs` and signs a 7-day JWT access token | Dispatch async Redux actions to call backend APIs, storing user details in Redux state and the signed token in `localStorage`. |

---

## 2. Step-by-Step Integration Guide

### Step 2.1: Setup Axios and Base API Helper
Create `src/components/Utils/api.js` to create an axios instance with base URL `http://localhost:5001/api`. Add request interceptors to automatically fetch the token from `localStorage` and mount it to `Authorization: Bearer <token>` headers on all API calls.

### Step 2.2: Implement Async Thunks in Redux
Update `src/components/redux/authSlice.js` to define async thunks using `@reduxjs/toolkit`'s `createAsyncThunk`:
1. `registerUser(userData)` -> Calls `POST /auth/register` (mapping `aadhaar` to `aadharNumber`).
2. `loginUser(credentials)` -> Calls `POST /auth/login` and saves the token to `localStorage`.
3. `fetchUserProfile()` -> Calls `GET /auth/profile` using the saved token to check auth state on reload.
4. `updateUserProfile(profileData)` -> Calls `PUT /auth/profile`.
5. `logoutUser()` -> Removes token from `localStorage` and resets state.

### Step 2.3: Connect Login and Register Modals
- **`LoginModal.jsx`**:
  - Dispatch `loginUser(data)` on submit.
  - Show loader/disabled states during login.
  - Route users to `/Admin` if the backend response contains `role: "admin"`, otherwise route to `/Tourist`.
  - Display backend error messages using `react-toastify`.
- **`RegisterModal.jsx`**:
  - Update validation schema to require 8 characters, an uppercase letter, lowercase letter, number, and special character.
  - Dispatch `registerUser(payload)` mapping `aadhaar` to `aadharNumber`.
  - Handle duplicate email/Aadhar error feedback.

### Step 2.4: Session Persistence on App Start
In your main app entry point (`src/main.jsx` or `src/App.jsx`), check if an `auth_token` exists in `localStorage`. If it does, dispatch `fetchUserProfile()` on startup to restore the user session.
