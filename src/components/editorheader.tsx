import Image from 'next/image';
import { useAuthContext } from '@/store/store';
import { useRouter } from 'next/router';
import styles from "../styles/editor.module.css";
interface NewType {
    publishArticleInFirebase: (e: React.MouseEvent) => Promise<void>;
    changeRoute: (route: string) => void;
    isvisible: boolean;
    handleVisible: (e: React.MouseEvent) => void;
}

function EditorHeader({ publishArticleInFirebase, changeRoute,handleVisible }: NewType) {
 
    const { state } = useAuthContext();
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
                        className={`relative p-1 rounded-3xl lg:py-2 lg:px-6 bg-violet-900 font-medium text-slate-50 focus:border-2 focus:border-current`}>
                        <button onClick={publishArticleInFirebase} className={`block`}>
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