import axios from "axios";
import { LoginReq, LoginRes } from "../../types";
import { config } from "../../config/config";

export const loginApi = async (data: LoginReq): Promise<LoginRes> => {
  const url = config.authBaseUrl + config.tokenEndpoint;
  console.log("Login API URL:", url);
  const formData = new URLSearchParams();
  formData.append("grant_type", config.passwordType);
  formData.append("client_id", config.clientId);
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("client_secret", config.clientSecret);
  formData.append("scope", config.scope);

  const response = await axios.post(url, formData.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};
