import { useAuthContext } from '@/store/store';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/chatter.module.css';

function Header({ handleNav }: { handleNav: () => void }) {
    const { state } = useAuthContext();
    return (
        <header
            className={`grid grid-cols-3 lg:grid-cols-7 items-center py-8 px-6`}
        >
            <div className={`flex items-center gap-2 col-span-2 md:col-span-1`}>
                <button
                    onClick={handleNav}
                    className={`lg:hidden ${styles.menu}`}
                    aria-label='menu'
                ></button>
                <h1 className={`text-3xl font-bold underline`}>Chatter</h1>
            </div>
            <form
                className={`col-span-4 row-start-2 mt-5 lg:mt-0 lg:col-span-3 lg:row-start-1 lg:col-start-3`}
            >
                <input
                    className={`w-full p-2 rounded-xl border-2 border-slate-500`}
                    type='search'
                    placeholder='what would you like to read?'
                    name=''
                    id=''
                />
            </form>
            <nav className={`col-start-3 lg:col-start-6 lg:col-end-8`}>
                <ul className={`flex items-center gap-2 justify-end`}>
                    <li
                        className={`fixed bottom-10 right-5 md:relative md:bottom-auto p-4 rounded-full lg:rounded-3xl lg:right-auto lg:py-2 lg:px-6  border-2 border-current`}
                    >
                        <Link href='/post' className={`lg:flex lg:items-center gap-2`}>
                            <Image
                                src='/images/icons8-write-48.png'
                                height={24}
                                width={24}
                                alt='quill'
                            />
                            <span className={`hidden lg:block`}>write</span>
                        </Link>
                    </li>
                  
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