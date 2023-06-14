import { Header } from "@/components";
import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { Key, useState } from "react";
import styles from "@/styles/tags.module.css"



function User() {
    const { state, dispatch } = useAuthContext()
    const [addTag, setAddTag] = useState('')

   
    const updateInfo = async (e: React.FormEvent) => {
        e.preventDefault()
        const { user } = state
        const userRef = doc(firebaseStore, 'users', state?.user?.uid);
        await setDoc(userRef, { ...user }, { merge: true });
    }
    return (<>
 
            <Header handleNav={function (): void {
                throw new Error("Function not implemented.");
            }} />
            <form className="bg-slate-100 px-8 py-4" onSubmit={updateInfo}>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p className="font-bold text-4xl mb-4">Basic info</p>
                        <label className="block mb-4">
                            <span className="block">Full name</span>
                            <input type="text" placeholder="Enter your full name" value={state?.user?.displayName}
                                onChange={(e) => dispatch({ type: "NAME", payload: e.target.value })} className="block w-full rounded-lg py-3 px-2" />
                        </label>
                        <label className="block mb-4">
                            <span className="block">Profile Tagline</span>
                            <input type="text" placeholder="What's your tagline e.g Frontend developer"
                                onChange={(e) => dispatch({ type: "TAGLINE", payload: e.target.value })}
                                value={state?.user?.profile_tagline} className="block w-full rounded-lg py-3 px-2" />
                        </label>
                        <div className="block mb-4">
                            <span className="block mb-2">Profile Photo</span>
                            <label className="block">
                                <div className="relative w-max">
                                    <Image className=" rounded-full" src={state?.user?.photoURL || "/images/icons8-user.svg"} width={80} height={80} alt={state?.user?.displayName} />
                                    <input type="file" className="appearance-none w-0" />
                                    <button 
                                    className= {`absolute top-1 cursor-pointer -right-1 w-6 h-6 bg-no-repeat ${styles.picture}`}
                                    >
                                    </button>
                                </div>
                            </label>
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
                                    className="bg-violet-950 text-white py-2 px-6 rounded-2xl"
                                    onClick={() => {
                                        if (addTag.trim().length > 2) {
                                            dispatch({ type: "ADDTAG", payload: addTag })
                                        }
                                    }}>add topics</button>
                            </div>

                        </label>
                        <ul className="flex items-center gap-2 flex-wrap mt-8">
                            {state?.user &&
                                state?.user?.tags?.map((doc: string, index: Key) =>
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
                            <input type="text" placeholder="https://twitter.com/@username" onChange={(e) => dispatch({ type: "TWITTER", payload: e.target.value })} value={state?.user?.twitter} className="block w-full rounded-lg py-3 px-2" />
                        </label>
                        <label className="block mb-4">
                            <span>Linkedin</span>
                        <input type="text" placeholder="https://www.linkedin.com/in/username" onChange={(e) => dispatch({ type: "LINKEDIN", payload: e.target.value })} value={state?.user?.linkedin} className="block w-full rounded-lg py-3 px-2" />
                        </label>
                        <label className="block mb-4">
                            <span>Facebook</span>
                        <input type="text" placeholder="https://www.facebook.com/username" onChange={(e) => dispatch({ type: "FACEBOOK", payload: e.target.value })} value={state?.user?.facebook} className="block w-full rounded-lg py-3 px-2" />
                        </label>
                        <label className="block mb-4">
                            <span>Instagram</span>
                        <input type="text" placeholder="https://www.instagram.com/username" onChange={(e) => dispatch({ type: "INSTAGRAM", payload: e.target.value })} value={state?.user?.instagram} className="block w-full rounded-lg py-3 px-2" />
                        </label>
                        <label className="block mb-4">
                            <span>Github</span>
                        <input type="text" placeholder="https://www.github.com/username" onChange={(e) => dispatch({ type: "GITHUB", payload: e.target.value })} value={state?.user?.github} className="block w-full rounded-lg py-3 px-2" />
                        </label>
                        <label className="block mb-4">
                            <span>Website</span>
                        <input type="text" placeholder="https://www.ibimina-hart.com" onChange={(e) => dispatch({ type: "WEBSITE", payload: e.target.value })} value={state?.user?.website} className="block w-full rounded-lg py-3 px-2" />
                        </label>
                        <label className="block mb-2">
                            <span>Youtube</span>
                        <input type="text" placeholder="https://www.youtube.com/ibimina-hart" onChange={(e) => dispatch({ type: "YOUTUBE", payload: e.target.value })} value={state?.user?.youtube} className="block w-full rounded-lg py-3 px-2" />
                        </label>
                    </div>
                </div>
                <input type="submit" className="bg-violet-900 text-white py-2 px-4 rounded-xl mt-8 block ml-auto" value="Update" />
            </form>
    </>);
}

export default User;