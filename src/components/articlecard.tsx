import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LinkRenderer from "./linkrender";
import { ArticleProps, BookmarkProps } from "@/types";
import styles from '@/styles/chatter.module.css';

function ArticleCard({ feed, update }: { feed: ArticleProps, update: (id: string, bookmark: BookmarkProps[]) => void }) {
    return (
        <li className={`mb-8`}>
            <Link href={`/${encodeURIComponent(feed?.author?.uid)}`} className={`flex items-center gap-1 mb-2`}>
                <Image className={`rounded-full`} src={feed?.author?.image === null ? "/images/icons8-user-64.png" : feed?.author?.image} width={30} height={30} alt="author avatar" />
                <span>{feed?.author?.name}</span>
            </Link>
            <Link className={`grid grid-cols-5 items-center`} href={`/${encodeURIComponent(feed?.author?.uid)}/${encodeURIComponent(feed?.id!)}`}>
                <div className={`col-span-3 mb-2`}>
                    <h1 className={`text-lg font-bold`}>{feed?.title}</h1>
                    <p className={`text-sm`}>{feed?.subtitle}</p>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}
                        components={{ a: LinkRenderer }}
                        className={` prose prose-headings:m-0 prose-p:m-0.6 
                            hr-black prose-hr:border-solid prose-hr:border prose-hr:border-black
                             marker:text-sky-400 ${styles['markdownPreview']}`} >
                        {feed?.article?.slice(0, 50)}
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
                    <Image src='/images/icons8-like-50.png' height={24} width={24} alt="like" />
                    {feed?.likes?.length}
                </Link>
                <button
                    onClick={() => update(feed?.id!, feed?.bookmarks)}
                    className='flex items-center gap-2'>
                    <Image src='/images/icons8-add-bookmark.svg' height={24} width={24} alt="bookmark" />
                    {feed?.bookmarks?.length}
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