import { ArticleCard, Header } from "@/components";
import { ArticleProps, UserBookmarkProps } from "@/types";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function S() {
    const router = useRouter();
    const { q } = router.query;
    const [a, setA] = useState<DocumentData | null>();

    useEffect(() => {
        // const docRef = collection(firebaseStore, 'articles')

        // const docSnap = onSnapshot(docRef, (doc) => {
        //     let arr: any[] = []
        //     doc.forEach((doc) => {
        //         const topicExist = doc.data()?.topics?.includes(`${q}`)
        //         if (topicExist && doc.data().published) {
        //             arr.push({ ...doc.data(), id: doc.id })
        //         }
        //         setA(arr)
        //     })
        // })
        // return () => {
        //     docSnap()
        // }
    }, [q])

    return (
        <>
           <Head>
            <title>#{q} on InkSpire</title>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta http-equiv="X-UA-Compatible" content="IE=7" />
            <meta name="description" content={`Published articles that includes ${q} topic`} />         
           </Head>
            <Header handleNav={function (): void {
                throw new Error("Function not implemented.");
            }} />
            <div className="text-center mb-4">
                <h1 className="font-bold text-2xl">{q}</h1>
                <p>{a?.length} Articles</p>
            </div>
       
            <ul className="p-4">
                {
                    a?.length > 0 &&
                    a?.map((article: ArticleProps) => {
                        return <ArticleCard key={article.id} feed={article} update={function (id: string,): void {
                            throw new Error("Function not implemented.");
                        }} />
                    })
                }
            </ul>
        </>);
}

export default S;