export type User = {
  email: string;
  full_name: string;
  name?: string;
  surname?: string;
  password?: string;
  role?: Role;
  token?: string;
  permissions?: Array<string>,
};
export type Role = {
  id?: string;
  name?: string;
};
export type ResponseAuthLogin = {
  user?: User;
  access_token?: string;
};