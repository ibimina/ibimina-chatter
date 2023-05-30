import useCollectionSnap from '@/hooks/useCollectinSnap';
import styles from '@/styles/editor.module.css';
import Link from 'next/link';
function ArticleSide({ isvisible }: { isvisible: boolean }) {
    const { snap } = useCollectionSnap("articles", "author.uid");
    const publishedLength = snap?.filter((doc: any) => doc.published === true).length;
    const draftLength = snap?.filter((doc: any) => doc.published === false).length;
    return (
        <aside className={`hidden px-3 pt-5 lg:block lg:col-span-1 bg-slate-400 ${styles.articlesSection}`}
            data-visible={isvisible}>
            <div className={`mb-1`}>
                <h1 className={`mb-2`}>My drafts</h1>
                <ul>
                    {
                        snap?.map((doc: any) => {
                            return (
                                doc.published === false &&
                                <li key={doc?.id} className={`mb-1`}>
                                    <Link href={`/draft/${encodeURIComponent(doc.id)}`}>
                                        {doc?.article}
                                    </Link>
                                </li>
                            )
                        })
                    }
                    {
                        draftLength === 0 &&
                        <>
                            <span>
                                You have no draft
                            </span>
                        </>

                    }
                </ul>
            </div>
            <div>
                <h1 className={`mb-2`}>My published articles</h1>
                <ul>
                    {
                        snap?.map((doc: any) => {
                            return (
                                doc.published === true &&
                                <li key={doc?.id} className={`mb-1`}>
                                    <Link href={`/edit/${encodeURIComponent(doc.id)}`}>
                                        {doc?.article}
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
            <Link href={`/post}`}>
                Create new post
            </Link>
        </aside>);
}
export default ArticleSide;
