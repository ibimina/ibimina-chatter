import { firebaseAuth } from '@/firebase/config';
import { logIn } from '@/store/action';
import { useAuthContext } from '@/store/store';
import { LoginProps } from '@/types/login';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

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
       
            // Signed in
            const userRef = userCredential.user;
            dispatch(logIn(userRef));
            setIsLoading(false);
        } catch (error: any) {
            setError(error.message);
            setIsLoading(false);
        }
    };
    return { loginUser, error, isLoading };
}
