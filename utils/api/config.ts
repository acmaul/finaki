import axios from "axios";
import jwtDecode from "jwt-decode";
import { refreshAccessToken } from "./authApi";

// const BASE_URL = "https://finaki-backend-git-test-axcamz.vercel.app/api"; // test server
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://finaki-backend.acmal.me/api"
    : "http://localhost:3001/api";

export const makeUrl = (path: string, parameters: any) => {
  if (!parameters) return path;

  const params = Object.keys(parameters)
    .map((key) => {
      return `${key}=${parameters[key]}`;
    })
    .join("&");

  return `${path}?${params}`;
};

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    let currentToken = window?.localStorage.getItem("access-token");

    if (currentToken === null || currentToken === undefined) {
      const refreshToken = await refreshAccessToken();
      window?.localStorage.setItem(
        "access-token",
        refreshToken.data.access_token
      );
      currentToken = refreshToken.data.access_token;
    } else {
      const decodedToken = jwtDecode(currentToken);
      const currentTime = new Date().getTime();
      if ((decodedToken as any).exp * 1000 < currentTime) {
        const refreshToken = await refreshAccessToken();
        window?.localStorage.setItem(
          "access-token",
          refreshToken.data.access_token
        );
        currentToken = refreshToken.data.access_token;
      }
    }

    config.headers["Authorization"] = `Bearer ${currentToken}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
