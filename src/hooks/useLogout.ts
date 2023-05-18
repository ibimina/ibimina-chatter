import { firebaseAuth } from '@/firebase/config';
import { logOut } from '@/store/action';
import { useAuthContext } from '@/store/store';
import { signOut } from 'firebase/auth';
import { useState } from 'react';

export default function useLogOut() {
    const { dispatch } = useAuthContext();
  const [error, setError] = useState(null);

    const logoutUser = async () => {
        try {  
            await signOut(firebaseAuth);
            dispatch(logOut());
        
        } catch (error: any) {
            setError(error.message);
      
            console.log(error);
        }
    };
    return { logoutUser,error };
}
