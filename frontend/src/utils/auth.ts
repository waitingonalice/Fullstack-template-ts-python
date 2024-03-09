import cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { apiRoutes } from "@/constants";
import { getDomain } from "./formatting";

export const setCookie = (
  key: string,
  value: string,
  options?: Parameters<(typeof cookies)["set"]>[2],
) => {
  cookies.set(key, value, {
    domain: getDomain(window.location.hostname),
    path: "/",
    secure: true,
    sameSite: "strict",
    httpOnly: false,
    ...options,
  });
};

export const getCookie = (key: string) => cookies.get(key);

export const removeCookie = (key: string) =>
  cookies.remove(key, { domain: getDomain(window.location.hostname) });
interface RefreshAuthTokenResponse {
  result: {
    auth: string;
  };
}

interface RefreshAuthTokenArgType {
  authToken: string;
  refreshToken: string;
}

export const jwt = <T>(...args: Parameters<typeof jwtDecode>) => {
  try {
    const result = jwtDecode<T>(...args);
    return result;
  } catch (err) {
    return null;
  }
};

export const refreshAuthToken = async (tokens: RefreshAuthTokenArgType) => {
  const { authToken, refreshToken } = tokens;
  try {
    const decodedAuth = jwt<{ exp: number }>(authToken);
    if (authToken && refreshToken) {
      const authExpired = decodedAuth && decodedAuth.exp * 1000 < Date.now();
      if (!authExpired) return;
      const res = await fetch(apiRoutes.auth.refreshToken, {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: RefreshAuthTokenResponse = await res.json();
      setCookie("authToken", data.result.auth);
    }
  } catch (err) {
    console.error(err);
  }
};

export const logout = () => {
  removeCookie("refreshToken");
  removeCookie("authToken");
};
