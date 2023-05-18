import { firebaseAuth } from '@/firebase/config';
import { signIn } from '@/store/action';
import { useAuthContext } from '@/store/store';
import { SignUpProps } from '@/types/signup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';

export default function useSignUp() {
	const { dispatch } = useAuthContext();
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const createUser = async ({ username, email, password }: SignUpProps) => {
		try {
			setIsLoading(true);
			const userCredential = await createUserWithEmailAndPassword(
				firebaseAuth,
				email,
				password
			);
			await updateProfile(userCredential.user, {
				displayName: username,
			});
			// Signed in
			const userRef = userCredential.user;
			dispatch(signIn(userRef));
			setIsLoading(false);
		} catch (error: any) {
			setError(error.message);
			setIsLoading(false);
			console.log(error);
		}
	};
	return { createUser, error, isLoading };
}
