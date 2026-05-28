export interface LoginReq {
  username: string;
  password: string;
}

export function createLoginReq(username: string, password: string): LoginReq {
  return {
    username,
    password,
  };
}
