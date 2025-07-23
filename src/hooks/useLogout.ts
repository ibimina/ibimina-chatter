import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function useLogOut() {
  const [error, setError] = useState(null);
    const router = useRouter();

    const logoutUser = async () => {
        // try {  
        //     await signOut(firebaseAuth);
        //     dispatch(logOut());
        //     Cookies.remove("loggedin");
        //     router.push("/");
        
        // } catch (error: any) {
        //     setError(error.message);
        // }
    };
    return { logoutUser,error };
}
