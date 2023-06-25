import { Header } from "@/components";
import { firebaseAuth, firebaseStorage, firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { doc, setDoc, getDocs, collection, query, where, QuerySnapshot } from "firebase/firestore";
import Image from "next/image";
import { Key, useEffect, useState } from "react";
import styles from "@/styles/tags.module.css"
import Head from "next/head";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";



function User() {
    const { state, dispatch } = useAuthContext()
    const { displayName, photoURL, uid } = state.user
    const [addTag, setAddTag] = useState('')
    const [success, setSuccess] = useState(false)
    const author = { name: displayName, image: photoURL, uid }
    const updateInfo = async (e: React.FormEvent) => {
        e.preventDefault()
        const { user } = state 
        //update user name and image in user     
        const userRef = doc(firebaseStore, 'users', state?.user?.uid);
        await setDoc(userRef, { ...user }, { merge: true });
        //update user name and image in article
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
        const updateNoti = collection(firebaseStore, "notifications")
        const querySnap = await getDocs(updateNoti)
//update user image and name in notification
        querySnap.forEach(async element => {
            const u = element.data().notification.map((n: any) => {
                if (n.event_user === uid) {
                    return { ...n, event_userimage: photoURL, event_username: displayName }
                } else { return n }
            })
            const docRef = doc(firebaseStore, "notifications", element.id)
            await setDoc(docRef, {notification:{...u}}, { merge: true });
        });
        setSuccess(true)
    }
    const updateInput = (e: React.ChangeEvent, url: string, action: string, value: string) => {
        dispatch({ type: action, payload: value })
    }
    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const uploadpath = `thumbnails/profile/${firebaseAuth.currentUser?.uid}/${file.name}`
        const storageRef = ref(firebaseStorage, uploadpath)
        await uploadBytes(storageRef, file)
        const photoUrl = await getDownloadURL(storageRef)
        dispatch({ type: "PHOTO", payload: photoUrl })
    }
    useEffect(() => {
        if (success) setInterval(() => setSuccess(false), 6000)
    }, [success])

    return (<>
        <Head>
            <title>Change settings  on InkSpire</title>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="IE=7" />
            <meta name="description" content={`Update user profile details`} />
        </Head>
        <Header handleNav={function (): void {
            throw new Error("Function not implemented.");
        }} />

        <form className="bg-slate-50 mt-4 px-8 py-4 relative" onSubmit={updateInfo}>
            {
                success &&
                <p className="bg-green-500 text-white absolute  bottom-1/4 right-1 px-3 py-4 rounded">Profile update successfully</p>

            }
            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <p className="font-bold text-4xl mb-4">Basic info</p>
                    <label className="block mb-4">
                        <span className="block">Full name</span>
                        <input type="text" placeholder="Enter your full name" value={state?.user?.displayName}
                            onChange={(e) =>
                                dispatch({ type: "NAME", payload: e.target.value })}
                            className="block w-full rounded-lg py-3 px-2" />
                    </label>
                    <label className="block mb-4">
                        <span className="block">Profile Tagline</span>
                        <input type="text" placeholder="What's your tagline e.g Frontend developer"
                            onChange={(e) => dispatch({ type: "TAGLINE", payload: e.target.value })}
                            value={state?.user?.profile_tagline} className="block w-full rounded-lg py-3 px-2" />
                    </label>
                    <div className="mb-4">
                        <p className="mb-2">Profile Photo</p>
                        {
                            state?.user?.photoURL ?
                                <div className="relative">
                                    <button
                                        onClick={() => dispatch({ type: "PHOTO", payload: '' })}
                                        className={`absolute top-1 cursor-pointer left-28 w-6 h-6 bg-no-repeat ${styles.picture}`}>
                                    </button>
                                    <Image className=" rounded-full" src={state?.user?.photoURL} width={150} height={100} alt={state?.user?.displayName} />
                                </div> :
                                <label className="inline-block w-max h-min">
                                    <input type="file" className="appearance-none w-0 h-0" onChange={uploadImage} />
                                    <div className="w-40 h-40 rounded-full cursor-pointer bg-slate-200 flex items-center justify-center">
                                        <span className="">upload photo</span>
                                    </div>
                                </label>
                        }
                    </div>

                    <label className="block mb-4">
                        <span className="block">location</span>
                        <input type="text" placeholder="Location"
                            onChange={(e) => dispatch({ type: "LOCATION", payload: e.target.value })}
                            value={state?.user?.location} className="block w-full rounded-lg py-3 px-2" />
                    </label>
                    <label className="block mb-2">
                        <span className="block">About you</span>
                        <span className="block">Profile Bio</span>
                        <input type="text" placeholder="bio"
                            onChange={(e) => dispatch({ type: "BIO", payload: e.target.value })}
                            value={state?.user?.bio} className="block w-full rounded-lg py-3 px-2" />
                    </label>

                    <label className="block mb-4">
                        <span className="block">Topics</span>
                        <div className="flex items-center gap-4">
                            <input type="text" placeholder="Add more topics" value={addTag} onChange={(e) => setAddTag(e.target.value)}
                                className="block w-9/12 rounded-lg py-3 px-2" />
                            <button
                                className="bg-violet-900 text-white py-2 px-6 rounded-2xl"
                                onClick={() => {
                                    if (addTag?.trim().length > 2) {
                                        dispatch({ type: "ADDTAG", payload: addTag })
                                    }
                                }}>add</button>
                        </div>

                    </label>
                    <ul className="flex items-center gap-2 flex-wrap mt-8">
                        {state?.user &&
                            state?.user?.topics?.map((doc: string, index: Key) =>
                                <>
                                    <li key={index} className="bg-violet-200 p-2 rounded-sm text-current">
                                        {doc}
                                    </li>
                                </>
                            )}
                    </ul>
                </div>
                <div>

                    <p className="font-bold text-4xl mb-4">Social</p>
                    <label className="block mb-4">
                        <span>Twitter</span>
                        <input type="text" placeholder="https://twitter.com/@username"
                            onChange={(e) => { updateInput(e, "https://www.twitter.com/", "TWITTER", e.target.value) }}
                            value={state?.user?.twitter} className="block w-full rounded-lg py-3 px-2" />
                    </label>
                    <label className="block mb-4">
                        <span>Linkedin</span>
                        <input type="text" placeholder="https://www.linkedin.com/in/username"
                            onChange={(e) => updateInput(e, "https://www.linkedin.com/in/", "LINKEDIN", e.target.value)}
                            value={state?.user?.linkedin} className="block w-full rounded-lg py-3 px-2" />
                    </label>
                    <label className="block mb-4">
                        <span>Facebook</span>
                        <input type="text" placeholder="https://www.facebook.com/username"
                            onChange={(e) => updateInput(e, "https://www.facebook.com/", "FACEBOOK", e.target.value)}
                            value={state?.user?.facebook} className="block w-full rounded-lg py-3 px-2" />
                    </label>
                    <label className="block mb-4">
                        <span>Instagram</span>
                        <input type="text" placeholder="https://www.instagram.com/username" onChange={(e) => updateInput(e, "https://www.instagram.com/", "INSTAGRAM", e.target.value)} value={state?.user?.instagram} className="block w-full rounded-lg py-3 px-2" />
                    </label>
                    <label className="block mb-4">
                        <span>Github</span>
                        <input type="text" placeholder="https://www.github.com/username" onChange={(e) => updateInput(e, "https://www.github.com/", "GITHUB", e.target.value)} value={state?.user?.github} className="block w-full rounded-lg py-3 px-2" />
                    </label>
                    <label className="block mb-4">
                        <span>Website</span>
                        <input type="text" placeholder="https://www.ibimina-hart.com" onChange={(e) => updateInput(e, "https://www.", "WEBSITE", e.target.value)} value={state?.user?.website} className="block w-full rounded-lg py-3 px-2" />
                    </label>
                    <label className="block mb-2">
                        <span>Youtube</span>
                        <input type="text" placeholder="https://www.youtube.com/ibimina-hart" onChange={(e) => updateInput(e, "https://www.youtube.com/", "YOUTUBE", e.target.value)} value={state?.user?.youtube} className="block w-full rounded-lg py-3 px-2" />
                    </label>
                </div>
            </div>
            <input type="submit" className="bg-gradient-to-br from-purple-700 to-blue-400 text-white py-2 px-4 rounded-xl mt-8 block lg:ml-auto" value="Update" />
        </form>
    </>);
}

export default User;