import { UserProps } from '@/types/user';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const LOG_IN = 'LOG_IN';
export const AUTH_STATE_CHANGED = 'AUTH_STATE_CHANGED';
export const GOOGLE_AUTH = 'GOOGLE_AUTH';
export const GITHUB_AUTH = 'GITHUB_AUTH'

export const signIn = (user: UserProps) => ({
	type: SIGN_IN,
	payload: user,
});

export const logOut = () => ({
	type: SIGN_OUT,
});

export const logIn = (user: UserProps) => ({
	type: LOG_IN,
	payload: user,
});

export const authStateChanged = (user: UserProps) => ({
	type: AUTH_STATE_CHANGED,
	payload: user,
});

export const googleAuth = (user: UserProps) => ({
	type: GOOGLE_AUTH,
	payload: user,
})

export const githubAuth = (user: UserProps) => ({
	type: GITHUB_AUTH,
	payload: user,
})