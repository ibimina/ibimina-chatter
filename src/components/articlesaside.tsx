import useCollectionSnap from '@/hooks/useCollectionSnap';
import { useAuthContext } from '@/store/store';
import styles from '@/styles/editor.module.css';

import Link from 'next/link';
import { useState } from 'react';
import { DeleteModal } from '@/components/index';
import Image from 'next/image';

function ArticleSide({ isvisible, handleVisible }: { isvisible: boolean, handleVisible: (e: React.MouseEvent) => void }) {
    const { state } = useAuthContext()
    const { snap, loading, error } = useCollectionSnap("articles", "author.uid", state?.user?.uid);
    const publishedLength = snap?.filter((doc: any) => doc.published === true).length;
    const draftLength = snap?.filter((doc: any) => doc.published === false).length;
    const [showdeleteModal, setShowDeleteModal] = useState(false)
    const [showPublishedDeleteModal, setShowPublishedDeleteModal] = useState(false)
    const handleModal = () => {
        setShowDeleteModal(!showdeleteModal)

    }
    const handleModalTwo = () => {
        setShowPublishedDeleteModal(!showPublishedDeleteModal)
    }
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
                        snap?.map((doc: { published: boolean; id: string; title: string, article: string; }) => {
                            return (
                                doc.published === false &&
                                <li key={doc?.id} className={`mb-1 `}>
                                    <Link href={`/draft/${encodeURIComponent(doc.id)}`}>
                                        <div className='flex items-start justify-between'>
                                            <p className={`text-amber-950`}>{doc?.title ? doc?.title : "Untitled"}</p>
                                            <button onClick={handleModal} title='delete'>
                                                <Image src="/images/icons8-delete-32.png" alt="delete icon" height={24} width={24} />
                                            </button>
                                            {showdeleteModal && <DeleteModal articleid={doc.id} published={doc.published} handleModal={handleModal} />}
                                        </div>   <span> {doc?.article.substring(0, 30)}</span>
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
                                <li key={doc?.id} className={`mb-2 flex items-start justify-between`}>
                                    <p> <Link href={`/edit/${encodeURIComponent(doc.id)}`} >
                                        {doc?.title.substring(0, 35)}
                                    </Link>
                                    </p>
                                    <button onClick={handleModal} title='delete'>
                                        <Image src="/images/icons8-delete-32.png" alt="delete icon" height={24} width={24} />
                                    </button>
                                    {showPublishedDeleteModal && <DeleteModal articleid={doc.id} published={doc.published} handleModal={handleModalTwo} />}
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
