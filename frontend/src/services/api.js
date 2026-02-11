import { backendUrl } from "../backendUrl";

const API = backendUrl;

export const apiFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(API + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: "Bearer " + token })
    }
  });
};
