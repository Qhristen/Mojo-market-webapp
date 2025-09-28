import { getAccessToken } from "@privy-io/react-auth";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
  baseUrl: "/api", // adjust to your backend base URL
  prepareHeaders: async (headers) => {
    try {
      // ⚡ Get the Privy access token
      const token = await getAccessToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (err) {
      console.warn("No Privy access token:", err);
    }

    return headers;
  },
});