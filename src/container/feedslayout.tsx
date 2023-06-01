import { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/chatter.module.css';
import { Header } from '@/components/index';
import Link from 'next/link';

function FeedLayout({ children }: { children: React.ReactNode }) {
    const [isvisible, seIsVisible] = useState(false);
    const handleNav = () => {
        seIsVisible(!isvisible);
    };

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
                        <li className={`mb-3`}>
                            <Link href='/edit/:id' className={`flex items-center gap-1`}>

                                <Image
                                    src='/images/icons8-article.svg'
                                    height={44}
                                    width={34}
                                    alt='notification'
                                />
                                My article
                            </Link>
                        </li>

                        <li className={`flex items-center gap-1 mb-3`}>
                            <Link href='/draft/:id' className={`flex items-center gap-1`}>

                                <Image
                                    src='/images/icons8-draft-64.png'
                                    height={34}
                                    width={34}
                                    alt='notification'
                                />
                                Drafts
                            </Link>
                        </li>
                        <li className={` mb-3`}>
                            <Link href='/bookmarks' className={`flex items-center gap-1`}>

                                <Image
                                    src='/images/icons8-bookmark-64.png'
                                    height={24}
                                    width={34}
                                    alt='notification'
                                />
                                Bookmark
                            </Link>
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
                {children}
            </section >
        </>
    );
}

export default FeedLayout;
