import { useRouter } from 'next/router';
import styles from "../styles/editor.module.css";
interface NewType {
    changeRoute: (route: string) => void;
    isvisible: boolean;
    handleVisible: (e: React.MouseEvent) => void;
    togglePublishing: () => void;
}

function EditorHeader({ togglePublishing, changeRoute, handleVisible }: NewType) {

    const route = useRouter()
    return (
        <header
            className={`flex items-center justify-between py-3 px-6`} >
            <div className={`flex items-center gap-3`}>
                <button
                    onClick={() => changeRoute!("chatter")}
                    className={`${styles.back} `}
                    aria-label='menu'
                ></button>
                <button
                    onClick={handleVisible}
                    className={`${styles.menu}`}
                    aria-label='menu'
                ></button>
            </div>

            <nav className={`col-start-3 lg:col-start-7 lg:col-end-10`}>
                <ul className={`flex items-center gap-2 justify-end`}>
                    <li
                        className={`relative rounded-3xl py-2 px-6 bg-violet-900 font-medium text-slate-50 focus:border-2 focus:border-current`}>
                        <button
                            onClick={togglePublishing}
                            className={`block`}>
                            {
                                route.pathname.includes("/edit") ? "Update" : "Publish"
                            }
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default EditorHeader;