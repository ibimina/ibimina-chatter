import useCollectionSnap from '@/hooks/useCollectinSnap';
import styles from '@/styles/editor.module.css';
import Link from 'next/link';

function ArticleSide({ isvisible }: { isvisible: boolean }) {
    const { snap } = useCollectionSnap("articles", "author.uid");
    const publishedLength = snap?.filter((doc: any) => doc.published === true).length;
    const draftLength = snap?.filter((doc: any) => doc.published === false).length;

    return (
        <aside className={`hidden px-3 pt-5 lg:block lg:col-span-2 bg-gray-100 shadow-inner  rounded-lg ${styles.articlesSection}`}
            data-visible={isvisible}>
            <div className={`mb-12`}>
                <h1 className={`mb-2 font-medium text-amber-950`}>My drafts</h1>
                <ul>
                    {
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
                    {
                        draftLength === 0 &&
                            <span>
                                You have no draft
                            </span>
                    }
                </ul>
            </div>
            <div>
                <h1 className={`mb-4 font-medium text-amber-950`}>My published articles</h1>
                <ul>
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
                            You have no published article
                        </span>
                    }
                </ul>

            </div>
            <Link href={`/post`} className='text-center block my-12 bg-violet-900 text-slate-200 max-w-max mx-auto  px-4 py-2'>
                Create new post
            </Link>
        </aside>);
}
export default ArticleSide;
