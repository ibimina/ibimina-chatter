import { firebaseStore } from "@/firebase/config"
import { useAuthContext } from "@/store/store"
import { query, collection, where, getDocs, doc, setDoc, collectionGroup } from "firebase/firestore"

function useUpdate() {
    const { state} = useAuthContext()
    const { displayName, photoURL, uid } = state.user
    const author = { name: displayName, image: photoURL, uid }
    const updateInArticles = async () => {
        const updateAuthorInArticle = query(collection(firebaseStore, "articles"), where("author.uid", "==", uid))
        const a = await getDocs(updateAuthorInArticle)
        a.forEach(async (docc) => {
            const id = doc(firebaseStore, 'articles', docc.id?.toString()!)
            const r = docc?.data()?.comments?.map((comment: any) => {
                if (comment.uid === uid) {
                    return { ...comment, name: displayName, image: photoURL }
                } else {
                    return comment
                }
            })
            await setDoc(id, { author: { ...author }, comments: r }, { merge: true });
        })
    }

    const updateInNotification = async () => {
        const docRef = collection(firebaseStore, "notifications")
        const querySnap = await getDocs(docRef)
        querySnap.forEach(async element => {
            const update = element.data()?.notification?.map((n: any) => {
                if (n.event_user === uid) {
                    return { ...n, event_userimage: photoURL, event_username: displayName }
                } else { return n }
            })
            const ref = doc(firebaseStore, "notifications", `${element?.id}`)
            await setDoc(ref, {
                notification: [...update]
                }, { merge: true });
        });
    }

    const updateUserFollowing = async () => {
        const updateFollowing = collection(firebaseStore, "following")
        const querySnap2 = await getDocs(updateFollowing)
        querySnap2.forEach(async element => {
          
            const u = element.data()?.following?.map((n: any) => {
                if (n.author === uid) {
                    return { ...n, name: displayName, image: photoURL }
                } else { return n }
            })
            const docRef = doc(firebaseStore, "following", element.id)
            await setDoc(docRef, { following: [...u ] }, { merge: true });
        });
    }
    const updateFollowers = async () => {
        const updateFollowers = collection(firebaseStore, "followers")
        const querySnap3 = await getDocs(updateFollowers)
        querySnap3.forEach(async element => {
            const u = element.data()?.followers?.map((n: any) => {
                if (n.author === uid) {
                    return { ...n, name: displayName, image: photoURL }
                } else { return n }
            })
            const docRef = doc(firebaseStore, "followers", element.id)
            await setDoc(docRef, { followers: [...u] }, { merge: true });
        });
    }
    const updateInChats = async () => {
        const chatsCollection = collectionGroup(firebaseStore, "chats");
        const querySnapshot = await getDocs(chatsCollection);
        querySnapshot.forEach(async (docc) => {
            const id = doc(firebaseStore, docc.ref.path)
            const r = docc?.data()?.message?.map((message: any) => {
                if (message.messageUserUid === uid) {
                    return { ...message, username: displayName, messagerImage: photoURL }
                } else {
                    return message
                }
            })
            // //update contact object latest message if sentby is user
            if (docc?.data()?.contact?.uid === uid) {
                await setDoc(id, { contact: { ...docc?.data()?.contact, name: displayName, image: photoURL } }, { merge: true });
            }
            await setDoc(id, { message: r }, { merge: true });
        })
    }
   return { updateInArticles, updateInNotification, updateUserFollowing, updateFollowers, updateInChats }
}

export default useUpdate;