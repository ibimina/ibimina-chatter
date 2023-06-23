import { useAuthContext } from "@/store/store";
import { useCollection, useInteraction } from ".";
import { firebaseStore } from "@/firebase/config";
import { UserBookmarkProps } from "@/types";
import { DocumentData, getDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";

function useBookmarks() {
    const { state } = useAuthContext();
    const { data } = useCollection("bookmarks", state?.user?.uid)
    const [feeds, setFeeds] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
    setLoading(true)
        //get user bookmarks
        const getBookmarks = async () => {
           
            if (!data?.bookmarks) {
                setLoading(false)
            } else {
                const bookmarks = await Promise.all(data?.bookmarks?.map(async (bookmark: { article_uid: string; }) => {
                    const docRef = doc(firebaseStore, "articles", bookmark?.article_uid);
                    const docSnap = await getDoc(docRef);
                    return { ...docSnap.data(), id: docSnap.id };
                }))
                setFeeds(bookmarks)
                setLoading(false)
            }
        }
        getBookmarks()

    }, [data?.bookmarks]);

    const { addBookmark } = useInteraction()
    const update = (id: string, bookmark: UserBookmarkProps[]) => {
        setFeeds(feeds!.filter((feed: { id: string; }) => feed?.id !== id))
        addBookmark(id, bookmark)
    }
    return { feeds, update, loading }
}

export default useBookmarks;