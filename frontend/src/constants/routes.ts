const appRoute = (toPath: string) => `${process.env.NEXT_PUBLIC_URL}/${toPath}`;
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_URL;
const endpointV1 = `${endpoint}/api/v1`;
export const clientRoutes = {
  auth: {
    login: `${process.env.NEXT_PUBLIC_URL}/login`,
    logout: `${process.env.NEXT_PUBLIC_URL}/logout`,
  },
  profile: { index: appRoute("/profile") },
  dashboard: appRoute("/dashboard"),
};

export const apiRoutes = {
  auth: {
    refreshToken: `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/auth/refresh-token`,
  },
  user: {
    get: `${endpointV1}/user`,
  },
  collections: {
    addCollection: `${endpointV1}/collections`,
  },
  execute: {
    code: `${endpointV1}/execute`,
  },
};
