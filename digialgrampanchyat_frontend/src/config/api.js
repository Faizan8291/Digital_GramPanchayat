const API_ORIGIN = "http://localhost:7500";

export const API = {
  origin: API_ORIGIN,
  auth: {
    login: `${API_ORIGIN}/api/auth/login`,
    register: `${API_ORIGIN}/api/auth/register`,
    registerWithRole: (roleId) => `${API_ORIGIN}/api/auth/register/role/${roleId}`,
    adminLogin: `${API_ORIGIN}/api/admin/login`
  },
  admin: {
    users: `${API_ORIGIN}/api/admin/users`,
    userById: (id) => `${API_ORIGIN}/api/admin/users/${id}`,
    activateUser: (id) => `${API_ORIGIN}/api/admin/users/${id}/activate`,
    statistics: `${API_ORIGIN}/api/admin/statistics`
  },
  certificates: {
    apply: `${API_ORIGIN}/api/certificates/apply`,
    myApplications: (applicantId) =>
      `${API_ORIGIN}/api/certificates/my-applications?applicantId=${applicantId}`,
    pending: (query = "") =>
      `${API_ORIGIN}/api/certificates/pending${query ? `?${query}` : ""}`,
    all: (query = "") =>
      `${API_ORIGIN}/api/certificates/all${query ? `?${query}` : ""}`,
    download: (id, applicantId) =>
      `${API_ORIGIN}/api/certificates/${id}/download?applicantId=${applicantId}`,
    approve: (id) => `${API_ORIGIN}/api/certificates/${id}/approve`,
    reject: (id) => `${API_ORIGIN}/api/certificates/${id}/reject`
  },
  userTypes: `${API_ORIGIN}/getusertypes`
};
