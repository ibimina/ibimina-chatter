import { firebaseAuth, googleAuthProvider } from "@/firebase/config";
import { githubAuth } from "@/store/action";
import { useAuthContext } from "@/store/store";
import { signInWithPopup } from "firebase/auth";

export const useGitHubSignin = () => {
    const { dispatch } = useAuthContext()

    const github = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleAuthProvider)
            const user = result.user;
            dispatch(githubAuth(user))
            // ...
        } catch (error: any) {
            console.log(error)
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
    return { github }
}