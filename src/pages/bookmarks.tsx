import { useAuthContext } from '@/store/store';
import { useEffect, useState } from 'react';
import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { firebaseStore } from '@/firebase/config';
import FeedLayout from '@/container/feedslayout';
import { ArticleProps, UserBookmarkProps } from '@/types/index';
import { Key } from 'react';
import { useCollection, useInteraction } from '@/hooks';
import ArticleCard from '@/components/articlecard';
import Head from 'next/head';


function Bookmarks() {
    const { state } = useAuthContext();
    const [feeds, setFeeds] = useState<DocumentData>([]);
    // const [isloading, setIsLoading] = useState(false)
    const { data } = useCollection("bookmarks", state.user.uid)


    useEffect(() => {
        let arr: DocumentData = []
        data?.bookmarks?.forEach(async (bookmark: { article_uid: string }) => {
            const ref = await getDoc(doc(firebaseStore, "articles", bookmark.article_uid))
            arr.push({ ...ref.data(), id: ref.id });
            setFeeds(arr)
        })
    }, [data?.bookmarks]);

    const { addBookmark } = useInteraction()
    const update = (id: string, bookmark: UserBookmarkProps[]) => {
        setFeeds(feeds!.filter((feed: { user_uid: string; }) => feed.user_uid !== id))
        addBookmark(id, bookmark)
    }
    return (
        <>
            <Head>
                <title>Bookmarks - chatter</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="IE=7" />
                <meta name="description" content="Your bookmarked articles" />
            </Head>
            <FeedLayout>
             
                <main className={`md:w-4/6`}>
                    <ul className={`p-2`}>
                        {/* {isloading && <>loading...</>} */}
                        {feeds &&
                            feeds.map((feed: ArticleProps, index: Key) => {
                                return (
                                    <ArticleCard key={index} feed={feed} update={update} />
                                );
                            }
                            )}
                    </ul>
                    {
                        feeds?.length === 0 &&
                        <div className={`flex items-center justify-center font-normal max-h-screen h-96`}>
                            <div className='max-w-md text-center'>
                                <p className='text-center'>No articles found in your bookmarks.</p>
                                <p>Click on the bookmark icon to add articles to bookmarks</p>
                                <p className='font-medium mt-2 text-violet-700'>Happy exploring!</p>

                            </div>
                        </div>
                    }
                </main>
            </FeedLayout>
        </>
    );
}

export default Bookmarks;
