import { firebaseStore, timestamp } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LinkRenderer } from "@/components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "@/styles/editor.module.css"
import { LikeProps, BookmarkProps, CommentProps, ArticleProps } from "@/types/article";
import { useAuthContext } from "@/store/store";
import useCollection from "@/hooks/useCollection";
import useCollectionSnap from "@/hooks/useCollectinSnap";

function SingleArticle() {
    const { state } = useAuthContext();
    const router = useRouter();
    const { id } = router.query;
    const [article, setArticle] = useState({} as ArticleProps);
    const [comment, setComment] = useState('');
    const { snap } = useCollectionSnap('articles', "author.uid");
    useEffect(() => {
        const getArticle = async () => {
            const article = snap?.find((article: ArticleProps) => {
                return article.id === id
            })
            setArticle(article as ArticleProps);
        };
        getArticle();

    }, [id, snap]);
    useEffect(() => {
        (async () => {

            const docRef = doc(firebaseStore, "articles", `${id}`);
            const docSnap = await getDoc(docRef);
            await setDoc(docRef, {
                views: docSnap.data()?.views + 1
            }, { merge: true });
        })();
    }, [id]);
    const increaseLike = async (id: string, likes: LikeProps[]) => {
        const hasLiked = likes.find((like: LikeProps) => {
            return like?.uid === state?.user?.uid
        })
        const docRef = doc(firebaseStore, 'articles', id);
        if (hasLiked) {
            await setDoc(docRef, {
                likes: likes.filter((like: LikeProps) => {
                    return like?.uid !== state?.user?.uid
                })
            }, { merge: true });
        } else if (likes.length === 0 || hasLiked === undefined) {
            await setDoc(docRef, {
                likes: [...
                    likes, {
                    uid: state?.user?.uid,
                    name: state?.user?.displayName,
                    image: state?.user?.photoURL
                }]
            }, { merge: true });
            if (state?.user.uid !== article?.author?.uid) await addNotification('liked')
        }
    }
    const addNotification = async (event: string) => {
        const docRef = doc(firebaseStore, 'notifications', article?.author?.uid);
        const docSnap = await getDoc(docRef);
        await setDoc(docRef, {
            notification: [
                ...docSnap.data()?.notification,
                {
                    uid: state?.user?.uid,
                    name: state?.user?.displayName,
                    image: state?.user?.photoURL,
                    event: event,
                    articleId: article?.id,
                    articleTitle: article?.title,
                }]
        }, { merge: true });
    }
    const addBookmark = async (id: string, bookmarks: BookmarkProps[]) => {
        if(state?.user === null) {
            alert("Please login to bookmark this article")
        }else{
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
          }
  
    const postComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (state?.user === null) return; 
        const docRef = doc(firebaseStore, 'articles', article?.id!);
        await setDoc(docRef, {
            comments: [
                ...article?.comments, {
                uid: state?.user?.uid,
                name: state?.user?.displayName,
                image: state?.user?.photoURL,
                comment: comment,
                timestamp: timestamp
            }]
        }, { merge: true });
        if (state?.user.uid !== article?.author?.uid) await addNotification('commented')
       setComment("")
    }
    return (
        <main className={` max-w-4xl mx-auto p-3`}>
            <div className={`relative h-96 mb-4`}>
                <Image src={article?.coverImageUrl ? article?.coverImageUrl :"" } alt={article?.title} fill sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,  33vw"
                />
            </div>

            <h1 className={`text-2xl text-center mb-6 font-bold`}>{article?.title}</h1>
            <Link href={`/${encodeURIComponent(article?.author?.uid)}`} className={`flex items-center gap-1 mb-8`}>
                <Image className={`rounded-full`} src={article?.author?.image === null ? "/images/icons8-user-64.png" : article?.author?.image} width={30} height={30} alt="author avatar" />
                <span>{article?.author?.name}</span>
            </Link>
            <ReactMarkdown remarkPlugins={[remarkGfm]}
                components={{ a: LinkRenderer }}
                className={` prose prose-headings:m-0 prose-p:m-0.6  prose-li:m-0 prose-ol:m-0 prose-ul:m-0 prose-ul:leading-3
                            hr-black prose-hr:border-solid prose-hr:border prose-hr:border-black
                             marker:text-gray-700 ${styles['markdownPreview']}`} >
                {article?.article}
            </ReactMarkdown>
            <div className='flex items-center gap-2 justify-center mt-20 mb-10'>
                <button
                    onClick={() => increaseLike(article?.id!, article?.likes!)}
                    className={`flex items-center gap-1`}>
                    <Image src='/images/icons8-like-50.png' height={24} width={24} alt="like" />
                    {article?.likes?.length}
                </button>
                <button
                    onClick={() => addBookmark(article?.id!, article?.bookmarks)}
                    className='flex items-center gap-2'>
                    <Image src='/images/icons8-add-bookmark.svg' height={24} width={24} alt="bookmark" />
                    {article?.bookmarks?.length}
                </button>
                <button className='flex items-center gap-1'>
                    <Image src="/images/icons8-chart-24.png" height={18} width={18} alt="views chart" />
                    {article?.views}
                </button>
                <button className='flex items-center gap-1'>
                    <Image src="/images/icons8-comment-24.png" height={24} width={24} alt="comments" />
                    {article?.comments?.length}
                </button>
            </div>
            <div className="py-2">
                <h2 className="text-xl font-bold mb-3">
                    {article?.comments?.length > 1 ? "Comments" : "Comment"}
                   ({article?.comments?.length})
                    </h2>
                <Link href={`/${encodeURIComponent(article?.author?.uid)}`} className={`flex items-center gap-1 mb-8`}>
                    <Image className={`rounded-full`} src={state?.user?.photoURL === null ? "/images/icons8-user-64.png" : state?.user?.photoURL} width={30} height={30} alt="author avatar" />
                    <span>{article?.author?.name}</span>
                </Link>
                 <form className=" " onSubmit={postComment}>
                    <input value={comment} onChange={(e)=>setComment(e.target.value)} className="block border-solid border-2 rounded-lg border-violet-400 w-full p-2 mb-6 outline-0 focus:shadow-violet-500/50 focus:shadow-lg" type="text" placeholder="Ask a question to spark a conversation" name="comment" />
                    <input className="block bg-violet-700 text-gray-200 font-medium p-2 rounded-xl ml-auto" type="submit" value="Comment" />
                </form>
                {article?.comments?.length === 0 ? <p className="text-center text-gray-500">No comments yet</p> :
                    article?.comments?.map((comment, index) => {
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
        </main>);
}

export default SingleArticle;
