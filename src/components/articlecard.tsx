import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleProps, UserBookmarkProps } from "@/types";
import styles from '@/styles/chatter.module.css';
import { useEffect, useState } from "react";
import { useAuthContext } from "@/store/store";
import { formatDistanceStrict } from "date-fns";

function ArticleCard({ feed, update }: { feed: ArticleProps, update: (id: string, bookmark: UserBookmarkProps[]) => void }) {
    const [isliked, setIsLiked] = useState(false)
    const [isbookmarked, setIsBookmarked] = useState(false)

    const { state } = useAuthContext()
    useEffect(() => {
        const like = feed.likes?.find((like) => like?.uid === state?.user?.uid)
        const bookmark = feed?.bookmarks?.find((bookmark) => bookmark?.user_uid === state?.user?.uid)
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
    }, [feed, feed?.bookmarks, feed?.likes, state?.user?.uid])
    return (
        <li className={`mb-8`}>
            <div className="flex items-center gap-2 mb-2">
                <Link href={`/${encodeURIComponent(feed?.author?.uid)}`} className={`flex items-center gap-1 `}>
                    {
                        feed?.author?.image === null || undefined &&
                        <Image className={`rounded-full`} src="/images/icons8-user.svg" width={30} height={30} alt="author avatar" />
                    }
                    {
                        feed?.author?.image &&
                        <Image className={`rounded-full`} src={feed?.author?.image} width={30} height={30} alt="author avatar" />
                    }
                    <span>{feed?.author?.name}</span>
                </Link>
                {
                    feed?.title?.length > 1 &&
                    <div className="flex items-center gap-1">
                        <span>{formatDistanceStrict(new Date(), new Date(feed?.timestamp))} ago</span>
                        <span>{feed?.readingTime} min read</span>
                    </div>
                }
            </div>
            <Link className={`grid grid-cols-5 items-center`} href={`/${encodeURIComponent(feed?.author?.uid)}/${encodeURIComponent(feed?.id!)}`}>
                <div className={`col-span-5 lg:col-span-3 mb-2`}>
                    <h1 className={`text-lg font-bold`}>{feed?.title}</h1>
                    <p className={`text-sm`}>{feed?.subtitle}</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}             
                        className={` prose prose-headings:m-0 prose-p:m-0.6 
                            hr-black prose-hr:border-solid prose-hr:border prose-hr:border-black
                             marker:text-sky-400 ${styles['markdownPreview']}`} >
                        {feed?.article?.slice(0, 100)}
                    </ReactMarkdown>
                </div>
                {feed?.coverImageUrl?.length > 2 &&
                    <div className='col-span-6 row-span-1 md:col-span-2 rounded-xl relative h-48 md:h-32   md:max-w-xs w-full'>
                        <Image src={feed?.coverImageUrl} fill sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,  33vw" className="rounded-xl "
                            alt="article cover image" />
                    </div>
                }
            </Link>
            <div className='mt-3 flex items-center gap-2'>
                <Link href={`/${encodeURIComponent(feed?.author?.uid)}/${encodeURIComponent(feed?.id!)}`}
                    className={`flex items-center gap-1`}>
                    {
                        isliked ?
                            <>
                                <Image src='/images/icons8-love-48.png' height={24} width={24} alt="like" />
                                <p className="text-red-500">  {feed?.likesCount}</p>
                            </>
                            : <>
                                <Image src='/images/icons8-like-50.png' height={24} width={24} alt="like" />
                                <p className="text-current">  {feed?.likesCount}</p>
                            </>
                    }
                </Link>
                <button
                    onClick={() => update(feed?.id!, feed?.bookmarks)}
                    className='flex items-center gap-2'>
                    {
                        isbookmarked ?
                            <>
                                <Image src='/images/icons8-isbookmark.png' height={24} width={24} alt="like" />
                                <p className="text-red">    {feed?.bookmarks?.length}</p>
                            </>
                            : <>
                                <Image src='/images/icons8-add-bookmark.svg' height={24} width={24} alt="bookmark" />
                                <p className="text-current">   {feed?.bookmarks?.length} </p>
                            </>
                    }
                </button>
                <Link href={`/${encodeURIComponent(feed?.author?.uid)}/${encodeURIComponent(feed?.id!)}`} className='flex items-center gap-1'>
                    <Image src="/images/icons8-chart-24.png" height={18} width={18} alt="views chart" />
                    {feed?.views}
                </Link>
                <Link href={`/${encodeURIComponent(feed?.author?.uid)}/${encodeURIComponent(feed?.id!)}`} className='flex items-center gap-1'>
                    <Image src="/images/icons8-comment-24.png" height={24} width={24} alt="comments" />
                    {feed?.comments?.length}
                </Link>
            </div>
        </li>);
}

export default ArticleCard;