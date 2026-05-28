export const config = {
  apiUrl: process.env.REACT_APP_BASE_URL || "",
  realm: process.env.REACT_APP_REALM || "",
  passwordType: process.env.REACT_APP_PASSWORD_TYPE || "password",
  clientId: process.env.REACT_APP_CLIENT_ID || "",
  clientSecret: process.env.REACT_APP_CLIENT_SECRET || "",
  authBaseUrl: process.env.REACT_APP_AUTH_BASE_URL || "",
  tokenEndpoint: process.env.REACT_APP_TOKEN_ENDPOINT || "",
  scope: process.env.REACT_APP_SCOPE || ""
};