import { createContext, useEffect, useReducer } from "react";
import { AUTH_STATE_CHANGED, LOG_IN, SIGN_IN, SIGN_OUT } from "./action";
import { firebaseAuth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { UserProps } from "@/types/user";

export const InitialState = {
    user: {} as UserProps,
    authState: false,
};

export const authReducer = (state = InitialState, action: { type: string; payload: any; }) => {
    if (action.type === SIGN_IN) {
        return {
            ...state,
            user: action.payload,
        }
    }
    if (action.type === LOG_IN) {
        return {
            ...state,  
            user: action.payload,
        }
    }
    if (action.type === SIGN_OUT) {
        return {
            ...state,     
            user: null,
        }
    }
    if (action.type === AUTH_STATE_CHANGED) {
        return {
            ...state,
            authState: true,
            user: action.payload,
        }
    }
    return state;
}
export const AuthContext = createContext({
    state: InitialState,
    dispatch: (action: { type: string; payload: any; }) => { },
});
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, InitialState);
    useEffect(() => {
        const unsub = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                dispatch({
                    type: AUTH_STATE_CHANGED,
                    payload: user,
                })
            }
        } )
        unsub()
    }, [])

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}
