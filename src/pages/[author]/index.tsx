import { useState } from "react";
import { Key, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from "next/router";
import { useCollection, useCollectionSnap, useInteraction } from "@/hooks";
import { DocumentData } from "firebase/firestore";

import styles from '@/styles/editor.module.css'

import { ArticleCard, LinkIcon } from "@/components";
import FeedLayout from "@/container/feedslayout";
import { useAuthContext } from "@/store/store";

function ViewProfile() {
    const author = useRouter().query.author
    const { state } = useAuthContext()
    const { snap } = useCollectionSnap("articles", "author.uid", `${author}`)
    const { data } = useCollection("users", `${author}`)
    const [articles, setArticles] = useState<DocumentData>()
    const { addBookmark } = useInteraction()
    console.log(articles, state.user)
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
                    <div className="">
                        <h1 className="font-bold text-3xl capitalize">{data?.displayName}</h1>
                        <p>{articles?.length > 0 ? `${articles?.length} Articles` : '0 Articles'} </p>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center mb-6 gap-4">
                        <Image src={data?.photoURL || "/images/icons8-user.svg"} alt={data?.displayName} width={150} height={150} className="rounded-s-full" />
                        <div>
                            <p className="font-bold text-3xl capitalize">{data?.displayName}</p>
                            <p>{data?.username}</p>
                            <p>{data?.profile_tagline}</p>
                        </div>
                    </div>
                    {
                        state?.user?.uid === author &&
                        <Link href="/settings" className="bg-violet-900 text-white py-1 px-6 rounded-2xl w-max">Edit</Link>
                    }
                </div>
                <div className="flex items-center gap-2 justify-center">                 
                    <LinkIcon src="/images/icons8-twitter.svg" alt="twitter" href={data?.twitter} />
                    <LinkIcon src="/images/icons8-facebook.svg" alt="facebook" href={data?.facebook} />
                    <LinkIcon src="/images/icons8-linkedin.svg" alt="linkedin" href={data?.linkedin} />
                    <LinkIcon src="/images/icons8-website-24.png" alt="website" href={data?.website} />
                    <LinkIcon src="/images/icons8-instagram.svg" alt="instagram" href={data?.instagram} />
                    <LinkIcon src="/images/icons8-youtube.svg" alt="youtube" href={data?.youtube} />
                    <LinkIcon src="/images/icons8-github.svg" alt="github" href={data?.github} />     
                </div>
                <p>user location</p>

                <p>about me</p>
                <div className="mb-8">
                    <p className="my-3 font-medium">My Topics</p>
                    <ul className="flex items-center gap-2 flex-wrap">
                        {data &&
                            data?.tags?.map((doc: string, index: Key) =>
                                <>
                                    <li key={index} className="bg-violet-500 p-2 rounded-sm text-white">
                                        {doc}
                                    </li>
                                </>
                            )}
                    </ul>
                </div>
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