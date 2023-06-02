import { firebaseAuth, firebaseStore } from '@/firebase/config';
import { signIn } from '@/store/action';
import { useAuthContext } from '@/store/store';
import { SignUpProps } from '@/types/signup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
				displayName: username
			});
			const userRef = userCredential.user;
			const userInfo = { uid: userRef?.uid, displayName: userRef?.displayName, email: userRef?.email, photoURL: userRef?.photoURL, tags: [] };
			await setDoc(doc(firebaseStore, "users", userCredential?.user?.uid), userInfo);
			// Signed in
			dispatch(signIn(userInfo));
			setIsLoading(false);
		} catch (error: any) {
			setError(error.message);
			setIsLoading(false);
		}
	};
	return { createUser, error, isLoading };
}
