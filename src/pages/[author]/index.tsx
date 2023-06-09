import { useState } from "react";
import { Key, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from "next/router";
import { useCollection, useCollectionSnap, useInteraction } from "@/hooks";
import { DocumentData } from "firebase/firestore";

import styles from '@/styles/editor.module.css'

import { ArticleCard } from "@/components";
import FeedLayout from "@/container/feedslayout";
import { useAuthContext } from "@/store/store";

function ViewProfile() {
    const author = useRouter().query.author
    const { state } = useAuthContext()
    const { snap } = useCollectionSnap("articles", "author.uid", `${author}`)
    const { data } = useCollection("users", `${author}`)
    const [articles, setArticles] = useState<DocumentData>()
    const { addBookmark } = useInteraction()
    console.log('l')
    useEffect(() => {
        setArticles(snap?.filter((doc: { published: boolean; }) => doc.published === true));
    }, [snap])

    return (<>
        <FeedLayout>
            <main className={` md:w-8/12 mx-auto `}>
                <div className="flex items-center mb-6 gap-4">
                    <button
                        // onClick={handleRoute}
                        className={`${styles.back} cursor-pointer`}
                        aria-label='menu'
                    ></button>
                    <h1 className="font-bold text-3xl capitalize">{data?.displayName}</h1>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center mb-6 gap-4">
                        <Image src={data?.photoURL || "/images/icons8-user.svg"} alt={data?.displayName} width={150} height={150} className="rounded-s-full" />
                        <div>
                            <p className="font-bold text-3xl capitalize">{data?.displayName}</p>
                            <p>@username</p>
                            <p>job title</p>
                        </div>
                    </div>
                    {
                        state?.user?.uid === author &&
                        <Link href="/settings" className="bg-violet-900 text-white py-1 px-6 rounded-2xl">Edit</Link>
                    }
                </div>
                <div>
                    <button>linkedin</button>
                    <button>twitter</button>
                    <button>github</button>
                    <button>website</button>
                </div>
                <p>user location</p>

                <p>about me</p>
                <div className="mb-8">
                    <p className="my-3 font-medium">My Topics</p>
                    <ul className="flex items-center gap-2 flex-wrap">
                        {data &&
                            data?.tags?.map((doc: string) =>
                                <>
                                    <li className="bg-violet-500 p-2 rounded-sm text-white">
                                        {doc}
                                    </li>
                                </>
                            )}
                    </ul>
                </div>
                <div>
                    <p className="font-semibold mb-3 text-3xl text-violet-900">Articles</p>
                    <ul>
                        {articles && articles?.map((article: any, index: Key) =>
                            <ArticleCard key={index} feed={article} update={addBookmark} />
                        )}
                    </ul>
                </div>
            </main>

        </FeedLayout>
    </>);
}

export default ViewProfile;