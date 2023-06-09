import { UserProps } from '@/types/user';
import { DocumentData } from 'firebase/firestore';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const LOG_IN = 'LOG_IN';
export const AUTH_STATE_CHANGED = 'AUTH_STATE_CHANGED';
export const GOOGLE_AUTH = 'GOOGLE_AUTH';
export const GITHUB_AUTH = 'GITHUB_AUTH'

export const signIn = (user:DocumentData | UserProps) => ({
	type: SIGN_IN,
	payload: user,
});

export const logOut = () => ({
	type: SIGN_OUT,
});

export const authStateChanged = (user: UserProps) => ({
	type: AUTH_STATE_CHANGED,
	payload: user,
});
