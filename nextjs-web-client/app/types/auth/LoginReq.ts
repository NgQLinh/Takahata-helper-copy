export interface LoginReq {
  userName: string;
  password: string;
}

export function createLoginReq(userName: string, password: string): LoginReq {
  return {
    userName: userName,
    password,
  };
}
