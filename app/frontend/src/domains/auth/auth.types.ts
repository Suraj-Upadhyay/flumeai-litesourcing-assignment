export interface ISignupRequest {
  username: string;
  password: string;
  confirm_password: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}
