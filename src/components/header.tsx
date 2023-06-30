import { useAuthContext } from '@/store/store';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/chatter.module.css';
import useLogOut from '@/hooks/useLogout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useNotification } from '@/hooks';

function Header({ handleNav }: { handleNav: () => void }) {
    const [isClicked, setIsClicked] = useState(false)
    const router = useRouter();
    const { state } = useAuthContext();
    const author = state?.user?.uid
    const { logoutUser } = useLogOut();
    const { notifications } = useNotification()
    const getSearchAndRedirect = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.childNodes[0] as HTMLInputElement
        const search = input.value
        router.push(`/search?q=${search}`)
    }
    const handleLogout = async () => {
        await logoutUser()
        router.push('/')
    }
    return (
        <>
            <header
                className={`relative grid grid-cols-3 lg:grid-cols-7 shadow-md items-center py-4 px-4`}
            >
                <div className={`flex items-center gap-3 col-span-2 md:col-span-1`}>
                    {router.pathname !== '/settings' &&
                        <button
                            onClick={handleNav}
                            className={`lg:hidden ${styles.menu}`}
                            aria-label='menu'
                        ></button>
                    }
                    <Link href="/chatter">
                        <h1 className={`font-bold text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-br  from-purple-700 to-blue-400 `}>InkSpire</h1>
                    </Link>
                </div>
                {router.pathname !== '/settings' &&
                    <form
                        onSubmit={getSearchAndRedirect}
                        className={`col-span-4 row-start-2 mt-5 lg:mt-0 lg:col-span-3 lg:row-start-1 lg:col-start-3`}
                    >
                        <input
                            className={`w-full p-2 rounded-xl border-2 border-slate-500`}
                            type='search'
                            placeholder='what would you like to read?'
                        />
                    </form>
                }
                <nav className={`col-start-3 lg:col-start-6 lg:col-end-8`}>
                    <ul className={`flex items-center gap-2 justify-end`}>

                        {

                            router.pathname !== '/messages' &&
                            <li
                                className={`fixed z-50 bottom-10 right-5 md:relative md:bottom-auto bg-violet-700 hover:bg-black text-gray-50 p-4 rounded-full lg:rounded-3xl lg:right-auto lg:py-2 lg:px-6 border-current`}
                            >
                                <Link href='/post' className={`md:flex md:items-center gap-2 z-50`}>
                                    <Image
                                        className='brightness-100 invert'
                                        src='/images/icons8-write-48.png'
                                        height={24}
                                        width={24}
                                        alt='quill'
                                    />
                                    <span className={`hidden md:block`}>write</span>
                                </Link>
                            </li>
                        }


                        <li >
                            {/* signify user of unread notifications if any notifications has a read value of false */}
                            <Link href='/notifications' className='relative'>
                                {notifications?.some((notification: { read: boolean }) => notification.read === false) &&
                                    <span className={`absolute top-1 right-1 bg-red-500 rounded-full h-2 w-2`}></span>
                                }
                                <Image
                                    src='/images/icons8-notifications-78.png'
                                    height={44}
                                    width={34}
                                    alt='notification'
                                />
                                <span className={`hidden`}>notification</span>
                            </Link>
                        </li>
                        <li
                            className='cursor-pointer'
                            onClick={() => setIsClicked(!isClicked)}>
                            <Image
                                src={state?.user?.photoURL || '/images/icons8-user.svg'}
                                height={40}
                                width={40}
                                alt='user'
                                className={`rounded-full`}
                            />
                        </li>
                    </ul>
                </nav>
                <div className={`${isClicked ? "block absolute top-16 right-3 bg-gray-100 p-3 rounded-lg z-10" : "hidden"}`}>
                    <Link href={`/${encodeURIComponent(author)}`} className={`flex items-center gap-1 mb-2`}>
                        <Image
                            src={state?.user?.photoURL || '/images/icons8-user-64.png'}
                            height={30}
                            width={30}
                            alt='user'
                            className={`rounded-full`}
                        />
                        <span className='capitalize'>{state?.user?.displayName}</span>
                    </Link>
                    <Link href='/chatter' className='block mb-2 cursor-pointer '>Feeds</Link>
                    <Link href='/settings' className='block mb-2 cursor-pointer '>Account setting</Link>
                    <button onClick={handleLogout} className='block'>Logout</button>
                </div>
            </header>

        </>
    );
}

export default Header;