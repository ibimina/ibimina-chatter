import { createContext, useEffect, useReducer } from 'react';
import { AUTH_STATE_CHANGED, SIGN_IN, SIGN_OUT } from './action';
import { firebaseAuth, firebaseStore } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const InitialState = {
    user: {
        uid: '',
        email: '',
        displayName: '',
        photoURL: '',
        topics: [],
        profile_tagline: "",
        location: "",
        bio: "",
        twitter: "",
        github: "",
        instagram: "",
        website:"",
        linkedin:"",
        youtube:"",
        facebook:""
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
    if (action.type === SIGN_OUT) {
        return {
            ...state,
            user: null,
        };
    }

    if (action.type === AUTH_STATE_CHANGED) {
        return {
            ...state,
            authState: true,
            user: action.payload,
        };
    } if (action.type === "NAME") {
        return {
            ...state,
            authState: true,
            user: {...state.user,displayName:action.payload},
        };
    } if (action.type === "TAGLINE") {
        return {
            ...state,
            authState: true,
            user: { ...state.user, profile_tagline: action.payload },
        };
    } if (action.type === "LOCATION") {
        return {
            ...state,
            authState: true,
            user: { ...state.user, location: action.payload },
        };
    } if (action.type === "BIO") {
        return {
            ...state,
            authState: true,
            user: { ...state.user, bio: action.payload },
        };
    } if (action.type === "TWITTER") {
        return {
            ...state,
            authState: true,
            user: { ...state.user, twitter: action.payload },
        };
    } if (action.type === "WEBSITE") {
        return {
            ...state,
            authState: true,
            user: { ...state.user, website: action.payload },
        };
    } if (action.type === "INSTAGRAM") {
        return {
            ...state,
            authState: true,
            user: { ...state.user, instagram: action.payload },
        };
    } if(action.type === "LINKEDIN") {
        return {
            ...state,
            authState: true,
            user: { ...state.user, linkedin: action.payload },
        };
    } if (action.type === "GITHUB") {
        return {
            ...state,
            authState: true,
            user: { ...state.user, github: action.payload },
        };
    } if (action.type === "FACEBOOK") {
        return {
            ...state,
            authState: true,
            user: { ...state.user, facebook: action.payload },
        };
    } if (action.type === "YOUTUBE") {
        return {
            ...state,
            authState: true,
            user: { ...state.user, youtube: action.payload },
        };
    } if (action.type === "ADDTAG") {
        return {
            ...state,
            authState: true,
            user: { ...state?.user, topics: [...state?.user?.topics,action.payload] },
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
            } else {
                dispatch({
                    type: AUTH_STATE_CHANGED,
                    payload: InitialState.user,
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
