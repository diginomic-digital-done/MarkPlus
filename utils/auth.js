// Utility functions for staff authentication

export function isStaffAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('staffAuthToken');
}

export function logoutStaff() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('staffAuthToken');
  window.location.href = '/staff-login';
}
// utils/auth.js

// Dummy implementation for verifyAdmin
// Replace with your actual authentication logic
export async function verifyAdmin(req) {
  // Example: check for a custom header or session
  // return req.headers["x-admin-authenticated"] === "true";
  // For now, always return true (allow all)
  return true;
}
