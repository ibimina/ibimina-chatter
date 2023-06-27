import { firebaseAuth, firebaseStore, googleAuthProvider } from "@/firebase/config";
import { signIn } from "@/store/action";
import { useAuthContext } from "@/store/store";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { useRouter } from 'next/router';

const useGoogleSignin = () => {
    const { dispatch } = useAuthContext()
    const router = useRouter()

    const google = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleAuthProvider)
            const user = result.user;
            const docRef = doc(firebaseStore, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                dispatch(signIn(docSnap.data()))
                Cookies.set("loggedin", "true");
                router.push('/chatter');
            } else {
                const userInfo = {
                    uid: user?.uid, displayName: user?.displayName, email: user?.email, photoURL: user?.photoURL, profile_tagline: "", location: "",
                    bio: "", twitter: "", github: "", instagram: "", topics: [],
                    website: "", linkedin: "", youtube: "", facebook: ""
                }
                await setDoc(doc(firebaseStore, "users", user?.uid), userInfo);
                dispatch(signIn(userInfo))
                Cookies.set("loggedin", "true");
                router.push('/topics');
            }
          
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
export default useGoogleSignin