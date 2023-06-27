import { useAuthContext } from "@/store/store";
import { DocumentData, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import useCollection from "./useCollection";
import { firebaseStore } from "@/firebase/config";
import { set } from "cypress/types/lodash";


function useNotification() {
    const [notifications, setNotifications] = useState<DocumentData | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { state } = useAuthContext()
    const { data } = useCollection("notifications", `${state?.user?.uid}`)
   
    interface t {
        event: string,
        event_username: string,
        event_userimage: string,
        event_user: string,
        articleTitle: string,
        articleId: string
        read: boolean
    }
    //mark all notifications as read
    const markasRead = async () => {
        if (data?.notification?.length > 0) {
            const docRef = doc(firebaseStore, "notifications", `${state?.user?.uid}`)
            const updateNotificationArray = data?.notification?.map((n: t) => n.read ? n : { ...n, read: true })
            await setDoc(docRef, { notification: updateNotificationArray }, { merge: true })
        }
    }

    useEffect(() => {
        //get user doc notifications
       
        const getNotifications = async () => {
            setIsLoading(true)
            let notificationsArr: DocumentData = []
            if(!data?.notification){
                setNotifications([])
                setIsLoading(false)
                return
            } else if(data?.notification?.length > 0) {
                setIsLoading(true)
                data?.notification?.forEach((notification: any) => {
                    if (notification?.event_user !== state?.user?.uid) {
                        notificationsArr.push(notification)
                    }
                })
                notificationsArr.sort((a: { timestamp: any }, b: { timestamp: any }) => new Date(b?.timestamp).getTime() - new Date(a?.timestamp).getTime())
                setNotifications(notificationsArr)
                setIsLoading(false)
            } 
              
            
        }
        getNotifications()

        return () => { getNotifications }

    }, [data?.notification, state?.user?.uid])

    return { notifications, isLoading, markasRead };
}

export default useNotification;