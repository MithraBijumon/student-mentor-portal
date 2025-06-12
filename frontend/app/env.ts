// env.ts
const LOCAL = true; // set to false in production

export const API_URL = LOCAL
  ? "http://192.168.151.198:8000" // your local network IP + Django port
  : "https://student-mentor-portal.onrender.com"; // deployed URL

export const ENDPOINTS = {
  CREATE_DOUBT: `${API_URL}/api/doubts/create/`,
  GET_DOUBTS: `${API_URL}/api/doubts/`,
  // add more endpoints as needed
};