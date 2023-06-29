import { Key, useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import Head from "next/head";
import { useRouter } from "next/router";

import { useCollection, useCollectionSnap, useFollow, useInteraction } from "@/hooks";
import { DocumentData, doc, onSnapshot, setDoc } from "firebase/firestore";

import styles from '@/styles/editor.module.css'

import { ArticleCard, LinkIcon } from "@/components";
import FeedLayout from "@/container/feedslayout";
import { useAuthContext } from "@/store/store";
import { firebaseStore } from "@/firebase/config";


function ViewProfile() {
    const author = useRouter().query.author
    const { state, dispatch } = useAuthContext()
    const { snap } = useCollectionSnap("articles", "author.uid", `${author}`)
    const { data } = useCollection("users", `${author}`)
    const [articles, setArticles] = useState<DocumentData>()
    const [viewFollowers, setViewFollowers] = useState(false)
    const [viewFollowing, setViewFollowing] = useState(false)
    const [viewTopic, setIsViewTopic] = useState(false)
    const [followedTopics, setFollowedTopics] = useState<DocumentData>()

    const { addBookmark } = useInteraction()
    useEffect(() => {
        setArticles(snap?.filter((doc: { published: boolean; }) => doc.published === true));
    }, [snap])
    const { following, followers, isfollowing, handelFollow} = useFollow(`${author}`, data?.displayName, data?.photoURL)

    useEffect(() => {
        const unsub = onSnapshot(doc(firebaseStore, "topics", `${process.env.NEXT_PUBLIC_TOPICS_DATABASE_ID}`), (doc) => {
            if (doc?.exists()) {
                const topicsWithCounts = data?.topics?.map((topic: string) => {
                    const trendingTopic = doc?.data()?.topics?.find((t: any) => t.name === topic);
                    const count = trendingTopic ? trendingTopic?.count : 0;
                    return { name: topic, count };
                });
                setFollowedTopics(topicsWithCounts)       
            }
        });
        return () => unsub()
    }, [data?.topics,state?.user?.topics])
    const unfollow = (topic: string) => {
        const userRef = doc(firebaseStore, 'users', state?.user?.uid)
        if (state.user.topics.includes(topic)) {
            const updateArray = state.user.topics.filter((userTag: string) => userTag !== topic)
            setDoc(userRef, {
                topics: updateArray
            }, { merge: true });
            //remove from user topics
            dispatch({ type: "REMOVETAG", payload: topic })
        } else {
            setDoc(userRef, {
                topics: [...state.user.topics, topic]
            }, { merge: true });
            dispatch({ type: "ADDTAG", payload: topic })
        }

    }
    const [statefollowing, setStateFollowing] = useState<DocumentData>()
    useEffect(() => {
        if (state?.user?.uid){
            onSnapshot(doc(firebaseStore, "following", state?.user?.uid), (doc) => {
            if (doc.exists() && doc.data()?.following?.length > 0) {
                setStateFollowing(doc.data()?.following)

            } else {
                setStateFollowing([])
            }
        });
        }

    }, [state?.user?.uid])

    return (<>
        <Head>
            <title>{`${data?.displayName} profile`}</title>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="IE=7" />
            <meta name="description" content="" />
        </Head>
        <FeedLayout>
            <main className={` md:w-8/12 mx-auto `}>
                <div className="flex items-center mb-6 gap-4">
                    <button
                        // onClick={handleRoute}
                        className={`${styles.back} cursor-pointer lg:hidden`}
                        aria-label='menu'
                    ></button>

                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center mb-6 gap-4">
                        <Image src={data?.photoURL || "/images/icons8-user.svg"} alt={`${data?.displayName}`} width={150} height={150} className="rounded-full" />
                        <div>
                            <div className="mb-4">
                                <p className="font-bold text-3xl capitalize">{data?.displayName}</p>
                                <p>{data?.username}</p>
                                <p>{data?.profile_tagline}</p>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <p className="font-semibold flex items-center flex-col md:flex-col">{articles?.length} <span>articles</span> </p>
                                <button onClick={() => setViewFollowers(!viewFollowers)} className="font-semibold flex items-center flex-col md:flex-col">{followers?.length} <span>{followers?.length === 0 ? "follower" : "followers"}</span> </button>
                                <button onClick={() => setViewFollowing(!viewFollowing)} className="font-semibold flex items-center flex-col md:flex-col">{following?.length} <span>following</span> </button>
                            </div>
                        </div>
                    </div>
                    {viewFollowers &&
                        <div onClick={() => setViewFollowers(!viewFollowers)} className="fixed top-0 left-0 w-full h-full bg-slate-900 bg-opacity-50 flex items-center justify-center">
                            <div className="bg-gray-50 max-w-sm w-full px-4 py-2 rounded mx-4" >
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-current text-lg font-medium">Followers</p>
                                    <button onClick={() => setViewFollowers(!viewFollowers)} className="cursor-pointer bg-close-icon bg-no-repeat bg-center w-3 h-3 hover:bg-slate-200" title=""></button>
                                </div>
                                {followers?.length === 0 ? <p>No followers yet</p>
                                    : <ul>
                                        {followers?.map((follower: any, index: Key) => {
                                            return (
                                                <div className="flex items-center justify-between mb-3" key={index}>
                                                    <div className="flex items-center gap-1">
                                                        <Image className="rounded-full" src={follower.image ? follower.image : "/images/icons8-user-64.png"} height={24} width={24} alt="follower" />
                                                        <p className="text-gray-500">  {follower.name}</p>
                                                    </div>
                                                    {
                                                        state?.user?.uid !== follower?.author ?
                                                            <button className="bg-slate-400 px-3 py-1 w-15" onClick={() => handelFollow(follower)}>{`${(statefollowing?.some((f: { image: string, name: string, author: string }) => f.author === follower.author)) ? "following" : "follow"}`}</button>
                                                            : ""
                                                    }
                                                </div>)
                                        })}
                                    </ul>
                                }
                            </div>
                        </div>
                    }
                    {viewFollowing &&
                        <div className="fixed top-0 left-0 w-full h-full bg-slate-900 bg-opacity-50 flex items-center justify-center z-40">
                            <div className="bg-gray-50 max-w-sm w-full py-2 z-50  rounded mx-4" >
                                <div className="flex items-center justify-between px-3 mb-4">
                                    <p className="text-current text-lg font-medium">Following</p>
                                    <button onClick={() => setViewFollowing(!viewFollowing)} className="cursor-pointer bg-close-icon bg-no-repeat bg-center w-3 h-3 hover:bg-slate-200" title=""></button>
                                </div>
                                <div className="grid grid-cols-2 mb-4 items-center justify-between">
                                    <button onClick={() => setIsViewTopic(!viewTopic)} className={`p-2 border-b-2 ${!viewTopic ? " border-current" : "border-gray-300"}`}>People</button>
                                    <button onClick={() => setIsViewTopic(!viewTopic)} className={`p-2 border-b-2 ${viewTopic ? " border-current" : "border-gray-300"}`}>Topics</button>
                                </div>

                                {!viewTopic && following?.length > 0 &&
                                    <ul className="px-4">

                                        {following?.map((user: { name: string, image: string, author: string }, index: Key) => {
                                            return (
                                                <div className="flex items-center justify-between mb-3" key={index}>

                                                    <div className="flex items-center gap-1">
                                                        <Image className="rounded-full" src={user?.image ? user?.image : "/images/icons8-user-64.png"} height={24} width={24} alt="like" />
                                                        <p className="text-gray-500">  {user?.name}</p>
                                                    </div>
                                                    {
                                                        state?.user?.uid !== user.author &&
                                                        <button onClick={() => handelFollow(user)} className="bg-slate-400 px-3 py-1 w-15">{`${(statefollowing?.some((f: { image: string, name: string, author: string }) => f.author === user.author)) ? "following" : "follow"}`}</button>

                                                    }
                                                      </div>
                                            )
                                        })
                                        }
                                    </ul>
                                }
                                {!viewTopic && following?.length === 0 && <p className="text-center mb-4">no following</p>}
                                {viewTopic && followedTopics?.length === 0 && <p className="text-center mb-4">no topics</p>}

                                {viewTopic && data.topics?.length > 0 &&
                                    <ul className="px-4">
                                        {
                                            followedTopics?.map((topic: any, index: Key) => {
                                                return (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <Link className={`px-4 py-3 font-medium`} href={`/n?q=${topic}`}>
                                                            <p>{topic.name}</p>
                                                            <p>{topic.count}</p>
                                                        </Link>
                                                        <button onClick={() => unfollow(topic.name)} className="bg-slate-400 px-3 py-1 w-15">{`${state?.user?.topics?.includes(topic.name) ? "following" : "follow"}`}</button>
                                                    </div>)
                                            })}
                                    </ul>
                                }
                            </div>
                        </div>
                    }

                    {
                        state?.user?.uid === author &&
                        <Link href="/settings" className="bg-violet-900 text-white py-1 px-6 rounded-2xl w-max">Edit</Link>
                    }
                    {
                        state?.user?.uid !== author &&
                        <button onClick={() => handelFollow({name:data?.displayName,image:data?.photoURL,author:data.uid})} className="cursor-pointer bg-violet-700 text-white rounded-2xl px-4 py-2">
                            {isfollowing ? "following" : "follow +"}
                        </button>
                    }

                </div>

                {/* add a button to click follow writer */}

                <div className="flex items-center gap-2 justify-center">
                    <LinkIcon src="/images/icons8-twitter.svg" alt="twitter" href={data?.twitter} />
                    <LinkIcon src="/images/icons8-facebook.svg" alt="facebook" href={data?.facebook} />
                    <LinkIcon src="/images/icons8-linkedin.svg" alt="linkedin" href={data?.linkedin} />
                    <LinkIcon src="/images/icons8-website-24.png" alt="website" href={data?.website} />
                    <LinkIcon src="/images/icons8-instagram.svg" alt="instagram" href={data?.instagram} />
                    <LinkIcon src="/images/icons8-youtube.svg" alt="youtube" href={data?.youtube} />
                    <LinkIcon src="/images/icons8-github.svg" alt="github" href={data?.github} />
                </div>
                <p>{data?.location}</p>

                <p>{data?.bio}</p>
                {
                    data?.stacks &&
                    <div className="mb-8">
                        <p className="my-3 font-medium">My Topics</p>
                        <ul className="flex items-center gap-2 flex-wrap">
                            {data &&
                                data?.topics?.map((doc: string, index: Key) =>
                                    <>
                                        <li key={index} className="bg-violet-500 p-2 rounded-sm text-white">
                                            {doc}
                                        </li>
                                    </>
                                )}
                        </ul>
                    </div>
                }
                {/* <div className="mb-8">
                    <p className="my-3 font-medium">My Topics</p>
                    <ul className="flex items-center gap-2 flex-wrap">
                        {data &&
                            data?.topics?.map((doc: string, index: Key) =>
                                <>
                                    <li key={index} className="bg-violet-500 p-2 rounded-sm text-white">
                                        {doc}
                                    </li>
                                </>
                            )}
                    </ul>
                </div> */}
                <div>
                    <p className="font-semibold mb-3 text-3xl text-violet-900">Articles</p>
                    <ul>
                        {articles?.length > 0 ? articles?.map((article: any, index: Key) =>
                            <ArticleCard key={index} feed={article} update={addBookmark} />
                        ) :
                            (
                                <p className="text-center">No articles yet</p>
                            )

                        }
                    </ul>
                </div>
            </main>

        </FeedLayout>
    </>);
}

export default ViewProfile;