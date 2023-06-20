import { ArticleCard, Header } from "@/components";
import { firebaseStore } from "@/firebase/config";
import { ArticleProps, UserBookmarkProps } from "@/types";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Key, useEffect, useState } from "react";


function Search() {

    const router = useRouter();
    const { q } = router.query;
    const [a, setA] = useState<DocumentData | null>();
    const [coll, setColl] = useState('articles')

    useEffect(() => {
        const docRef = collection(firebaseStore, coll)

        const docSnap = onSnapshot(docRef, (doc) => {
            let arr: any[] = []
            doc.forEach((doc) => {
                if (coll === 'articles') {
                    if (doc?.data()?.title?.toLowerCase().includes(q?.toString().toLowerCase()) && doc.data()?.published) {
                        arr.push(doc.data())

                    }
                } else {
                    doc?.data()?.topics.forEach((topic: { name: string, count: number }) => {
                        if (topic?.name?.toLowerCase().includes(q?.toString().toLowerCase()! && doc.data().published)) {
                            arr.push({ name: topic.name, count: topic.count })
                        }
                    })
                }
                setA(arr)
            })
        })
        return () => {
            docSnap()
        }
    }, [coll, q])
    return (
        <>
            <Head>
                <title>#{q} on chatter</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="IE=7" />
                <meta name="description" content={`Published articles that includes ${q} topic`} />
            </Head>
            <Header handleNav={function (): void {
                throw new Error("Function not implemented.");
            }} />
            <section className="p-5">
                <div className={`flex items-center font-normal gap-3 `}>
                    <button className={`${coll === "articles" ? "border-b-4 border-violet-600" : ""} py-2`} onClick={() => setColl("articles")}>Top Articles</button>
                    <button >Latest</button>
                    <button className={`${coll === "topics" ? "border-b-4 border-violet-600" : ""} p-2`} onClick={() => setColl("topics")}>Topics</button>
                </div>
                <ul className="m max-w-2xl  mt-6">

                    {
                        coll === 'articles' && a?.length > 0 &&
                        a?.map((article: ArticleProps) => {
                            return <ArticleCard key={article.id} feed={article} update={function (id: string, bookmark: UserBookmarkProps[]): void {
                                throw new Error("Function not implemented.");
                            }} />
                        })

                    }
                    {
                        coll === 'articles' && a?.length === 0 &&
                        <p className="font-medium text-4xl text-center"> No Articles</p>
                    }
                </ul>
                {
                    coll === 'topics' && a?.length > 0 && a?.map((topic: { id: Key, name: string; count: number; }) => {
                        return <div key={topic.id} className="mb-2">
                            <h1 className="font-medium text-2xl">{topic.name}</h1>
                            <p className="text-xs text-slate-400">{topic?.count} Article</p>
                            <Link href={`/n?q=${topic?.name}`}>nn</Link>
                        </div>
                    })
                }
                {
                    coll === 'topics' && a?.length === 0 &&
                    <p className="font-medium text-4xl text-center">No Topics match</p>
                }
            </section>
        </>);
}

export default Search;