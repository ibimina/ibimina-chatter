import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { onSnapshot, DocumentData, collection,  } from "firebase/firestore";
import {  useEffect, useState } from "react";

function useMessage() {
    const [messages, setMessages] = useState<DocumentData>()
    const { state } = useAuthContext()

    useEffect(() => {
        if (state?.user?.uid.length > 0) {
            const getMessages = async () => {
                const q = collection(firebaseStore, "messages", `${state?.user?.uid}`, "chats")
                onSnapshot(q, (snap) => {
                    let arr: DocumentData  = []
                    snap.forEach((d) => {

                        arr.push(d.data()?.contact)
                    })
                    const sortedMessages = arr.sort((a: any, b: any) => {
                        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    })
                    setMessages(sortedMessages)
                })
            }
            getMessages()
        }else{
            setMessages([])
        }
    }, [state?.user?.uid])
    return { messages }
}

export default useMessage;