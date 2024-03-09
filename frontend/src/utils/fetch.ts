import { ErrorEnum, clientRoutes } from "@/constants";
import { getCookie, refreshAuthToken } from "./auth";

interface FetchType<T = unknown> {
  url: string;
  input?: T;
  method?: "GET" | "POST";
  type?: "application/json" | "multipart/form-data";
}

/** Helper function to fetch data from the backend, can be used in conjunction with React-Query */
export const request = async <R = unknown, I = unknown>({
  url,
  input,
  method = "GET",
  type = "application/json",
}: FetchType<I>): Promise<Awaited<R>> => {
  const authToken = getCookie("authToken");
  const refreshToken = getCookie("refreshToken");
  if (authToken && refreshToken)
    await refreshAuthToken({ authToken, refreshToken });
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": type,
      Authorization: getCookie("authToken") || "",
    },
    body: method !== "GET" ? JSON.stringify(input) : undefined,
  });
  const res = await response.json();

  if ("code" in res) {
    if (res.code === ErrorEnum.UNAUTHORIZED) {
      window.location.assign(`${clientRoutes.auth.logout}?expired`);
    }
    throw new Error(res.code as string);
  } else if (!response.ok) {
    throw new Error(`${response.status}`);
  }
  return res;
};
