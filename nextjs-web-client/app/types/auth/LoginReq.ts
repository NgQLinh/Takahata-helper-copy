export interface LoginReq {
  email: string;
  password: string;
}

export function createLoginReq(email: string, password: string): LoginReq {
  return {
    email,
    password,
  };
}
