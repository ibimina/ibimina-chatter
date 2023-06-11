import { useAuthContext } from '@/store/store';
import { Key, useEffect, useState } from 'react';
import Link from 'next/link';
import { query, collection, onSnapshot,DocumentData } from 'firebase/firestore';
import { firebaseStore } from '@/firebase/config';
import { ArticleProps } from '@/types/index';
import useInteraction from '@/hooks/useInteraction';
import FeedLayout from '@/container/feedslayout';
import ArticleCard from '@/components/articlecard';


function Chatter() {
	const { state } = useAuthContext();
	const [feeds, setFeeds] = useState<DocumentData | null>(null);
	const [isloading, setIsLoading] = useState(false)


	useEffect(() => {

		const q = query(collection(firebaseStore, 'articles'));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			setIsLoading(true)
			const articles: DocumentData = [];
			querySnapshot.forEach((doc) => {
				const isUserTag = state?.user?.tags?.some((tag) => {
					return doc?.data()?.tags?.includes(tag);
				});
				if (state?.user?.uid === doc?.data().author?.uid && doc.data().published || isUserTag) {
					articles.push({ ...doc.data(), id: doc.id });
				}
			});
			setFeeds(articles);
			setIsLoading(false)
		});

		return () => unsubscribe();
	}, [state?.user, state?.user?.uid]);

	const { addBookmark } = useInteraction()

	return (
		<>
			<FeedLayout>
				<main className={`md:w-4/6`}>
					{isloading && <>loading...</>}
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
					{feeds?.length === 0 &&
						<div className={`flex items-center justify-center font-normal max-h-screen h-96`}>
							<div className='max-w-md text-center'>
								<p className='text-center'>No articles found matching your preferred tags.</p>
								<p>Why not write your own article? It&apos;s a great way to contribute and engage with the community</p>
								<p className='font-medium mt-2 text-violet-700'>Happy exploring!</p>
								<Link href='/post' className='text-center font-medium block my-12 bg-violet-900 text-slate-200 max-w-max mx-auto  px-4 py-2'>
									Explore more tags
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
