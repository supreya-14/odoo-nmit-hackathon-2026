import api from "./api.js";

// Every function here maps directly to one backend auth route.
// Pages never call axios/api directly — they always go through here.

// POST /api/auth/login
// loginId can be an employee ID (e.g. OT-JODO-2023-0001) or an email.
export async function loginUser({ loginId, password }) {
  const { data } = await api.post("/auth/login", { loginId, password });
  return data; // { token, user }
}

// POST /api/auth/register
// Used for the first admin/company sign-up. Employees created later by
// an admin do not use this route — they get an auto-generated ID + temp
// password instead (see backend/utils/generateEmployeeId.js).
export async function registerCompany(formData) {
  const { data } = await api.post("/auth/register", formData);
  return data; // { token, user }
}

// GET /api/auth/me
export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data; // { user }
}

// POST /api/auth/logout
export async function logoutUser() {
  await api.post("/auth/logout");
}
