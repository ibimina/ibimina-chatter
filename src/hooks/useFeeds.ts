import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { query, collection, onSnapshot, DocumentData, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

function useFeeds() {
    const [feeds, setFeeds] = useState<DocumentData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [following,setFollowing] =useState<DocumentData>()
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
                
                const isFollowingUser = following?.some((topic:any) => {
                    return doc?.data()?.author?.uid === topic.author  && doc?.data()?.published;
                });
              
                if ((doc.data().published && state?.user?.uid === doc?.data().author?.uid) || isUserTopic || isFollowingUser) {
                    articles.push({ ...doc.data(), id: doc.id });
                }
            });
            setFeeds(articles.sort((a: { timestamp: any }, b: { timestamp: any }) => new Date(b?.timestamp).getTime() - new Date(a?.timestamp).getTime()));
            setIsLoading(false)
        });

        return () => unsubscribe();
    }, [following, state?.user?.topics, state?.user?.uid]);

    useEffect(() => {
        if (state?.user?.uid){
      onSnapshot(doc(firebaseStore, "following", `${state?.user?.uid}`), (doc) => {
                if (doc.exists() && doc.data()?.following?.length > 0) {
                    setFollowing(doc.data()?.following)
                } else {
                    setFollowing([])
                }
            });       
        }      
        // return () => unsub()

    }, [state?.user?.uid])

    return { feeds, isLoading };
}

export default useFeeds;