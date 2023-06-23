import { NotificationCard } from "@/components";
import FeedLayout from "@/container/feedslayout";
import { useCollection } from "@/hooks";
import { useAuthContext } from "@/store/store";
import { DocumentData } from "firebase/firestore";
import { Key, useEffect, useState } from "react";


function Notifications() {
    const [notifications, setNotifications] = useState<DocumentData | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { state } = useAuthContext()
    const { data } = useCollection("notifications", `${state?.user?.uid}`)

    useEffect(() => {
        //get user doc notifications
        setIsLoading(true)
        const getNotifications = async () => {
            let notificationsArr: DocumentData = []
            if (data?.notification?.length > 0) {
                data?.notification?.forEach((notification: any) => {
                    if (notification?.event_user !== state?.user?.uid) {
                        notificationsArr.push(notification)
                    }
                })
                notificationsArr.sort((a: { timestamp: any }, b: { timestamp: any }) => new Date(b?.timestamp).getTime() - new Date(a?.timestamp).getTime())
                setNotifications(notificationsArr)
            } else {
                setNotifications([])
            }
            setIsLoading(false)
        }

        getNotifications()

        return () => { getNotifications }

    }, [data, state?.user?.uid])

    return (<>

        <FeedLayout>
            <main className={`w-full lg:w-4/6`}>
                <h1 className="font-bold ">
                    Notifications
                </h1>
                {isLoading && <p className="h-56 flex items-center justify-center">Loading...</p>}
                {!isLoading && notifications?.length === 0 && <p className="text-center text-2xl h-56 flex items-center justify-center">No notifications</p>}
                {
                    notifications?.map((notification: {
                        event: string,
                        event_username: string,
                        event_userimage: string,
                        event_user: string,
                        articleTitle: string,
                        articleId: string

                    }, index: Key) => {
                        return (
                            <NotificationCard key={index} notification={notification} />
                        )
                    })
                }
            </main>
        </FeedLayout>
    </>);
}

export default Notifications;