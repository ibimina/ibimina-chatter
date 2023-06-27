import FeedLayout from '@/container/feedslayout';
import { ArticleProps } from '@/types/index';
import { Key } from 'react';
import ArticleCard from '@/components/articlecard';
import Head from 'next/head';
import useBookmarks from '@/hooks/useBookmarks';


function Bookmarks() {
    const {feeds,update,loading} = useBookmarks()

    return (
        <>
            <Head>
                <title>Bookmarks - InkSpire</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="IE=7" />
                <meta name="description" content="Your bookmarked articles" />
            </Head>
            <FeedLayout>
             
                <main className={`md:w-4/6`}>
                    {loading && 
                        <div className={`flex items-center justify-center font-normal max-h-screen h-96`}>
                            <div className='max-w-md text-center'>
                                <p className='text-center'>Loading...</p></div>
                        </div>}
                    <ul className={`p-2`}>
                       
                        {feeds &&
                            feeds.map((feed: ArticleProps, index: Key) => {
                                return (
                                    <ArticleCard key={index} feed={feed} update={update} />
                                );
                            }
                            )}
                    </ul>
                    {
                        feeds?.length === 0 && !loading &&
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
