import { createContext, useEffect, useReducer } from 'react';
import { AUTH_STATE_CHANGED, GITHUB_AUTH, GOOGLE_AUTH, LOG_IN, SIGN_IN, SIGN_OUT } from './action';
import { firebaseAuth, firebaseStore } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const InitialState = {
    user: {
        uid: '',
        email: '',
        displayName: '',
        photoURL: '',
        tags: [],  
    },
    authState: false,
};

export const authReducer = (
    state = InitialState,
    action: { type: string; payload?: any }
) => {
    if (action.type === SIGN_IN) {
        return {
            ...state,
            user: action.payload,
        };
    }
    if (action.type === LOG_IN) {
        return {
            ...state,
            user: action.payload,
        };
    }
    if (action.type === SIGN_OUT) {
        return {
            ...state,
            user: null,
        };
    }
    if(action.type === GOOGLE_AUTH){
        return {
            ...state,
            user: action.payload,
        };
    } if (action.type === GITHUB_AUTH) {
        return {
            ...state,
            user: action.payload,
        };
    }

    if (action.type === AUTH_STATE_CHANGED) {
        return {
            ...state,
            authState: true,
            user: action.payload,
        };
    }
    return state;
};
export const AuthContext = createContext({
    state: InitialState,
    dispatch: (action: { type: string; payload?: any }) => { },
});
export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [state, dispatch] = useReducer(authReducer, InitialState);
    useEffect(() => {
        const unsub = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                const docRef = doc(firebaseStore, "users", user.uid);
                const docSnap = await getDoc(docRef);
                dispatch({
                    type: AUTH_STATE_CHANGED,
                    payload: docSnap.data(),
                });
            }else{
                dispatch({
                    type: AUTH_STATE_CHANGED,
                    payload: null,
                });
            }
        });
        unsub();
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
