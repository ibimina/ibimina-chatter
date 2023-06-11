import { Header } from "@/components";
import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { Key, useState } from "react";



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
                        <label className="block mb-2">
                            <span className="block">Full name</span>
                            <input type="text" value={state?.user?.displayName}
                                onChange={(e) => dispatch({ type: "NAME", payload: e.target.value })} className="block w-full rounded-lg py-1 px-2" />
                        </label>
                        <label className="block mb-2">
                            <span className="block">Profile Tagline</span>
                            <input type="text"
                                onChange={(e) => dispatch({ type: "TAGLINE", payload: e.target.value })}
                                value={state?.user?.profile_tagline} className="block w-full rounded-lg py-1 px-2" />
                        </label>
                        <div className="block mb-2">
                            <span className="block">Profile Photo</span>
                            <label className="block">
                                <div className="relative w-max">
                                    <Image src={state?.user?.photoURL || "/images/icons8-user.svg"} width={80} height={80} alt={state?.user?.displayName} />
                                    <input type="file" className="appearance-none w-0" />
                                    <span className="absolute top-1 -right-5">button</span>
                                </div>
                            </label>
                        </div>

                        <label className="block mb-2">
                            <span className="block">location</span>
                            <input type="text"
                                onChange={(e) => dispatch({ type: "LOCATION", payload: e.target.value })}
                                value={state?.user?.location} className="block w-full rounded-lg py-1 px-2" />
                        </label>
                        <label className="block mb-2">
                            <span className="block">About you</span>
                            <span className="block">Profile Bio</span>
                            <input type="text"
                                onChange={(e) => dispatch({ type: "BIO", payload: e.target.value })}
                                value={state?.user?.bio} className="block w-full rounded-lg py-1 px-2" />
                        </label>

                        <label className="block mb-2">
                            <span className="block">Topics</span>
                            <div className="flex items-center gap-4">
                                <input type="location" value={addTag} onChange={(e) => setAddTag(e.target.value)}
                                    className="block w-9/12 rounded-lg py-1 px-2" />
                                <button
                                    className="bg-violet-950 text-white py-2 px-6 rounded-2xl"
                                    onClick={() => {
                                        if (addTag.trim().length > 2) {
                                            dispatch({ type: "ADDTAG", payload: addTag })
                                        }
                                    }}>add topics</button>
                            </div>

                        </label>
                        <ul className="flex items-center gap-2 flex-wrap">
                            {state?.user &&
                                state?.user?.tags?.map((doc: string, index: Key) =>
                                    <>
                                        <li key={index} className="bg-violet-500 p-2 rounded-sm text-white">
                                            {doc}
                                        </li>
                                    </>
                                )}
                        </ul>
                    </div>
                    <div>

                        <p className="font-bold text-4xl mb-4">Social</p>
                        <label className="block mb-2">
                            <span>Twitter</span>
                            <input type="text" onChange={(e) => dispatch({ type: "TWITTER", payload: e.target.value })} value={state?.user?.twitter} className="block w-full rounded-lg py-1 px-2" />
                        </label>
                        <label className="block mb-2">
                            <span>Linkedin</span>
                            <input type="text" onChange={(e) => dispatch({ type: "LINKEDIN", payload: e.target.value })} value={state?.user?.linkedin} className="block w-full rounded-lg py-1 px-2" />
                        </label>
                        <label className="block mb-2">
                            <span>Facebook</span>
                            <input type="location" onChange={(e) => dispatch({ type: "FACEBOOK", payload: e.target.value })} value={state?.user?.facebook} className="block w-full rounded-lg py-1 px-2" />
                        </label>
                        <label className="block mb-2">
                            <span>Instagram</span>
                            <input type="location" onChange={(e) => dispatch({ type: "INSTAGRAM", payload: e.target.value })} value={state?.user?.instagram} className="block w-full rounded-lg py-1 px-2" />
                        </label>
                        <label className="block mb-2">
                            <span>Github</span>
                            <input type="text" onChange={(e) => dispatch({ type: "GITHUB", payload: e.target.value })} value={state?.user?.github} className="block w-full rounded-lg py-1 px-2" />
                        </label>
                        <label className="block mb-2">
                            <span>Website</span>
                            <input type="text" onChange={(e) => dispatch({ type: "WEBSITE", payload: e.target.value })} value={state?.user?.website} className="block w-full rounded-lg py-1 px-2" />
                        </label>
                        <label className="block mb-2">
                            <span>Youtube</span>
                            <input type="text" onChange={(e) => dispatch({ type: "YOUTUBE", payload: e.target.value })} value={state?.user?.youtube} className="block w-full rounded-lg py-1 px-2" />
                        </label>
                    </div>
                </div>
                <input type="submit" className="bg-violet-900 text-white py-2 px-4 rounded-xl mt-5" value="Update" />
            </form>
    </>);
}

export default User;