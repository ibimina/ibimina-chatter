import FeedLayout from "@/container/feedslayout";
import { firebaseStore } from "@/firebase/config";
import { useMessage } from "@/hooks";
import { DocumentData,  collection, doc, onSnapshot, query, setDoc,  getDoc } from "firebase/firestore";
import React, { Key, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAuthContext } from "@/store/store";
import styles from "@/styles/messages.module.css"
import { formatDistanceStrict } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";


function Message() {
    const { state } = useAuthContext()
    const { messages } = useMessage()
    const [ismodal, setIsModal] = useState(false)
    const [inkSpire, setInkSpire] = useState("")
    const [searchUsers, setSearchUser] = useState<DocumentData>()
    const [chatMessage, setChatMessage] = useState("")
    const [selectUser, setSelectUser] = useState({ photoURL: "", displayName: "", uid: "" })
    const [singleUserMessages, setSingleUserMessages] = useState<DocumentData>()
    const router = useRouter()
    const { q } = router.query

    useEffect(() => {
        if (inkSpire.trim().length > 0) {
            const q = query(collection(firebaseStore, "users"));
            onSnapshot(q, (querySnapshot) => {
                const users: any[] = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data()?.displayName.includes(inkSpire)) users.push(doc.data());
                });
                setSearchUser(users)
            });
        } else {
            setSelectUser({ photoURL: "", displayName: "", uid: "" })
            setSearchUser([])
        }
    }, [inkSpire])
    
    const messageUser = ((uid: string) => {
        setIsModal(false)
        onSnapshot(doc(firebaseStore, "messages", state?.user?.uid, "chats", `${uid}`), (doc) => {
            if (doc.exists() && doc.data()?.message?.length > 0) {
                // sort the messages by timestamp
                const sortedMessages = doc.data()?.message.sort((a: any, b: any) => {
                    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                })
                setSingleUserMessages(sortedMessages)
            } else {

                setSingleUserMessages([])
            }
        });
    })
    useEffect(() => {
        if (q && state?.user?.uid) {
            const qRef = query(collection(firebaseStore, "users"));
            onSnapshot(qRef, (querySnapshot) => {

                querySnapshot.forEach((doc) => {
                    if (doc.data()?.uid === q) {
                        setSelectUser({ photoURL: doc.data().photoURL, displayName: doc.data().displayName, uid: doc.data().uid })
                        messageUser(`${q}`)
                      }
                })   

            });
        } else {
            setSelectUser({ photoURL: "", displayName: "", uid: "" })
            setSearchUser([])
        }
    }, [q, state?.user?.uid])
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const messageInfo = { message: chatMessage, username: state.user.displayName, messageUserUid: state?.user?.uid, messagerImage: state.user.photoURL, timestamp: new Date().toISOString() }

            const docRef = doc(firebaseStore, "messages", state?.user?.uid, "chats", `${selectUser?.uid}`)
            const docReff = doc(firebaseStore, "messages", `${selectUser?.uid}`, "chats", state?.user?.uid)
            const userMessage = await getDoc(docRef)
            const currMessage = await getDoc(docReff)
            const contact = {
                name: selectUser.displayName, uid: selectUser.uid, image: selectUser.photoURL, lastmessage: chatMessage, timestamp: new Date().toISOString(), sentby: state?.user?.uid
            }
            const contactTwo = {
                name: state?.user?.displayName, uid: state?.user?.uid, image: state?.user?.photoURL, lastmessage: chatMessage, timestamp: new Date().toISOString(), sentby: state?.user?.uid
            }
            if (userMessage.exists()) {
                await setDoc(docRef, { message: [...userMessage.data()?.message, messageInfo], contact }, { merge: true })
            }
            else {
                await setDoc(docRef, { message: [messageInfo], contact })
            }
            if (currMessage.exists()) {
                await setDoc(docReff, { message: [...currMessage.data()?.message, messageInfo], contact: { ...contactTwo } }, { merge: true })
            }
            else {
                await setDoc(docReff, { message: [messageInfo], contact: { ...contactTwo } })
            }
        } catch (error) {
            console.log(error)
        }
        setChatMessage("")
    }
    const getMessage = (m: { uid: string; name: string; image: any; }) => {
        setSelectUser({ uid: m?.uid, displayName: m?.name, photoURL: m?.image })
        messageUser(m?.uid)
    }
    return (<>
        <FeedLayout>
            <main className={`md:w-9/12 mx-auto border-2 border-gray-400 rounded-xl`}>
                <section className={`grid grid-cols-5  ${styles.containerHeight}`}>
                    <div className="col-span-1 lg:p-2 lg:col-span-2 border-r border-gray-400 ">
                        <h2 className="hidden mb-4 lg:block">Messages</h2>
                        {
                            messages?.length === 0 &&
                            <p>No message yet</p>
                        }
                        {
                            messages?.length > 0 &&
                            <ul className={`${styles.previewMessage} p-2 `}>
                                {
                                    messages?.map((m: { sentby: string, name: string, image: string, uid: string, timestamp: string, lastmessage: string }, index: Key) => <li key={index} className="mb-3">
                                        <div className="lg:flex items-center gap-1" onClick={() => getMessage(m)} role="button">
                                            <Image className="rounded-full" src={m?.image ? m?.image : '/images/icons8-user.svg'} height={50} width={50} alt={m.name} />
                                            <div className="hidden lg:block">
                                                <p>{m?.name}</p>
                                                <span>{m.sentby === state.user.uid ? "You: " : ""}{m.lastmessage} </span>
                                                <span>{formatDistanceStrict(new Date(m?.timestamp), new Date(), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                    </li>)
                                }
                            </ul>
                        }
                    </div>
                    {
                        !ismodal && selectUser.displayName === '' &&
                        <div className="col-span-4 lg:col-span-3 flex items-center justify-center">
                            <div>
                                <p className="mb-4">Send private message to a friend</p>
                                <button onClick={() => setIsModal(!ismodal)} className="bg-gradient-to-br  from-purple-700 to-blue-400 block mx-auto px-2 py-2 rounded-xl text-white cursor-pointer">Send message</button>
                            </div>
                        </div>
                    }
                    {
                        !ismodal && selectUser?.displayName?.length > 0 &&
                        <div className="col-span-4 lg:col-span-3 flex  flex-col">

                            <Link className="flex items-center p-2 gap-1 mb-4 border-b-2 border-gray-200" href={`/${encodeURIComponent(selectUser?.uid)}`}>
                                <Image className="rounded-full" src={selectUser?.photoURL ? selectUser?.photoURL : "/images/icons8-user-64.png"} height={24} width={24} alt="like" />
                                <span>{selectUser?.displayName}</span>
                            </Link>

                            <div className="flex p-2 flex-col justify-between h-full">
                                {
                                    singleUserMessages?.length > 0 &&
                                    <ul className={`overflow-y-scroll max max-h-96`}>
                                        {
                                            singleUserMessages?.map((m: { message: string, username: string, messageUserUid: string, messagerImage: string, timestamp: string }, index: Key) =>
                                                <li key={index} className={`mb-4 ${m.messageUserUid === state.user.uid ? "flex justify-end" : ""}`}>
                                                    {/* if chats have the sam */}
                                                    {
                                                        m.messageUserUid === state.user.uid &&
                                                        <div className="">
                                                            <p className={`bg-blue-500 text-white p-2 text-end max-w-max ml-auto ${styles.message}`}>{m.message} </p>
                                                            <span className="block">{formatDistanceStrict(new Date(m?.timestamp), new Date(), { addSuffix: true })}</span>
                                                        </div>
                                                    }
                                                    {
                                                        m.messageUserUid !== state.user.uid &&
                                                        < >
                                                            <div className="flex items-center gap-1">
                                                                <Link href={`/${encodeURIComponent(m?.messageUserUid)}`}>

                                                                    <Image className="rounded-full" src={m?.messagerImage ? m?.messagerImage : '/images/icons8-user.svg'} height={40} width={40} alt={m.username} />


                                                                </Link>
                                                                <div className="hidden lg:block">
                                                                    <p className="rounded-xl bg-gray-300 px-2 py-1 mb-2 max-w-max">{m.message} </p>
                                                                </div>
                                                            </div>

                                                            <p>{formatDistanceStrict(new Date(m?.timestamp), new Date(), { addSuffix: true })}</p>

                                                        </>
                                                    }

                                                </li>)
                                        }
                                    </ul>
                                }
                                {
                                    singleUserMessages?.length === 0 &&
                                    <div className="text-center">
                                        <p>no message</p>
                                    </div>
                                }


                                <form onSubmit={handleSendMessage}>
                                    <input type="text" className="w-full border-2 border-slate-400 rounded-xl p-2" name="privatechat" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
                                </form>

                            </div>
                        </div>
                    }

                </section>
                {
                    ismodal &&
                    <div className="fixed w-full h-full top-0 left-0 bg-slate-900 bg-opacity-50 flex items-center justify-center ">
                        <div className="bg-gray-100 rounded max-w-sm w-full pb-2">
                            <p className="p-2 flex items-center font-medium  border-b-2 border-gray-200"><span className="w-4/5 text-center">New message</span> <button onClick={() => { setIsModal(!ismodal); setSelectUser({ photoURL: "", displayName: "", uid: "" }); setSearchUser(undefined) }} className="w-1/5 cursor-pointer">close</button></p>
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
                                <button onClick={() => messageUser(selectUser?.uid)} disabled={!selectUser.uid} className={`w-full rounded py-2 mb-3 ${selectUser.uid ? "bg-violet-700  text-white" : "bg-violet-300  text-white"} `}>chat</button>
                            </div>
                        </div>
                    </div>
                }

            </main>
        </FeedLayout>
    </>);
}

export default Message;