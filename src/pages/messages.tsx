import FeedLayout from "@/container/feedslayout";
import { firebaseStore } from "@/firebase/config";
import { useMessage } from "@/hooks";
import { DocumentData, collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { Key, useState, useEffect } from "react";
import Image from "next/image";

function Message() {
    const { messages } = useMessage()
    const [ismodal, setIsModal] = useState(false)
    const [inkSpire, setInkSpire] = useState("")
    const [searchUsers, setSearchUser] = useState<DocumentData>()
    const [selectUser, setSelectUser] = useState("")
    console.log(selectUser)
    useEffect(() => {
        if (inkSpire.trim().length > 0) {
            const q = query(collection(firebaseStore, "users"));
            onSnapshot(q, (querySnapshot) => {
                const users: any[] = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data()?.displayName.includes(inkSpire)) users.push(doc.data());
                });
                console.log("Current users in CA: ", users);
                setSearchUser(users)
            });
        } else {
            setSelectUser("")
            setSearchUser([])
        }
    }, [inkSpire])
   
    const messageUser = () => {
        setIsModal(false)
        console.log(selectUser)
    }
    console.log(selectUser)
    return (<>
        <FeedLayout>
            <main className={` md:w-8/12 mx-auto `}>
                <h2>Messages</h2>
                <section className="grid grid-cols-5">
                    <div className="col-span-2">
                        {
                            messages?.length === 0 &&
                            <p>No message yet</p>
                        }
                        {
                            messages?.length > 0 &&
                            <ul>
                                {
                                    messages?.map((m: any, index: Key) => <li key={index}>
                                        {m}
                                    </li>)
                                }
                            </ul>
                        }
                    </div>
                    {
                        !ismodal && !selectUser &&
                            <div className="col-span-3 flex items-center justify-center h-60">
                                <div>
                                    <p className="mb-4">send private message to a friend</p>
                                    <button onClick={() => setIsModal(!ismodal)} className="bg-violet-700 block mx-auto">send message</button>
                                </div>
                            </div>
                    }
                    {
                        !ismodal && selectUser &&
                        <div className="col-span-3 flex items-center justify-center h-60">
                            <div>
                               <p>okkay</p>   </div>
                        </div>
                    }
                    
                </section>
                {
                    ismodal &&
                    <div className="fixed w-full h-full top-0 left-0 bg-slate-900 bg-opacity-50 flex items-center justify-center ">
                        <div className="bg-gray-100 rounded max-w-sm w-full pb-2">
                                <p className="p-2 flex items-center font-medium  border-b-2 border-gray-200"><span className="w-4/5 text-center">New message</span> <button onClick={() => setIsModal(!ismodal)} className="w-1/5 cursor-pointer">close</button></p>
                            <div className="border-b-2 p-3 border-gray-200 flex items-center gap-1">
                                <span>To: </span><input className="w-full bg-inherit outline-none" type="search" name="inkSpireuser" placeholder="Search..." value={inkSpire} onChange={(e) => setInkSpire(e.target.value)} />
                            </div>
                            <div className="p-2">
                                {
                                    searchUsers?.length === 0
                                        ? <p>no user found</p>
                                        : (
                                            <ul className="max-h-38 max-h-40 overflow-y-scroll">
                                                {searchUsers?.map((user: any, index: Key) =>
                                                    <label key={index} className="flex items-center justify-between mb-3">
                                                        <li className="flex items-center gap-1">
                                                            <Image className="rounded-full" src={user?.photoURL ? user?.photoURL : "/images/icons8-user-64.png"} height={24} width={24} alt="like" />
                                                            <span>{user?.displayName}</span>
                                                        </li>
                                                        <input type="radio" name="chat" className="mr-4" onChange={() => setSelectUser(user)} />
                                                    </label>
                                                )}
                                            </ul>
                                        )
                                }

                            </div>
                            <div className="mx-2 mt-2 ">
                                <button onClick={messageUser} disabled={!selectUser} className={`w-full rounded py-2 mb-3 ${selectUser ? "bg-violet-700  text-white" : "bg-violet-300  text-white"} `}>chat</button>
                            </div>
                        </div>
                    </div>
                }
                
            </main>
        </FeedLayout>
    </>);
}

export default Message;