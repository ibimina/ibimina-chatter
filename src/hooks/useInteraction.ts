import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { ArticleProps, BookmarkProps, LikeProps } from "@/types";
import { DocumentData, collection, doc, getDoc, onSnapshot, query, setDoc } from "firebase/firestore";
import { useState } from "react";

function useInteraction() {
    const { state } = useAuthContext();


    const addBookmark = async (id: string, bookmarks: BookmarkProps[]) => {
        if (state?.user === null) {
            return alert("Please login to bookmark this article")
        }
        const docRef = doc(firebaseStore, 'articles', id);
        const bookmarkRef = doc(firebaseStore, 'bookmarks', state?.user?.uid);
        const hasBookmarked = bookmarks?.find((bookmark: BookmarkProps) => {
            return bookmark?.uid === state?.user?.uid
        })
        const bookmarkSnap = await getDoc(bookmarkRef)
        const userBookmarks = bookmarkSnap.data()?.bookmarks

        if (hasBookmarked === undefined) {
            await setDoc(docRef, {
                bookmarks: [
                    ...bookmarks,
                    {
                        uid: state?.user?.uid,
                    }]
            }, { merge: true });
            if (userBookmarks === undefined) {
                await setDoc(bookmarkRef, { bookmarks: [{ bookmark_uid: id }] })
            } else {
                await setDoc(bookmarkRef, {
                    bookmarks: [...userBookmarks, {
                        uid: id,
                    }]
                }, { merge: true });
            }
        } else {
            await setDoc(docRef, {
                bookmarks: bookmarks?.filter((bookmark: BookmarkProps) => {
                    return bookmark?.uid !== state?.user?.uid
                })

            }, { merge: true });

            await setDoc(bookmarkRef, {
                bookmarks: userBookmarks?.filter((bookmark: BookmarkProps) => {
                    return bookmark?.uid !== id
                })
            }, { merge: true });
        }
    }
    const increaseLike = async (id: string, likes: LikeProps[], article: ArticleProps) => {
        const hasLiked = likes.find((like: LikeProps) => {
            return like?.uid === state?.user?.uid
        })
        const docRef = doc(firebaseStore, 'articles', id);
        if (hasLiked) {
            await setDoc(docRef, {
                likes: likes.filter((like: LikeProps) => {
                    return like?.uid !== state?.user?.uid
                })
            }, { merge: true });
        } else if (likes.length === 0 || hasLiked === undefined) {
            await setDoc(docRef, {
                likes: [...
                    likes, {
                    uid: state?.user?.uid,
                    name: state?.user?.displayName,
                    image: state?.user?.photoURL
                }]
            }, { merge: true });
            if (state?.user.uid !== article?.author?.uid) await addNotification('liked', article)
        }
    }

    const addNotification = async (event: string, article: ArticleProps) => {
        const docRef = doc(firebaseStore, 'notifications', article?.author?.uid);
        const docSnap = await getDoc(docRef);
        await setDoc(docRef, {
            notification: [
                ...docSnap.data()?.notification,
                {
                    uid: state?.user?.uid,
                    name: state?.user?.displayName,
                    image: state?.user?.photoURL,
                    event: event,
                    articleId: article?.id,
                    articleTitle: article?.title,
                }]
        }, { merge: true });
    }
    const [feeds, setFeeds] = useState<DocumentData>([]);
    const [isLoading, setIsLoading] = useState<boolean | null>(null)
    const bo = () => {
        const q = query(collection(firebaseStore, 'bookmarks'));
        setIsLoading(true)
        const unsubscribe = onSnapshot(q, (querySnapshot) => {

            let articles: string[] = [];
            querySnapshot.forEach((docs) => {
       
                if (state?.user?.uid === docs?.id) {
                    docs?.data()?.bookmarks.forEach(async (bookmark: { uid: string }) => {
                        articles.push(bookmark?.uid)
                    })
                }
            });
            let r: DocumentData = []
            articles.forEach(async (bookmark: string) => {

                const ref = await getDoc(doc(firebaseStore, "articles", bookmark))
                r.push({ ...ref.data(), id: ref.id });
                setFeeds(r)
           
            })
        
        });
        setIsLoading(false)
    }
    const update = (id: string, bookmark: BookmarkProps[]) => {
        setFeeds(feeds.filter((feed: { id: string; })=>feed.id !== id))
        addBookmark(id, bookmark)
    }
    return { addBookmark, increaseLike, addNotification, isLoading, bo, feeds, update }
}
export default useInteraction