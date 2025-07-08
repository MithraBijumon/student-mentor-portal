// env.ts
const LOCAL = true; // set to false in production

export const API_URL = LOCAL
  ? "https://649fb13eada1.ngrok-free.app" // your local network IP + Django port
  : "https://student-mentor-portal.onrender.com"; // deployed URL

export const ENDPOINTS = {
  CREATE_DOUBT: `${API_URL}/api/doubts/create/`,
  GET_DOUBTS: `${API_URL}/api/doubts/`,
  LOGIN: `${API_URL}/api/auth/login/`,
  GET_USER: `${API_URL}/api/users/me/`,
  CREATE_REPLY: `${API_URL}/api/doubts/`,
  ANNOUNCEMENTS: `${API_URL}/api/announcements/`,
  MARK_AS_ANSWERED: `${API_URL}/api/doubts/`, // Then add `${id}/mark-answered/` in code
};