import { useAuthContext } from "@/store/store"
import { ArticleProps } from "@/types"
import { DocumentData } from "firebase/firestore"
import { useEffect, useState } from "react"

export const Isliked = (feed:DocumentData | undefined) => {
    const [isliked, setIsLiked] = useState(false)
    const [isbookmarked, setIsBookmarked] = useState(false)
    const { state } = useAuthContext()

    useEffect(() => {
        const like = feed?.likes?.find((like: { uid: string }) => like?.uid === state?.user?.uid)
        const bookmark = feed?.bookmarks?.find((bookmark: { user_uid: string }) => bookmark?.user_uid === state?.user?.uid)
        if (like !== undefined) {
            setIsLiked(true)
        } else {
            setIsLiked(false)
        }
        if (bookmark !== undefined) {
            setIsBookmarked(true)
        } else {
            setIsBookmarked(false)
        }
    }, [feed, feed?.bookmarks, feed?.likes, state?.user?.uid])

    return { isbookmarked, isliked }
}