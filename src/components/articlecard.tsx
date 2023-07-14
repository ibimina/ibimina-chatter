import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleProps, UserBookmarkProps } from "@/types";
import styles from '@/styles/chatter.module.css';
import { useTime } from "@/hooks";
import { Isliked } from "@/helper/isLiked";

function ArticleCard({ feed, update }: { feed: ArticleProps, update: (id: string, bookmark: UserBookmarkProps[]) => void }) {
    const { published } = useTime(feed?.timestamp)
    const {isbookmarked,isliked} = Isliked(feed)

    return (
        <li className={`px-5 border-gray-100 border-2 py-4 rounded-lg mb-3 `}>
            <div className="flex items-center gap-2 mb-2">
                <Link href={`/${encodeURIComponent(feed?.author?.uid)}`} className={`flex items-center gap-1 `}>
                    {
                        feed?.author?.image === null &&
                        <Image className={`rounded-full`} src="/images/icons8-user.svg" width={30} height={30} alt="author avatar" />
                    }
                    {
                        feed?.author?.image &&
                        <Image className={`rounded-full`} src={feed?.author?.image} width={30} height={30} alt="author avatar" />
                    }
                    <span className="capitalize font-medium text-blue-500">{feed?.author?.name}</span>
                </Link>
                {
                    feed?.title?.length > 1 &&
                    <div className="flex items-center gap-1">
                        <span>{published}</span>
                    </div>
                }
            </div>
            <Link className={`grid grid-cols-5 gap-3 items-center`} href={`/inkspire/${encodeURIComponent(feed?.id!)}`}>
                <div className={`col-span-5 lg:col-span-3 mb-2`}>
                    <h1 className={`text-2xl font-bold mb-1 break-words`}>{feed?.title}</h1>
                    <div className="flex items-center gap-2"><Image src='/images/icons8-read-30.png' width={24} height={24} alt="opened book" /> {feed?.readingTime} min read</div>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}
                        className={` prose prose-headings:m-0 prose-p:m-0.6 pro prose-headings:text-lg
                            hr-black prose-hr:border-solid prose-hr:border prose-hr:border-black
                             marker:text-sky-400 ${styles['markdownPreview']}`} >
                        {feed?.article?.slice(0, 150)}
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
                <Link href={`/inkspire/${encodeURIComponent(feed?.id!)}`}
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
                                <Image src='/images/icons8-isbookmark.png' className="brightness-150" height={24} width={24} alt="like" />
                                <p className="text-red">  {feed?.bookmarks?.length}</p>
                            </>
                            : <>
                                <Image src='/images/icons8-add-bookmark.svg' height={24} width={24} alt="bookmark" />
                                <p className="text-current">   {feed?.bookmarks?.length} </p>
                            </>
                    }
                </button>
                <Link href={`/inkspire/${encodeURIComponent(feed?.id!)}`} className='flex items-center gap-1'>
                    <Image src="/images/icons8-chart-24.png" height={18} width={18} alt="views chart" />
                    {feed?.views}
                </Link>
                <Link href={`/inkspire/${encodeURIComponent(feed?.id!)}`} className='flex items-center gap-1'>
                    <Image src="/images/icons8-comment-24.png" height={24} width={24} alt="comments" />
                    {feed?.comments?.length}
                </Link>
            </div>
        </li>);
}

export default ArticleCard;