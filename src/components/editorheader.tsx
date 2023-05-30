import Image from 'next/image';
import { useAuthContext } from '@/store/store';
import { useRouter } from 'next/router';

interface NewType {
    publishArticleInFirebase: (e: React.MouseEvent) => Promise<void>;
    changeRoute?: (route: string) => void;
}

function EditorHeader({ publishArticleInFirebase, changeRoute }: NewType) {
    const { state } = useAuthContext();
    const route = useRouter()
    return (
        <header
            className={`grid grid-cols-3 lg:grid-cols-7 items-center py-3 px-6`}
        >
            <div className={`flex items-center gap-2 col-span-1 md:col-span-1`}>
                {/* <button
                onClick={handleNav}
                className={`${styles.menu}`}
                aria-label='menu'
            ></button> */}
                {
                    route.pathname === "/post"
                        ?
                        <h1 className={`text-3xl font-bold underline text-red-300`}><button onClick={() => changeRoute!("chatter")}> Chatter</button></h1>
                        : <h1 className={`text-3xl font-bold underline`}> Chatter</h1>
                }

            </div>

            <nav className={`col-start-3 lg:col-start-6 lg:col-end-8`}>
                <ul className={`flex items-center gap-2 justify-end`}>
                    <li
                        className={`relative p-1 rounded-3xl lg:py-2 lg:px-6  border-2 border-current`}>
                        <button onClick={publishArticleInFirebase} className={`block`}>
                            {
                                route.pathname.includes("/edit") ? "Update" : "Publish"
                            }
                        </button>
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
        </header>
    );
}

export default EditorHeader;