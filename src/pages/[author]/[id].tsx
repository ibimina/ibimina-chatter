import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { firebaseStore } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LinkRenderer } from "@/components";

import styles from "@/styles/editor.module.css"
import { ArticleProps } from "@/types/article";
import { useAuthContext } from "@/store/store";
import { useCollectionSnap, useInteraction } from "@/hooks";
import { formatDistanceStrict } from "date-fns";

import {   EmailShareButton,  FacebookShareButton, LinkedinShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton,} from "react-share";
import Head from "next/head";
import FeedLayout from "@/container/feedslayout";

export default function SingleArticle() {
    const { state } = useAuthContext();
    const router = useRouter();
    const { id, author } = router.query;

    const [article, setArticle] = useState<ArticleProps>({} as ArticleProps);
    const [isliked, setIsLiked] = useState(false)
    const [isbookmarked, setIsBookmarked] = useState(false)
    const [comment, setComment] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [isShared, setIsShared] = useState(false);
    const { snap } = useCollectionSnap('articles', "author.uid", `${author}`);

    useEffect(() => {
        const getArticle = async () => {
            const doc = snap?.find((article: ArticleProps) => {
                return article.id === id
            })  
            setArticle({...doc});
            const like = article?.likes?.find((like) => like?.uid === state?.user?.uid)
            const bookmark = article?.bookmarks?.find((bookmark) => bookmark?.user_uid === state?.user?.uid)
            if (like !== undefined) {
                setIsLiked(true)
            } else {

                setIsLiked(false)
            }
            if (bookmark !== undefined) {
                setIsBookmarked(true)
            } else {

                setIsBookmarked(false)
            }
        };
        getArticle();
        setShareUrl(window?.location?.href);
        // 
    }, [article?.bookmarks, article?.likes, id, snap, state?.user?.uid]);
    useEffect(() => {
        (async () => {
            if (id! !== undefined){
                const docRef = doc(firebaseStore, "articles", `${id}`);
                const docSnap = await getDoc(docRef);
                await setDoc(docRef, {
                    views: docSnap.data()?.views + 1
                }, { merge: true });
            }         
        })();
    }, [id]);
    const { addBookmark, increaseLike, addNotification } = useInteraction();

    const postComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (state?.user === null) return;
        const docRef = doc(firebaseStore, 'articles', article?.id!);
        await setDoc(docRef, {
            comments: [
                ...article?.comments, {
                    uid: state?.user?.uid,
                    name: state?.user?.displayName,
                    image: state?.user?.photoURL,
                    comment: comment,
                    timestamp: new Date().toISOString()
                }]
        }, { merge: true });
        await addNotification('commented', article)
        setComment("")
    }
    const handleRoute = () => {
        router.back();
    }
    return (
        <>
            <Head>
                <title>{article?.title} by {article?.author?.name} on chatter</title>
                <meta name="description" content={article?.subtitle} />
                <meta name="title" property="og:title" content={`${article?.title} by ${article?.author?.name} on chatter`} />
                <meta name="image" property="og:image" content={article?.coverImageUrl} />
                <meta name="description" property="og:description" content={article?.subtitle} />             
                <meta name="url" property="og:url" content={shareUrl} />
                <meta name="type" property="og:type" content="article" />
                <meta name="site_name" property="og:site_name" content="chatter" />
                <meta name="twitter:title" content={`${article?.title} by ${article?.author?.name} on chatter`} />
                <meta name="twitter:description" content={article?.subtitle} />
                <meta name="twitter:image" content={article?.coverImageUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@chatter" />
                <meta name="twitter:creator" content="@chatter" />
            </Head>
            <FeedLayout>
                <main className={` md:w-10/12 mx-auto lg:w-9/12 `}>
                    <div className="flex items-center mb-6 gap-4">
                        <button
                            onClick={handleRoute}
                            className={`${styles.back} cursor-pointer`}
                            aria-label='menu'
                        ></button>   <h1 className="font-bold text-3xl">Article</h1>
                    </div>
                    {
                        article?.id?.length === undefined && <>loading...</>
                    }
                    {article?.coverImageUrl?.length > 2 &&
                        <div className={`relative h-96 mb-4`}>
                            <Image src={article?.coverImageUrl} alt={article?.title} fill sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,  33vw"
                            />
                        </div>
                    }

                    <h1 className={`text-2xl text-center lg:text-left mb-2 font-bold`}>{article?.title}</h1>
                    <h1 className={`text-xl text-center lg:text-left mb-6 font-medium`}>{article?.subtitle}</h1>
                    <Link href={`/${encodeURIComponent(article?.author?.uid)}`} className={`flex flex-col lg:flex-row lg:items-center lg:gap-2 mb-8`}>
                        <div className="flex items-center gap-1">
                            {article?.author?.image?.length > 2 &&
                                <Image className={`rounded-full`} src={article?.author?.image} width={30} height={30} alt="author avatar" />

                            }
                            {article?.author?.image === null &&
                                <Image className={`rounded-full`} src={"/images/icons8-user-64.png"} width={30} height={30} alt="author avatar" />
                            }
                            <span>{article?.author?.name}</span>
                        </div>
                        {
                            article?.title?.length > 1 &&
                            <div className="flex items-center gap-1">
                                <span>{formatDistanceStrict(new Date(), new Date(article?.timestamp))} ago</span>
                                <span>{article?.readingTime} min read</span>
                            </div>
                        }

                    </Link>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}
                        components={{ a: LinkRenderer }}
                        className={` prose prose-headings:m-0 prose-p:my-0  prose-li:m-0 prose-ol:m-0 prose-ul:m-0 prose-ul:leading-6
                            hr-black prose-hr:border-solid prose-hr:border prose-hr:border-black
                             marker:text-gray-700  break-words whitespace-pre-wrap`} >
                        {article?.article}
                    </ReactMarkdown>
                    <div className='relative flex items-center gap-2 justify-center mt-20 mb-10'>
                        <button
                            onClick={() => increaseLike(article?.id!, article?.likes!, article)}
                            className={`flex items-center gap-1`}>
                            {
                                isliked ?
                                    <>
                                        <Image src='/images/icons8-love-48.png' height={24} width={24} alt="like" />
                                        <p className="text-red-500">  {article?.likesCount}</p>
                                    </>
                                    : <>
                                        <Image src='/images/icons8-like-50.png' height={24} width={24} alt="like" />
                                        <p className="text-current">  {article?.likesCount}</p>
                                    </>
                            }
                        </button>
                        <button
                            onClick={() => addBookmark(article?.id!, article?.bookmarks)}
                            className='flex items-center gap-1'>
                            {
                                isbookmarked ?
                                    <>
                                        <Image src='/images/icons8-isbookmark.png' height={24} width={24} alt="like" />
                                        <p className="text-">    {article?.bookmarks?.length}</p>
                                    </>

                                    : <>
                                        <Image src='/images/icons8-add-bookmark.svg' height={24} width={24} alt="bookmark" />
                                        <p className="text-current">   {article?.bookmarks?.length} </p>
                                    </>
                            }
                        </button>
                        <button className='flex items-center gap-1'>
                            <Image src="/images/icons8-chart-24.png" height={18} width={18} alt="views chart" />
                            {article?.views}
                        </button>
                        <button className='flex items-center gap-1'>
                            <Image src="/images/icons8-comment-24.png" height={24} width={24} alt="comments" />
                            {article?.comments?.length}
                        </button>
                        <div>

                        </div>
                        <button onClick={() =>
                            setIsShared(!isShared)} className={`flex items-center gap-1 ${isShared ? "text-violet-500" : ""}`
                            }>
                            <Image src="/images/icons8-share.svg" height={24} width={24} alt="share" />
                        </button>
                        {isShared && <div className="absolute  bottom-6 right-0 bg-gray-100 p-4 rounded-lg shadow-lg">
                            <button className="flex items-center gap-1 mb-4"
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl)
                                    alert("link copied")
                                }}>
                                <Image src="/images/icons8-link-gray-24.png" height={24} width={24} alt="whatsapp" />

                                Copy link
                            </button>
                            <EmailShareButton className="flex items-center gap-1 mb-4" url={shareUrl} subject={`${article?.title} by ${article?.author?.name} on  chatter`} >
                                <Image src="/images/icons8-email-24.png" height={24} width={24} alt="twitter" />
                                Share on email
                            </EmailShareButton>
                            <TelegramShareButton className="flex items-center gap-1 mb-4" url={shareUrl} title={`${article?.title} by ${article?.author?.name} on  chatter`} >
                                <Image src="/images/icons8-telegram-24.png" height={24} width={24} alt="twitter" />
                                Share on telegram
                            </TelegramShareButton>
                            <TwitterShareButton className=" flex items-center gap-1 mb-4" url={shareUrl} title={`${article?.title} by ${article?.author?.name} on  chatter`} >
                                <Image src="/images/icons8-twitter.svg" height={24} width={24} alt="twitter" />
                                Share on twitter
                            </TwitterShareButton>
                            <FacebookShareButton className="flex items-center gap-1 mb-4" url={shareUrl} quote={`${article?.title} by ${article?.author?.name} on  chatter`} >
                                <Image src="/images/icons8-facebook.svg" height={24} width={24} alt="facebook" />
                                Share on facebook
                            </FacebookShareButton>
                            <LinkedinShareButton className="flex items-center gap-1 mb-4" url={shareUrl} title={`${article?.title} by ${article?.author?.name} on  chatter`} >
                                <Image src="/images/icons8-linkedin.svg" height={24} width={24} alt="linkedin" />
                                Share on linkedin
                            </LinkedinShareButton>
                            <WhatsappShareButton className="flex items-center gap-1" url={shareUrl} title={`${article?.title} by ${article?.author?.name} on  chatter`} >
                                <Image src="/images/icons8-whatsapp.svg" height={24} width={24} alt="whatsapp" />
                                Share on whatsapp
                            </WhatsappShareButton>
                        </div>}

                    </div>
                    <div className="py-2 max-w-lg">
                        <h2 className="text-xl font-bold mb-3">
                            {article?.comments?.length > 1 ? "Comments" : "Comment"}
                            ({article?.comments?.length})
                        </h2>
                        <Link href={`/${encodeURIComponent(article?.author?.uid)}`} className={`flex items-center gap-1 mb-8`}>
                            {state?.user?.photoURL?.length > 2 &&
                                <Image className={`rounded-full`} src={state?.user?.photoURL} width={30} height={30} alt="author avatar" />
                            }
                            {state?.user?.photoURL === null &&
                                <Image className={`rounded-full`} src={"/images/icons8-user-64.png"} width={30} height={30} alt="author avatar" />

                            }
                            <span>{state?.user?.displayName ? state?.user?.displayName :"anonymous"}</span>
                        </Link>
                        <form onSubmit={postComment}>
                            <input value={comment} onChange={(e) => setComment(e.target.value)} className="block border-solid border-2 rounded-lg border-violet-400 w-full p-2 mb-6 outline-0 focus:shadow-violet-500/50 focus:shadow-lg" type="text" placeholder="Ask a question to spark a conversation" name="comment" />
                            <input className="block bg-violet-700 text-gray-200 font-medium p-2 rounded-xl ml-auto" type="submit" value="Comment" />
                        </form>
                        {article?.comments?.length === 0 ? <p className="text-center text-gray-500">No comments yet</p> :
                            article?.comments?.map((comment, index) => {
                                return (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <Image className={`rounded-full`} src={comment?.image === null ? "/images/icons8-user-64.png" : comment?.image} width={30} height={30} alt="author avatar" />
                                        <div className="flex flex-col">
                                            <span className="font-bold">{comment?.name}</span>
                                            <span className="text-gray-500">{comment?.comment}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </main>
            </FeedLayout>
        </>
    );
}
