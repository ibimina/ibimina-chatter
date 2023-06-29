import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { onSnapshot, doc, DocumentData, getDoc, setDoc, DocumentReference } from "firebase/firestore";
import { useEffect, useState } from "react";

function useFollow(author: string, name: string, image: string) {
    const [followers, setFollowers] = useState<DocumentData>()
    const [following, setFollowing] = useState<DocumentData>()
    const [isfollowing, setIsFollowing] = useState<boolean>(false)
    const [statefollowing, setStateFollowing] = useState<DocumentData>()
    const { state } = useAuthContext()


    useEffect(() => {
        const unsub = onSnapshot(doc(firebaseStore, "following", `${author}`), (doc) => {
            if (doc.exists() && doc.data()?.following?.length > 0) {
                setFollowing(doc.data()?.following)

            } else {
                setFollowing([])
            }
        });
        return () => unsub()

    }, [author, state?.user?.uid])
    interface followProps {
        name: string
        author: string
        image: string
    }
    useEffect(() => {
        const unsub = onSnapshot(doc(firebaseStore, "followers", `${author}`), (doc) => {
            if (doc.exists() && doc.data()?.followers?.length > 0) {
                setFollowers(doc.data()?.followers)
                const checkFollowers = doc.data()?.followers?.filter((follower: followProps) => follower.author === state?.user?.uid)
                setIsFollowing(checkFollowers)
            } else {
                setFollowers([])
            }
        });
        return () => unsub()

    }, [author, state?.user?.uid])
    // add a fuction to follow writer
    const handelFollow = async (au: { image: string, name: string, author: string }) => {
        const followingRef = doc(firebaseStore, 'following', `${state?.user?.uid}`)
        const followerRef = doc(firebaseStore, 'followers', `${au.author}`)
        const docRef = await getDoc(followerRef)
        const followingDoc = await getDoc(followingRef)
        const verify = followingDoc?.data()?.following?.some((f: { image: string, name: string, author: string })=>f.author===au.author)
      
        if (!verify && (au.author !== state?.user?.uid)) {
            setIsFollowing(true)
            follower(docRef, followerRef, au)
            getfollowing(followingDoc, followingRef, au)
        } else if (verify && (au.author !== state?.user?.uid)) {
            setDoc(followerRef, {
                followers: docRef?.data()?.followers?.filter((follower: followProps) => follower.author !== au.author)
            }, { merge: true })
            setDoc(followingRef, {
                following: followingDoc?.data()?.following?.filter((following: followProps) => following.author !== au.author)

            }, { merge: true })
            setIsFollowing(false)
        }
    }


    const follower = (docRef: DocumentData, followerRef: DocumentReference, au: { image: string, name: string, author: string }) => {

        if (docRef.exists()) {
            setDoc(followerRef, {
                followers: [
                    ...docRef?.data()?.followers,
                    {
                        name: state?.user?.displayName,
                        author: state?.user?.uid,
                        image: state?.user?.photoURL
                    }
                ]
            }, { merge: true })
 
        } else {
     
            setDoc(followerRef, {
                followers: [
                    {
                        name: state?.user?.displayName,
                        author: state?.user?.uid,
                        image: state?.user?.photoURL
                    }
                ]
            }, { merge: true })
        }
    }

    const getfollowing = (followingDoc: DocumentData, followingRef: DocumentReference, au: { image: string, name: string, author: string }) => {
        const { image, name, author } = au
        if (followingDoc.exists()) {
            setDoc(followingRef, {
                following: [
                    ...followingDoc?.data()?.following,
                    { image, name, author }
                ]
            }, { merge: true })
        } else {
            setDoc(followingRef, {
                following: [
                    { image, name, author }
                ]
            }, { merge: true })

        }
    }
    return { followers, following, isfollowing, handelFollow, statefollowing }
}

export default useFollow;