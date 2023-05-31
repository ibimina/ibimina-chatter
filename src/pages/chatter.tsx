import { useAuthContext } from '@/store/store';
import { useRouter } from 'next/router';
import { Key, useEffect, useState } from 'react';
import useLogOut from '@/hooks/useLogout';
import Image from 'next/image';
import styles from '@/styles/chatter.module.css';
import { Header, LinkRenderer } from '@/components/index';
import { query, collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { firebaseStore } from '@/firebase/config';
import { DocumentData } from 'firebase/firestore';
import { ArticleProps } from '@/types/index';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookmarkProps, LikeProps } from '@/types/article';
import Link from 'next/link';

function Chatter() {
	const { state } = useAuthContext();
	const [feeds, setFeeds] = useState<DocumentData>([]);
	const [isvisible, seIsVisible] = useState(false);
	// const { logoutUser } = useLogOut();
	const router = useRouter();
	const handleNav = () => {
		seIsVisible(!isvisible);
	};
	useEffect(() => {
		if (state?.user === null) {
			router.push('/');
		}
	}, [router, state.user]);

	useEffect(() => {
		const q = query(collection(firebaseStore, 'articles'));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const articles: DocumentData = [];
			querySnapshot.forEach((doc) => {
				const isUserTag = state?.user?.tags?.some((tag) => {
					return doc.data().tags.includes(tag);
				});
				if (state.user.uid === doc.data().author.uid || isUserTag) {
					articles.push({ ...doc.data(), id: doc.id });
				}
			});
			setFeeds(articles);

		});
		return () => unsubscribe();
	}, [state.user, state.user.uid]);
	const increaseLike = async (id: string, likes: LikeProps[], feed: ArticleProps) => {
		const hasLiked = likes.find((like: LikeProps) => {
			return like.uid === state.user.uid
		})
		const docRef = doc(firebaseStore, 'articles', id);
		if (hasLiked) {
			await setDoc(docRef, {
				likes: likes.filter((like: LikeProps) => {
					return like.uid !== state.user.uid
				})
			}, { merge: true });
		} else if (likes.length === 0 || hasLiked === undefined) {
			await setDoc(docRef, {
				likes: [{
					uid: state.user.uid,
					name: state.user.displayName,
					image: state.user.photoURL
				}]
			}, { merge: true });
		}
	}
	const addBookmark = async (id: string, bookmarks: BookmarkProps[]) => {
		const hasBookmarked = bookmarks.find((bookmark: BookmarkProps) => {
			return bookmark.uid === state.user.uid
		})
		const docRef = doc(firebaseStore, 'articles', id);
		if (hasBookmarked) {
			await setDoc(docRef, {
				bookmarks: bookmarks.filter((bookmark: BookmarkProps) => {
					return bookmark.uid !== state.user.uid
				})
			}, { merge: true });
		} else if (bookmarks.length === 0 || hasBookmarked === undefined) {
			await setDoc(docRef, {
				bookmarks: [{
					uid: state.user.uid,
				}]
			}, { merge: true });
		}
	}

	return (
		<>
			<Header handleNav={handleNav} />
			<section
				className={`relative  lg:grid lg:grid-cols-5 lg:gap-9 p-4  ${styles.grid}`}
			>
				<aside className={` ${styles.aside}`} data-visible={isvisible}>
					<ul
						className={`h-full w-9/12 lg:w-full p-10 bg-slate-100 lg:rounded-xl ${styles.ul}`}
					>
						<li className={`flex items-center gap-1 mb-3`}>
							<Image
								src='/images/icons8-article.svg'
								height={44}
								width={34}
								alt='notification'
							/>
							My article
						</li>
						<li className={`flex items-center gap-1 mb-3`}>
							<Image
								src='/images/icons8-draft-64.png'
								height={34}
								width={34}
								alt='notification'
							/>
							Drafts
						</li>
						<li className={`flex items-center gap-1 mb-3`}>
							<Image
								src='/images/icons8-bookmark-64.png'
								height={24}
								width={34}
								alt='notification'
							/>
							Bookmark
						</li>
						<li className={`flex items-center gap-1`}>
							<Image
								src='/images/icons8-message-50.png'
								height={44}
								width={34}
								alt='notification'
							/>
							message
						</li>
					</ul>
					<button
						className={`bg-blue-100 top-0 right-0 absolute lg:hidden`}
						onClick={() => seIsVisible(!isvisible)}
					>
						close
					</button>
				</aside>
				<main className={`lg:col-span-4`}>
					{feeds && feeds.length > 0 ? (
						<ul className={`p-2`}>
							{feeds.map((feed: ArticleProps, index: Key) => {
								return (
									<li key={index} className={`mb-8`}>
										<Link href={`/${encodeURIComponent(feed.author.uid)}`} className={`flex items-center gap-1 mb-2`}>
											<Image className={`rounded-full`} src={feed.author.image} width={30} height={30} alt="author avatar" />
											<span>{feed.author.name}</span>
										</Link>
										<Link className={`grid grid-cols-4 items-center`} href={`/${encodeURIComponent(feed.author.uid)}/${encodeURIComponent(feed.title)}`}>
											<div className={`col-span-3 mb-2`}>
												<h1 className={`text-2xl font-bold`}>{feed.title}</h1>
												<p className={`text-sm`}>{feed.subtitle}</p>
												<ReactMarkdown remarkPlugins={[remarkGfm]}
													components={{ a: LinkRenderer }}
													className={` prose prose-headings:m-0 prose-p:m-0.6 
                            hr-black prose-hr:border-solid prose-hr:border prose-hr:border-black
                             marker:text-sky-400 ${styles['markdownPreview']}`} >
													{feed.article.slice(0, 100)}
												</ReactMarkdown>
											
											</div>
											<div className='col-span-1 rounded-xl relative h-40  max-w-xs w-full'>
												<Image src={feed.coverImageUrl} fill sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,  33vw" className="rounded-xl "
													alt="article cover image" />
											</div>
										</Link>
										<div className='mt-3 flex items-center gap-2'>
											<Link  href={`/${encodeURIComponent(feed.author.uid)}/${encodeURIComponent(feed.title)}`}
												
												className={`flex items-center gap-1`}>
												<Image src='/images/icons8-like-50.png' height={24} width={24} alt="like" />
												{feed.likes.length}
											</Link>
											<button 
											onClick={()=>addBookmark(feed.id!,feed.bookmarks)}
											className='flex items-center gap-2'>
												<Image src='/images/icons8-add-bookmark.svg' height={24} width={24} alt="bookmark" />
												{feed.bookmarks.length}
											</button>
											<Link href={`/${encodeURIComponent(feed.author.uid)}/${encodeURIComponent(feed.title)}`} className='flex items-center gap-1'>
												<Image src="/images/icons8-chart-24 (1).png" height={18} width={18} alt="views chart" />
												{feed.views}
											</Link>
											<Link href={`/${encodeURIComponent(feed.author.uid)}/${encodeURIComponent(feed.title)}`} className='flex items-center gap-1'>
												<Image src="/images/icons8-comment-24.png" height={24} width={24} alt="comments" />
												{feed.comments.length}
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
			</section >
		</>
	);
}

export default Chatter;
