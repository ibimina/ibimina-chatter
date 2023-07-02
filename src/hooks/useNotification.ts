import { useAuthContext } from "@/store/store";
import { DocumentData, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import useCollection from "./useCollection";
import { firebaseStore } from "@/firebase/config";
import { NotificationProps } from "@/types";


function useNotification() {
    const [notifications, setNotifications] = useState<DocumentData | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { state } = useAuthContext()
    const { data } = useCollection("notifications", `${state?.user?.uid}`)

    //mark all notifications as read
    const markasRead = async () => {
        if (data?.notification?.length > 0) {
            const docRef = doc(firebaseStore, "notifications", `${state?.user?.uid}`)
            const updateNotificationArray = data?.notification?.map((n: NotificationProps) => n.read ? n : { ...n, read: true })
            await setDoc(docRef, { notification: updateNotificationArray }, { merge: true })
        }
    }

    useEffect(() => {
        //get user doc notifications
    
        const getNotifications = async () => {
            let notificationsArr: DocumentData = []
            if(!data?.notification){
                setNotifications([])
                setIsLoading(false)
                return
            } else if(data?.notification?.length > 0) {
                setIsLoading(true)
                data?.notification?.forEach((notification: NotificationProps) => {
                    if (notification?.event_user !== state?.user?.uid) {
                        notificationsArr.push(notification)
                    }
                })
                notificationsArr.sort((a: { timestamp: string }, b: { timestamp: string }) => new Date(b?.timestamp).getTime() - new Date(a?.timestamp).getTime())
                setNotifications(notificationsArr)
                setIsLoading(false)
            } else{
                setNotifications([])
                setIsLoading(false)
            }
              setIsLoading(false)
            
        }
        getNotifications()

        return () => { getNotifications }

    }, [data?.notification, state?.user?.uid])

    return { notifications, isLoading, markasRead };
}

export default useNotification;