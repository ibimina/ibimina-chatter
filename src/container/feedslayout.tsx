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
                className={`relative md:flex md:gap-9 p-4  lg:items-start`}>
                <aside className={` ${styles.aside} md:w-full  lg:w-3/12`} data-visible={isvisible}>
                    <ul className={`h-full w-9/12 lg:w-full p-5 pt-12 md:w-5/12 bg-gray-100 lg:rounded-xl ${styles.ul}`}>
                        <li className={`mb-3 font-medium`}>
                            <Link href='/chatter' className={`flex items-center gap-2`}>
                                <Image
                                    src='/images/icons8-home-48.png'
                                    height={44}
                                    width={34}
                                    alt='notification'
                                />
                                Home
                            </Link>
                        </li>
                        <li className={`mb-3 font-medium`}>
                            <Link href='/explore' className={`flex items-center gap-2`}>
                                <Image
                                    src='/images/icons8-explore-48.png'
                                    height={44}
                                    width={34}
                                    alt='notification'
                                />
                                Explore
                            </Link>
                        </li>
                        <li className={`mb-3 font-medium`}>
                            <Link href='/post' className={`flex items-center gap-2`}>
                                <Image
                                    src='/images/icons8-article.svg'
                                    height={44}
                                    width={34}
                                    alt='notification'
                                />
                                My article
                            </Link>
                        </li>
                        <li className={`flex items-center gap-1 mb-3 font-medium`}>
                            <Link href='/post' className={`flex items-center gap-2`}>
                                <Image
                                    src='/images/icons8-article-50.png'
                                    height={34}
                                    width={34}
                                    alt='notification'
                                />
                                Drafts
                            </Link>
                        </li>
                        <li className={`mb-3 font-medium`}>
                            <Link href='/bookmarks' className={`flex items-center gap-2`}>
                                <Image
                                    src='/images/icons8-bookmark-64.png'
                                    height={24}
                                    width={34}
                                    alt='notification'
                                />
                                Bookmark
                            </Link>
                        </li>
                        {/* <li className={`flex items-center gap-2 font-medium`}>
                            <Image
                                src='/images/icons8-message-50.png'
                                height={44}
                                width={34}
                                alt='notification'
                            />
                            Message
                        </li> */}
                    </ul>
                    <button
                        aria-label='close'
                        className={` top-1 brightness-100 invert right-2 absolute lg:hidden ${styles.close}`}
                        onClick={() => seIsVisible(!isvisible)}></button>
                </aside>
                {children}
            </section >
        </>
    );
}
export default FeedLayout;
