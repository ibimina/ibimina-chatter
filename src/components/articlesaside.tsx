import useCollectionSnap from '@/hooks/useCollectionSnap';
import { useAuthContext } from '@/store/store';
import styles from '@/styles/editor.module.css';
import Link from 'next/link';

function ArticleSide({ isvisible, handleVisible }: { isvisible: boolean, handleVisible: (e: React.MouseEvent) => void }) {
    const { state } = useAuthContext()
    const { snap, loading, error } = useCollectionSnap("articles", "author.uid", state?.user?.uid);
    const publishedLength = snap?.filter((doc: any) => doc.published === true).length;
    const draftLength = snap?.filter((doc: any) => doc.published === false).length;
    return (
        <aside className={` px-3 pt-5 lg:block lg:col-span-2 bg-gray-100 shadow-inner lg:rounded-lg ${styles.articlesSection}`}
            data-visible={isvisible}>
            <button className='absolute top-1 lg:hidden' onClick={handleVisible}>close</button>
            <div className={`mb-12`}>
                <h1 className={`mb-2 font-medium text-amber-950`}>My Drafts</h1>
                <ul>
                    {
                        loading &&
                        <span>Loading...</span>
                    }
                    {
                        error &&
                        <span>{error}</span>
                    }
                    {snap &&
                        snap?.map((doc: any) => {
                            return (
                                doc.published === false &&
                                <li key={doc?.id} className={`mb-1 `}>
                                    <Link href={`/draft/${encodeURIComponent(doc.id)}`}>
                                        {doc?.article}
                                    </Link>
                                </li>
                            )
                        })
                    }
                    {draftLength === 0 &&
                        <span>
                            You have no draft
                        </span>
                    }
                </ul>
            </div>
            <div>
                <h1 className={`mb-4 font-medium text-amber-950`}>Published</h1>
                <ul>
                    {
                        loading &&
                        <span>Loading...</span>
                    }
                    {
                        error &&
                        <span>{error}</span>
                    }
                    {
                        snap?.map((doc: any) => {
                            return (
                                doc.published === true &&
                                <li key={doc?.id} className={`mb-2`}>
                                    <Link href={`/edit/${encodeURIComponent(doc.id)}`} >
                                        {doc?.title}
                                    </Link>
                                </li>
                            )
                        })
                    }
                    {
                        publishedLength === 0 &&
                        <span>
                            No published article
                        </span>
                    }
                </ul>

            </div>
            <Link href={`/post`} className='text-center block my-12 border-solid border border-violet-900 text-violet-700 rounded-3xl max-w-max mx-auto  px-4 py-2'>
                Create new post
            </Link>
        </aside>);
}
export default ArticleSide;
