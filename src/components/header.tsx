import { useAuthContext } from '@/store/store';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/chatter.module.css';
import useLogOut from '@/hooks/useLogout';
function Header({ handleNav }: { handleNav: () => void }) {
    const { state } = useAuthContext();
    const { logoutUser } = useLogOut();
    return (
        <header
            className={`grid grid-cols-3 lg:grid-cols-7 items-center py-4 px-4`}
        >
            <div className={`flex items-center gap-3 col-span-2 md:col-span-1`}>
                <button
                    onClick={handleNav}
                    className={`md:hidden ${styles.menu}`}
                    aria-label='menu'
                ></button>
                <Link href="/chatter"><h1 className={`text-3xl font-bold underline`}>Chatter</h1></Link>  
            </div>
            <form
                className={`col-span-4 row-start-2 mt-5 lg:mt-0 lg:col-span-3 lg:row-start-1 lg:col-start-3`}
            >
                <input
                    className={`w-full p-2 rounded-xl border-2 border-slate-500`}
                    type='search'
                    placeholder='what would you like to read?'             
                />
            </form>
            <nav className={`col-start-3 lg:col-start-6 lg:col-end-8`}>
                <ul className={`flex items-center gap-2 justify-end`}>
                    <li
                        className={`fixed bottom-10 right-5 md:relative md:bottom-auto bg-violet-900 text-gray-50 p-4 rounded-full lg:rounded-3xl lg:right-auto lg:py-2 lg:px-6  hover:border-2 border-current`}
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
                  {/* <button onClick={logoutUser}>logout</button> */}
                    <li>
                        <Image
                            src='/images/icons8-notifications-78.png'
                            height={44}
                            width={34}
                            alt='notification'
                        />
                        <span className={`hidden`}>notification</span>
                    </li>
                    <li>
                        <Image
                            src={state?.user?.photoURL || '/images/icons8-user-64.png'}
                            height={50}
                            width={50}
                            alt='user'
                            className={`rounded-full`}
                        />
                    </li>
                </ul>
            </nav>
        </header>);
}

export default Header;