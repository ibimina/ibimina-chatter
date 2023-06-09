import FeedLayout from "@/container/feedslayout"
import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from '../styles/tags.module.css'
interface topic {
    name: string,
    count: number
}
export default function Explore() {
    const [topics, setTopics] = useState<topic[] | null>(null)
    const [userTopics, setUserTopics] = useState<string[]>([])
    const { state } = useAuthContext()
    // const docRef = doc(firebaseStore, 'users', state?.user?.uid);
    useEffect(() => {
        const getTopics = async () => {


            const firebaseTags = getDoc(doc(firebaseStore, "tags", "qt9AhhdGU6ZaR5PasTrP"))
            const response = (await firebaseTags)?.data()?.tags
            setTopics(response.sort((a: topic, b: topic) => b.count - a.count))


            if (state.user.uid.length > 1) {
                const userRef = doc(firebaseStore, 'users', state.user.uid);
                const usertag = await getDoc(userRef)
                setUserTopics(usertag.data()?.tags)
            }
        };
        getTopics()
        return () => { getTopics }
    }, [state, state?.user?.uid])
    const addUserTags = async (e: React.MouseEvent, tag: string) => {
        e.preventDefault();
        let addBtn = e.currentTarget.getAttribute('aria-pressed');
        if (addBtn === 'false') {
            const userRef = doc(firebaseStore, 'users', state?.user?.uid);
            e.currentTarget.setAttribute('aria-pressed', 'true');
            const exist = userTopics!.find((articleTag: string) => {
                return articleTag.toLowerCase() === tag.toLowerCase()
            })
            if (exist) {
                return
            }
            else {
                setUserTopics([...userTopics!, tag])
                setDoc(userRef, {
                    tags: [...userTopics, tag]
                }, { merge: true });
            }
        }
        else {
            const userRef = doc(firebaseStore, 'users', state?.user?.uid);
            e.currentTarget.setAttribute('aria-pressed', 'false');
            const updateArray = userTopics.filter((userTag: string) => userTag !== tag)
            setUserTopics(updateArray)
            setDoc(userRef, {
                tags: updateArray
            }, { merge: true });
        }
    }

    return (
        <>
            <FeedLayout>
                <main className={`md:w-4/6`}>
                    <h1>
                        Explore Tech Topics
                    </h1>
                    <p>
                        Explore the most popular tech blogs from the community. A constantly updating list of popular tags and the best minds in tech.
                    </p>
                    <ul>
                        <li>Trending Topics</li>
                    </ul>
                    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-3 my-8`}>
                        {topics && topics.map((topic, index) =>
                            <div key={index} className={`flex justify-between items-center bg-stone-200 hover:bg-zinc-500 hover:text-slate-100 cursor-pointer`} aria-selected='false'>
                                <p className={`px-4 py-3 font-medium`}>{topic.name} </p>
                                <button
                                    onClick={(e) => addUserTags(e, topic.name)}
                                    className={`bg-contain bg-no-repeat bg-center w-5 h-5 m-2 ${styles.add}`} aria-label="add tag" aria-pressed={userTopics?.includes(topic.name)! ? "true" : "false"}>
                                </button>

                            </div>
                        )}
                    </div>
                </main>
            </FeedLayout>
        </>
    );
}
