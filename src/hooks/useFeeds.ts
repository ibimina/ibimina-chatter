import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { query, collection, onSnapshot, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";

function useFeeds() {
    const [feeds, setFeeds] = useState<DocumentData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { state } = useAuthContext();
    useEffect(() => {
        setIsLoading(true)
        const q = query(collection(firebaseStore, 'articles'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            
            const articles: DocumentData = [];
            querySnapshot.forEach((doc) => {
                const isUserTopic = state?.user?.topics?.some((topic) => {
                    return doc?.data()?.topics?.includes(topic) && doc?.data()?.published;
                });
                if ((doc.data().published && state?.user?.uid === doc?.data().author?.uid) || isUserTopic) {
                    articles.push({ ...doc.data(), id: doc.id });
                }
            });
            setFeeds(articles);
            setIsLoading(false)
        });

        return () => unsubscribe();
    }, [state?.user?.topics, state?.user?.uid]);

    return { feeds, isLoading };
}

export default useFeeds;