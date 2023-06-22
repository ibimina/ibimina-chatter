import { Key } from 'react';
import Link from 'next/link';
import { ArticleProps } from '@/types/index';
import { useFeeds, useInteraction } from '@/hooks/index';
import FeedLayout from '@/container/feedslayout';
import ArticleCard from '@/components/articlecard';
import Head from 'next/head';

function Chatter() {
	const { feeds, isLoading } = useFeeds();
	const { addBookmark } = useInteraction()

	return (
		<>
			<Head>
				<title>Chatter</title>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta http-equiv="X-UA-Compatible" content="IE=7" />
				<meta name="description" content="Chatter feeds page" />
			</Head>
			<FeedLayout>
				<main className={`w-full lg:w-4/6`}>
					{
						isLoading && (
							<div className={`flex items-center justify-center font-normal max-h-screen h-96`}>
								<div className='max-w-md text-center'>
									<p className='text-center'>Loading...</p></div>
							</div>

						)
					}
					{feeds
						&&
						<ul className={`p-2`}>
							{feeds.map((feed: ArticleProps, index: Key) => {
								return (
									<ArticleCard key={index} feed={feed} update={addBookmark} />
								);
							})}
						</ul>
					}
					{feeds?.length === 0 && !isLoading &&
						<div className={`flex items-center justify-center font-normal max-h-screen h-96`}>
							<div className='max-w-md text-center'>
								<p className='text-center'>No articles found matching your preferred tags.</p>
								<p>Why not write your own article? It&apos;s a great way to contribute and engage with the community</p>
								<p className='font-medium mt-2 text-violet-700'>Happy exploring!</p>
								<Link href='/explore' className='text-center font-medium block my-12 bg-violet-900 text-slate-200 max-w-max mx-auto  px-4 py-2'>
									Explore more topics
								</Link>
							</div>
						</div>
					}
				</main>
			</FeedLayout>
		</>
	);
}

export default Chatter;
