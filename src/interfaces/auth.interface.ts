export interface ISignUp {
	username: string;
	email: string;
	password: string;
	confirm_password: string;
}

export type ILogin = {
    email: string;
    password: string;
}