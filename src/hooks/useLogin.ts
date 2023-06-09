import { firebaseAuth, firebaseStore } from '@/firebase/config';
import { signIn } from '@/store/action';
import { useAuthContext } from '@/store/store';
import { LoginProps } from '@/types/login';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

export default function useLogin() {
    const { dispatch } = useAuthContext();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const loginUser = async ({ email, password }: LoginProps) => {
        try {
            setIsLoading(true);
            const userCredential = await signInWithEmailAndPassword(
                firebaseAuth,
                email,
                password
            );
            const docRef = doc(firebaseStore, "users", userCredential?.user?.uid);
            const docSnap = await getDoc(docRef);
            dispatch(signIn(docSnap?.data()!));
            setIsLoading(false);
        } catch (error: any) {
            setError(error.message);
            setIsLoading(false);
        }
    };
    return { loginUser, error, isLoading };
}
