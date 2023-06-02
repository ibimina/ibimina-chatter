import { useAuthContext } from '@/store/store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { query, collection, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { firebaseStore } from '@/firebase/config';
import { DocumentData } from 'firebase/firestore';
import { BookmarkProps } from '@/types/article';
import FeedLayout from '@/container/feedslayout';
import { ArticleProps } from '@/types/index';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import Image from 'next/image';
import { LinkRenderer } from '@/components/index';
import styles from '@/styles/chatter.module.css';
import { Key } from 'react';

function Bookmarks() {
    const { state } = useAuthContext();
    const [feeds, setFeeds] = useState<DocumentData>([]);
    const router = useRouter();

    useEffect(() => {
        if (state?.user === null) {
            router.push('/');
        }
    }, [router, state.user]);

    useEffect(() => {
        const q = query(collection(firebaseStore, 'bookmarks'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const articles: DocumentData = [];
            querySnapshot.forEach((doc) => {
                if (state?.user?.uid === doc?.data().uid) {
                    articles.push({ ...doc.data(), id: doc.id });
                }
            });
            setFeeds(articles);
        });
        return () => unsubscribe();
    }, [state?.user, state?.user?.uid]);

    const addBookmark = async (id: string, bookmarks: BookmarkProps[]) => {
        const docRef = doc(firebaseStore, 'articles', id);
        const bookmarkRef = doc(firebaseStore, 'bookmarks', state?.user?.uid);

        const hasBookmarked = bookmarks?.find((bookmark: BookmarkProps) => {
            return bookmark?.uid === state?.user?.uid
        })
        const bookmarkSnap = await getDoc(bookmarkRef)
        const userBookmarks = bookmarkSnap.data()?.bookmarks

        if (hasBookmarked) {
            await setDoc(docRef, {
                bookmarks: bookmarks?.filter((bookmark: BookmarkProps) => {
                    return bookmark?.uid !== state?.user?.uid
                })

            }, { merge: true });
            await setDoc(bookmarkRef, {
                bookmarks: userBookmarks?.filter((bookmark: BookmarkProps) => {
                    return bookmark?.uid !== id
                })
            }, { merge: true });
        } else if (bookmarks?.length === 0 || hasBookmarked === undefined) {

            await setDoc(docRef, {
                bookmarks: [
                    ...bookmarks,
                    {
                        uid: state?.user?.uid,
                    }]
            }, { merge: true });
            await setDoc(bookmarkRef, {
                bookmarks: [...userBookmarks, {
                    uid: id,
                }]
            }, { merge: true });
        }
    }


    return (
        <>
                <FeedLayout>
                <main className={`lg:col-span-4`}>
                    {feeds && feeds.length > 0 ? (
                        <ul className={`p-2`}>
                            {feeds.map((feed: ArticleProps, index: Key) => {
                                return (
                                    <li key={index} className={`mb-8`}>
                                        <Link href={`/${encodeURIComponent(feed?.author?.uid)}`} className={`flex items-center gap-1 mb-2`}>
                                            <Image className={`rounded-full`} src={feed?.author?.image} width={30} height={30} alt="author avatar" />
                                            <span>{feed.author.name}</span>
                                        </Link>
                                        <Link className={`grid grid-cols-4 items-center`} href={`/${encodeURIComponent(feed.author.uid)}/${encodeURIComponent(feed.id!)}`}>
                                            <div className={`col-span-3 mb-2`}>
                                                <h1 className={`text-2xl font-bold`}>{feed?.title}</h1>
                                                <p className={`text-sm`}>{feed?.subtitle}</p>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}
                                                    components={{ a: LinkRenderer }}
                                                    className={` prose prose-headings:m-0 prose-p:m-0.6 
                            hr-black prose-hr:border-solid prose-hr:border prose-hr:border-black
                             marker:text-sky-400 ${styles['markdownPreview']}`} >
                                                    {feed.article.slice(0, 100)}
                                                </ReactMarkdown>

                                            </div>
                                            <div className='col-span-1 rounded-xl relative h-40  max-w-xs w-full'>
                                                <Image src={feed?.coverImageUrl} fill sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,  33vw" className="rounded-xl "
                                                    alt="article cover image" />
                                            </div>
                                        </Link>
                                        <div className='mt-3 flex items-center gap-2'>
                                            <Link href={`/${encodeURIComponent(feed?.author?.uid)}/${encodeURIComponent(feed?.id!)}`}

                                                className={`flex items-center gap-1`}>
                                                <Image src='/images/icons8-like-50.png' height={24} width={24} alt="like" />
                                                {feed?.likes?.length}
                                            </Link>
                                            <button
                                                onClick={() => addBookmark(feed?.id!, feed?.bookmarks)}
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
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>no article</p>
                    )}
                </main>
                </FeedLayout>
        </>
    );
}

export default Bookmarks;
