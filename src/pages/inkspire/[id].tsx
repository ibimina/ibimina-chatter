import React, { Key } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { firebaseStore } from "@/firebase/config";
import { DocumentData, doc, getDoc, setDoc } from "firebase/firestore";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LinkRenderer } from "@/components";

import styles from "@/styles/editor.module.css"
import { useAuthContext } from "@/store/store";
import { useCollection, useInteraction ,useTime} from "@/hooks";

import { EmailShareButton, FacebookShareButton, LinkedinShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton, } from "react-share";
import FeedLayout from "@/container/feedslayout";
import Head from "next/head";



export default function SingleArticle() {
    const { state } = useAuthContext();
    const router = useRouter();
    const { id } = router.query;
    const [article, setArticle] = useState<DocumentData>();
    const [isliked, setIsLiked] = useState(false)
    const [isbookmarked, setIsBookmarked] = useState(false)
    const [comment, setComment] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [isShared, setIsShared] = useState(false);
    const {data} = useCollection("articles",`${id}`)
 
    const { published } = useTime(article?.timestamp)
    const [viewLikes, setViewLikes] = useState(false)
    useEffect(() => {
        const getArticle = async () => {
         
            setArticle({...data});

            const like = article?.likes?.find((like: { uid: string; }) => like?.uid === state?.user?.uid)
            const bookmark = article?.bookmarks?.find((bookmark: { user_uid: string; }) => bookmark?.user_uid === state?.user?.uid)
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
    }, [article?.bookmarks, article?.likes, data, state?.user?.uid]);
    useEffect(() => {
        (async () => {
            if (id! !== undefined) {
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
        if (state?.user === null || state?.user?.uid === "") {
            alert("You need to login to comment")
        } else {
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
            await addNotification('commented', article!)
            setComment("")
        }
    }
    const handleRoute = () => {
        router.back();
    }

    return (
        <>
            <Head>
                <title>{`${article?.title} by ${article?.author?.name} on InkSpire`}</title>
                <meta name="title" property="og:title" content={`${article?.title} by ${article?.author?.name} on InkSpire`} />
                <meta name="image" property="og:image" content={article?.coverImageUrl} />
                <meta name="description" property="og:description" content={article?.subtitle} />
                <meta name="url" property="og:url" content={shareUrl} />
                <meta name="type" property="og:type" content="article" />
                <meta name="site_name" property="og:site_name" content="InkSpire" />
                <meta name="twitter:title" content={`${article?.title} by ${article?.author?.name} on InkSpire`} />
                <meta name="twitter:description" content={article?.subtitle} />
                <meta name="twitter:image" content={article?.coverImageUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@InkSpire" />
                <meta name="twitter:creator" content="@InkSpire" />
            </Head>
            <FeedLayout>
                <main className={` md:w-10/12 mx-auto lg:w-8/12 `}>
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

                    <h1 className={`text-2xl text-center  mb-2 font-bold`}>{article?.title}</h1>
                    <p className={`text-xl text-center  mb-6 font-medium`}>{article?.subtitle}</p>
                    <Link href={`/profile/${encodeURIComponent(article?.author?.uid)}`} className={`flex flex-col md:flex-row items-center md:justify-center md:gap-4 mb-8`}>
                        <div className="flex items-center justify-center gap-1 mb-2 md:mb-0">
                            {article?.author?.image?.length > 2 &&
                                <Image className={`rounded-full`} src={article?.author?.image} width={30} height={30} alt="author avatar" />

                            }
                            {article?.author?.image === null &&
                                <Image className={`rounded-full`} src={"/images/icons8-user-64.png"} width={30} height={30} alt="author avatar" />
                            }

                            <span className="capitalize">{article?.author?.name} </span>

                        </div>
                        {
                            article?.title?.length > 1 &&
                            <div className="flex items-center justify-center gap-1">
                                <span>{published}</span>
                                <div className="flex items-center gap-2"><Image src='/images/icons8-read-30.png' width={24} height={24} alt="opened book" /> {article?.readingTime} min read</div>
                            </div>
                        }
                    </Link>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}
                        components={{ a: LinkRenderer }}
                        className={` prose max-w-none prose-headings:m-0 prose-p:my-0  prose-li:m-0 prose-ol:m-0 prose-ul:m-0 prose-ul:leading-6
                            hr-black prose-hr:border-solid prose-hr:border prose-hr:border-black
                             marker:text-gray-700  break-words whitespace-pre-wrap`} >
                        {article?.article}
                    </ReactMarkdown>
                    <div className='relative flex items-center gap-2 justify-center mt-20 mb-10'>
                        <div className={`flex items-center gap-1`}>
                            <button
                                onClick={() => increaseLike(article?.id!, article?.likes!, article!)}
                                title="likes">
                                {
                                    isliked ?
                                        <>
                                            <Image src='/images/icons8-love-48.png' height={24} width={24} alt="like" />
                                        </>
                                        : <>
                                            <Image src='/images/icons8-like-50.png' height={24} width={24} alt="like" />
                                        </>
                                }
                            </button>
                            <button onClick={() => setViewLikes(!viewLikes)} className={`${isliked ? "text-red-500 cursor-pointer" : "text-current cursor-pointer"}`} title="View who liked" >{article?.likesCount}</button>
                        </div>
                        <button
                            onClick={() => addBookmark(article?.id!, article?.bookmarks)}
                            className='flex items-center gap-1' title="bookmarks">
                            {
                                isbookmarked ?
                                    <>
                                        <Image src='/images/icons8-isbookmark.png' className="brightness-150" height={24} width={24} alt="like" />
                                        <p className="text-">    {article?.bookmarks?.length}</p>
                                    </>

                                    : <>
                                        <Image src='/images/icons8-add-bookmark.svg' height={24} width={24} alt="bookmark" />
                                        <p className="text-current">   {article?.bookmarks?.length} </p>
                                    </>
                            }
                        </button>
                        <button className='flex items-center gap-1' title="views">
                            <Image src="/images/icons8-chart-24.png" height={18} width={18} alt="views chart" />
                            {article?.views}
                        </button>

                        <button className='flex items-center gap-1' title="comments">
                            <Image src="/images/icons8-comment-24.png" height={24} width={24} alt="comments" />
                            {article?.comments?.length}
                        </button>
                        <button title="share" onClick={() =>
                            setIsShared(!isShared)} className={`flex items-center gap-1 ${isShared ? "text-violet-500" : ""}`
                            }>
                            <Image src="/images/icons8-share.svg" height={24} width={24} alt="share" />
                        </button>
                        {isShared && <div className="absolute  bottom-6 right-0 bg-gray-100 p-4 rounded-lg shadow-lg lg:right-40">
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
                            <LinkedinShareButton className="flex items-center gap-1 mb-4" title={`${article?.title} by ${article?.author?.name} on  chatter`} summary={`${article?.title}`} url={shareUrl}>
                                <Image src="/images/icons8-linkedin.svg" height={24} width={24} alt="linkedin" />
                                Share on linkedin
                            </LinkedinShareButton>
                            <WhatsappShareButton className="flex items-center gap-1" url={shareUrl} title={`${article?.title} by ${article?.author?.name} on chatter`} separator=":: ">
                                <Image src="/images/icons8-whatsapp.svg" height={24} width={24} alt="whatsapp" />
                                Share on whatsapp
                            </WhatsappShareButton>

                        </div>}

                    </div>
                    {
                        viewLikes &&
                        <div onClick={() => setViewLikes(!viewLikes)} className="fixed top-0 left-0 w-full h-full bg-slate-900 bg-opacity-50 flex items-center justify-center">
                            <div className="bg-gray-50 max-w-sm w-full px-4 py-2 rounded mx-4" >
                                    <div className="flex items-center justify-between mb-4">
                                    <p className="text-current text-lg font-medium">People who liked</p>
                                    <button onClick={() => setViewLikes(!viewLikes)} className="cursor-pointer bg-close-icon bg-no-repeat bg-center w-3 h-3 hover:bg-slate-200" title=""></button>
                                </div>

                                {article?.likes?.map((like: any, index:Key) => {
                                    return (
                                        <div className="flex items-center justify-between mb-3" key={index}>
                                            <div className="flex items-center gap-1">
                                                <Image className="rounded-full" src={like.image ? like.image : "/images/icons8-user-64.png"} height={24} width={24} alt="like" />
                                                <p className="text-gray-500">  {like.name}</p>
                                            </div>
                                            <p>{like?.timestamp?.length} {like?.timestamp?.length > 1 ? "likes" : "like"}</p>
                                        </div>)
                                })
                                }
                                {
                                    article?.likes?.length === 0 && <p>No likes yet</p>
                                }
                            </div>
                        </div>
                    }

{
    article?.topics?.length > 0 &&
    <div className="py-2 max-w-lg">
        <h2 className="text-xl font-bold mb-3">Topics</h2>
        <div className="flex flex-wrap gap-2">
            {article?.topics?.map((topic: any, index: number) => {
                return (
                    <Link href={`/n?q=${topic}`} key={index} className="bg-gray-200 px-2 py-1 rounded-lg text-sm text-gray-600 hover:bg-gray-200">
                        {topic}                    
                    </Link>
                )
            })}
        </div>
        </div>
}

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
                            <span>{state?.user?.displayName ? state?.user?.displayName : "anonymous"}</span>
                        </Link>
                        <form onSubmit={postComment}>
                            <input value={comment} onChange={(e) => setComment(e.target.value)} className="block border-solid border-2 rounded-lg border-violet-400 w-full p-2 mb-6 outline-0 focus:shadow-violet-500/50 focus:shadow-lg" type="text" placeholder="Ask a question to spark a conversation" name="comment" />
                            <input className="block bg-violet-700 text-gray-200 font-medium p-2 rounded-xl ml-auto" type="submit" value="Comment" />
                        </form>
                        {article?.comments?.length === 0 ? <p className="text-center text-gray-500">No comments yet</p> :
                            article?.comments?.map((comment: { image: string, name: string, comment: string }, index:Key) => {
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
