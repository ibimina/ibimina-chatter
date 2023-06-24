import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { ArticleProps, BookmarkProps, LikeProps, UserBookmarkProps } from "@/types";
import { DocumentData, doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";

function useInteraction() {
    const { state } = useAuthContext();


    const addBookmark = async (id: string, bookmarks: UserBookmarkProps[]) => {
        if (state?.user === null) {
            return alert("Please login to bookmark this article")
        }
        const docRef = doc(firebaseStore, 'articles', id);
        const bookmarkRef = doc(firebaseStore, 'bookmarks', state?.user?.uid);
        const hasBookmarked = bookmarks?.find((bookmark: UserBookmarkProps) => {
            return bookmark?.user_uid === state?.user?.uid
        })
        const bookmarkSnap = await getDoc(bookmarkRef)
        const userBookmarks = bookmarkSnap.data()?.bookmarks

        if (hasBookmarked === undefined) {
            await setDoc(docRef, {
                bookmarks: [
                    ...bookmarks,
                    {
                        user_uid: state?.user?.uid,
                    }]
            }, { merge: true });
            if (userBookmarks === undefined) {
                await setDoc(bookmarkRef, { bookmarks: [{ article_uid: id }] })
            } else {
                await setDoc(bookmarkRef, {
                    bookmarks: [...userBookmarks, {
                        article_uid: id,
                    }]
                }, { merge: true });
            }
        } else {
            await setDoc(docRef, {
                bookmarks: bookmarks?.filter((bookmark: UserBookmarkProps) => {
                    return bookmark?.user_uid !== state?.user?.uid
                })

            }, { merge: true });

            await setDoc(bookmarkRef, {
                bookmarks: userBookmarks?.filter((bookmark: BookmarkProps) => {
                    return bookmark?.article_uid !== id
                })
            }, { merge: true });
        }
    }

    const increaseLike = async (id: string, likes: LikeProps[], article: ArticleProps) => {
        const hasLiked = likes.find((like: LikeProps) => {
            return like?.uid === state?.user?.uid
        })
        const docRef = doc(firebaseStore, 'articles', id);
        const docSnap = await getDoc(docRef);
        const updateLike = likes?.map((like: LikeProps) => {
            if (like?.uid === state?.user?.uid) {
                return {
                    ...like,
                    timestamp: [...like?.timestamp,new Date().toISOString()]
                }
            } else {
                return like
            }
        })
        let countLikes = 0
        updateLike?.forEach((like: LikeProps) => {
            countLikes += like?.timestamp?.length
        })
        if (hasLiked) {
            await setDoc(docRef, { likes: updateLike, likesCount: countLikes }, { merge: true });
        } else if (likes.length === 0 || hasLiked === undefined) {
            await setDoc(docRef, {
                likes: [...likes, {
                    uid: state?.user?.uid,
                    name: state?.user?.displayName,
                    image: state?.user?.photoURL,
                    timestamp: [JSON.stringify(new Date())]
                }],
                likesCount: docSnap?.data()?.likesCount + 1
            }, { merge: true });
            await addNotification('liked', article)
        }
    }

    const addNotification = async (event: string, article: ArticleProps) => {
        const docRef = doc(firebaseStore, 'notifications', `${article?.author?.uid}`);
        const docSnap = await getDoc(docRef);
       if (docSnap.exists()) {
            await setDoc(docRef, {
                notification: [
                    ...docSnap?.data()?.notification,
                    {
                        event_user: state?.user?.uid,
                        event_username: state?.user?.displayName,
                        event_userimage: state?.user?.photoURL,
                        event: event,
                        articleId: article?.id,
                        articleTitle: article?.title,
                        timestamp: new Date().toISOString()
                    }]
            }, { merge: true });
        } else {
            await setDoc(docRef, {
                notification: [
                    {
                        event_user: state?.user?.uid,
                        event_username: state?.user?.displayName,
                        event_userimage: state?.user?.photoURL,
                        event: event,
                        articleId: article?.id,
                        articleTitle: article?.title,
                        timestamp: new Date().toISOString()
                    }]
            }, { merge: true });
        }

    }
    const [feeds, setFeeds] = useState<DocumentData>([]);
    const [isLoading, setIsLoading] = useState<boolean | null>(null)

    const update = (id: string, bookmark: UserBookmarkProps[]) => {
        setFeeds(feeds.filter((feed: { id: string; }) => feed.id !== id))
        addBookmark(id, bookmark)
    }
    return { addBookmark, increaseLike, addNotification, isLoading, feeds, update }
}
export default useInteraction