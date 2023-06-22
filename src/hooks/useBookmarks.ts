import { useAuthContext } from "@/store/store";
import { useCollection, useInteraction } from ".";
import { firebaseStore } from "@/firebase/config";
import { UserBookmarkProps } from "@/types";
import { DocumentData, getDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";

function useBookmarks() {
    const { state } = useAuthContext();
    const { data } = useCollection("bookmarks", state?.user?.uid)
    const [feeds, setFeeds] = useState<DocumentData>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        let arr: DocumentData = []
        if (!data?.bookmarks) {
            setLoading(false)
            return
        } else {
            data?.bookmarks?.forEach(async (bookmark: { article_uid: string }) => {
                const ref = await getDoc(doc(firebaseStore, "articles", bookmark?.article_uid))
                arr.push({ ...ref.data(), id: ref.id });
                setFeeds(arr)
                setLoading(false)
            })
        }
    }, [data?.bookmarks]);

    const { addBookmark } = useInteraction()
    const update = (id: string, bookmark: UserBookmarkProps[]) => {
        setFeeds(feeds!.filter((feed: { id: string; }) => feed?.id !== id))
        console.log(id, feeds)
        addBookmark(id, bookmark)
    }
    return { feeds, update, loading }
}

export default useBookmarks;