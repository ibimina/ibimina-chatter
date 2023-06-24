import { firebaseAuth, firebaseStore } from '@/firebase/config';
import { signIn } from '@/store/action';
import { useAuthContext } from '@/store/store';
import { SignUpProps } from '@/types/signup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function useSignUp() {
	const { dispatch } = useAuthContext();
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
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
			const userInfo = {
				uid: userRef?.uid, displayName: userRef?.displayName,
				email: userRef?.email, photoURL: userRef?.photoURL,
				topics: [], profile_tagline: "", location: "",
				bio: "", twitter: "", github: "", instagram: "",
				website: "", linkedin: "", youtube: "", facebook: ""
			};
			await setDoc(doc(firebaseStore, "users", userCredential?.user?.uid), userInfo);
			// Signed in
			Cookies.set("loggedin", "true");
			dispatch(signIn(userInfo));
			setIsLoading(false);
			router.push("/topics")
		} catch (error: any) {
			setError(error.message);
			setIsLoading(false);
		}
	};
	return { createUser, error, isLoading };
}
