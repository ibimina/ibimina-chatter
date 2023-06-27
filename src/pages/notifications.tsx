import { NotificationCard } from "@/components";
import FeedLayout from "@/container/feedslayout";
import useNotification from "@/hooks/useNotification";
import Head from "next/head";
import { Key, useEffect } from "react";


function Notifications() {
    const { notifications, isLoading, markasRead } = useNotification()

    useEffect(() => {
        markasRead()
    })

    return (<>
        <Head>
            <title>Notifications - InkSpire</title>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="IE=7" />
            <meta name="description" content="notifications" />
        </Head>
        <FeedLayout>
            <main className={`w-full lg:w-4/6`}>
                <h1 className="font-bold ">
                    Notifications
                </h1>
                {isLoading && <p className="h-56 flex items-center justify-center">Loading...</p>}
                {!isLoading && notifications?.length === 0 && <p className="text-center text-2xl h-56 flex items-center justify-center">No notifications</p>}
                {notifications &&
                    notifications?.map((notification: {
                        event: string,
                        event_username: string,
                        event_userimage: string,
                        event_user: string,
                        articleTitle: string,
                        articleId: string
                        read: boolean

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