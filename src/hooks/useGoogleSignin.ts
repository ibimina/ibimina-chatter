import { firebaseAuth, googleAuthProvider } from "@/firebase/config";
import { googleAuth } from "@/store/action";
import { useAuthContext } from "@/store/store";
import { signInWithPopup } from "firebase/auth";

export const useGoogleSignin = () => {
    const { dispatch } = useAuthContext()

    const google = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleAuthProvider)
            const user = result.user;
            dispatch(googleAuth(user))

        } catch (error: any) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            // const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        }
    }
    return { google }
}
