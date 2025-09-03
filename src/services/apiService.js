const BASE_URL = "http://localhost:9000";

const fetchWithErrorHandling = async (url, options) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const apiService = {
  get: (url, options = {}) =>
    fetchWithErrorHandling(url, {
      method: "GET",
      ...options,
    }),
  post: (url, data) =>
    fetchWithErrorHandling(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  // Add put, delete, etc. as needed
};

export default apiService;