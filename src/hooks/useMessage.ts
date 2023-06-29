import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { onSnapshot, doc, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";

function useMessage() {
    const [messages,setMessages] = useState<DocumentData>()
    const {state} = useAuthContext()

    useEffect(() => {
        if ( state?.user?.uid){
            onSnapshot(doc(firebaseStore, "messages", `${state?.user?.uid}`), (doc) => {
                if (doc.exists() && doc.data()?.following?.length > 0) {
                    setMessages(doc.data()?.following)

                } else {
                    setMessages([])
                }
            });
        }
        // return () => unsub() 
    }, [state?.user?.uid])
    return {messages}
}

export default useMessage;