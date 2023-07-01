import FeedLayout from "@/container/feedslayout"
import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from '../styles/tags.module.css'
import Head from "next/head";
import Link from "next/link";
interface topic {
    name: string,
    count: number
}
export default function Explore() {
    const [topics, setTopics] = useState<topic[] | null>(null)
    const { state, dispatch } = useAuthContext()

    useEffect(() => {
        const getTopics = async () => {
            const firebaseTopics = getDoc(doc(firebaseStore, "topics", `${process.env.NEXT_PUBLIC_TOPICS_DATABASE_ID}`))
            const response = (await firebaseTopics)?.data()?.topics
            setTopics(response.sort((a: topic, b: topic) => b.count - a.count))
   
        }
        getTopics()
        return () => { getTopics() }
    }, [state, state?.user?.uid])
    const addUserTopic = async (e: React.MouseEvent, tag: string) => {
        e.preventDefault();
        let addBtn = e.currentTarget.getAttribute('aria-pressed');
        const userRef = doc(firebaseStore, 'users', `${state?.user?.uid}`);
        if (addBtn === 'false') {
            e.currentTarget.setAttribute('aria-pressed', 'true');
            const exist = state.user.topics?.find((articleTag: string) => {
                return articleTag.toLowerCase() === tag.toLowerCase()
            })
            if (!exist) {
                dispatch({ type: "ADDTAG", payload: tag })
                setDoc(userRef, {
                    topics: state?.user?.topics
                }, { merge: true });
            }
        }
        else {
            e.currentTarget.setAttribute('aria-pressed', 'false');
            dispatch({ type: "REMOVETAG", payload: tag })
            setDoc(userRef, {
                topics: state?.user?.topics
            }, { merge: true });
            
        }
    }

    return (
        <>
            <Head>
                <title>Explore popular topics on InkSpire</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="IE=7" />
                <meta name="description" content="Explore more topics" />
            </Head>
            <FeedLayout>
                <main className={`md:w-4/6`}>
                    <h1 className="font-medium text-lg mb-2">
                        Explore Tech Topics
                    </h1>
                    <p className="mb-4  font-serif">
                        Explore the most popular tech blogs from the community. A constantly updating list of popular tags and the best minds in tech.
                    </p>
                    <ul>
                        <li className="text-violet-700 font-serif font-normal text-lg">Trending Topics</li>
                    </ul>
                    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-3 my-8`}>
                        {topics && topics.slice(0,10).map((topic, index) =>
                            <div key={index} className={`flex justify-between items-center bg-stone-200 hover:bg-zinc-300  cursor-pointer`} aria-selected='false'>
                                <Link className={`px-4 py-3 font-medium`} href={`/n?q=${topic?.name}`}>{topic?.name} </Link>
                                <button
                                    onClick={(e) => addUserTopic(e, topic.name)}
                                    className={`bg-contain bg-no-repeat bg-center w-5 h-5 m-2 ${styles.add}`} aria-label="add tag" aria-pressed={state?.user.topics.includes(topic?.name) ? "true" : "false"}>
                                </button>

                            </div>
                        )}
                    </div>
                </main>
            </FeedLayout>
        </>
    );
}
