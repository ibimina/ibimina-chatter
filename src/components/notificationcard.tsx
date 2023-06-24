import Link from "next/link";
import Image from "next/image";

function NotificationCard({ notification }: {
    notification: {
        event: string,
        event_username: string,
        event_userimage: string,
        event_user: string,
        articleTitle: string,
        articleId: string
    }
}) {
    const author = notification?.event_user
    const id = notification.articleId
 
    return (
        <>
            <div className="py-4" >
                <div className="">
                    <Link href={`/${encodeURIComponent(author)}`} className="flex items-center gap-2 mb-2">
                        {
                            notification.event === "liked" &&
                            <Image src='/images/icons8-love-48.png' height={24} width={24} alt="like" />}
                        {
                            notification.event_userimage === null &&
                            <Image className={`rounded-full`} src="/images/icons8-user.svg" width={30} height={30} alt={`${notification.event_username}`} />
                        }
                        {
                            notification.event_userimage &&
                            <Image className={`rounded-full`} src={notification.event_userimage} width={30} height={30} alt={`${notification.event_username}`} />
                        }
                    </Link>

                    <p className="text-sm">
                        <span className="text-gray-900 leading-none font-bold">@{notification?.event_username}  </span>
                        <span className="text-gray-600">{notification?.event} {notification?.event === "liked"? "your article" : "on your article"}  </span>
                        <Link className="text-gray-600 font-medium" href={`/${encodeURIComponent(author)}/${encodeURIComponent(id)}`}>{notification?.articleTitle}</Link>
                    </p>
                </div>
            </div>
        </>);
}

export default NotificationCard;