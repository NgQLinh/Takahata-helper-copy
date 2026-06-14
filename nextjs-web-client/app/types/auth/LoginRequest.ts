export interface LoginRequest {
  userName: string;
  password: string;
}

export function createLoginRequest(
  userName: string,
  password: string,
): LoginRequest {
  return {
    userName: userName,
    password,
  };
}
