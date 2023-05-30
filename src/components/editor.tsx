import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ArticleSide from "./articlesaside";
import LinkRenderer from "./linkrender";
import Buttons from "./markdownbutton";
import styles from "../styles/editor.module.css";
import Image from "next/image";
import { EmojiClickData } from "emoji-picker-react";
import { useState } from "react";
import useFetch from "@/hooks/useFetch";

interface NewType {
    articleDetails: any;
    handleValueChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    insertMarkdown: (markdownSyntax: string) => void;
    unsplashSearch: string;
    getUnsplashTerm: (e: React.ChangeEvent<HTMLInputElement>) => void;
    getUnSplashUrl: (url: string) => void;
    isUnsplashVisible: boolean;
    toggleUnsplash: () => void;
    uploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Editor({ unsplashSearch, isUnsplashVisible, uploadImage, toggleUnsplash, getUnsplashTerm, articleDetails, handleValueChange, insertMarkdown, getUnSplashUrl }: NewType) {
    const [isvisible, setIsVisible] = useState<boolean>(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    const toggleEmojiPicker = () => {
        return setShowEmojiPicker(!showEmojiPicker)
    }
    const handleEmojiSelect = (emoji: EmojiClickData) => {
        setShowEmojiPicker(false);
        insertMarkdown(`${emoji.emoji} `);
    };
    const { fetchedData, getData } = useFetch(`https://api.unsplash.com/search/photos?query=${unsplashSearch}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&page=${page}`)
    const getPicturesFromUnsplash = async (e: React.FormEvent) => {
        e.preventDefault();
        getData()
    };
    const increasePage = () => {
        setPage(page + 1)
    }
    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop === clientHeight) {
            increasePage()
        }
    }

    return (<>
        <button
            onClick={() => setIsVisible(!isvisible)}
            className={`${styles.menu}`}
            aria-label='menu'
        ></button>
        <main className={`lg:grid lg:grid-cols-7 lg:gap-2 ${styles.editorGrid}`}>
            <ArticleSide isvisible={isvisible} />
            <section className={`col-span-6 ${styles.editSection}`} data-shrink={isvisible}>
                {
                    articleDetails?.coverImageUrl ?
                        <div className={`relative w-full h-96 mb-2`}>
                            <Image src={articleDetails?.coverImageUrl} alt="" fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw,  33vw" />
                        </div>
                        : <button className={`mb-1`}>Add cover image</button>
                }
                <div className={`px-3 md:px-5 lg:px-0`}>
                    <div className={`relative`}>
                        <div className={`flex items-center mb-1 gap-2`}>
                            <label className={`${styles.fileInput}`}>
                                <input type="file" onChange={uploadImage} />
                                <span>upload image</span>
                            </label>
                            <button onClick={toggleUnsplash} className={`${styles.unsplash}`} >Unsplash</button>
                            <div data-visible={isUnsplashVisible} className={`${styles.unsplashDropdown}`} onScroll={onScroll}>
                                <form onSubmit={getPicturesFromUnsplash}>
                                    <input value={unsplashSearch} onChange={getUnsplashTerm} type="text"
                                        placeholder='Search Unsplash Image' name="" className={`block w-full`} />
                                </form>
                                <div className={`grid grid-cols-2  ${styles.pictures}`}>
                                    {fetchedData &&
                                        fetchedData.map((item, index) => {
                                            return <button key={index} className={`relative ${styles.imageContainer}`}
                                                onClick={() => getUnSplashUrl(item.urls.regular)}>
                                                <Image src={item?.urls?.full} fill sizes="(max-width: 768px) 100vw,
                                                (max-width: 1200px) 50vw,  33vw" className={`${styles.unsplashImage}`}
                                                    alt={item.alt_description} />
                                                <span className={`absolute bottom-2 text-slate-200 `}>{item.user.name}</span>
                                            </button>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                    <textarea placeholder='Title' name="title" rows={1}
                        value={articleDetails.title} className={`block mb-2 w-full p-2`}
                        onChange={handleValueChange} />
                    <textarea placeholder='subtitle' name="subtitle" rows={1}
                        value={articleDetails.subtitle} className={`block mb-2 w-full p-2`}
                        onChange={handleValueChange}
                    />
                    <Buttons
                        handleClick={insertMarkdown}
                        toggleEmojiPicker={toggleEmojiPicker}
                        showEmojiPicker={showEmojiPicker}
                        selectEmoji={handleEmojiSelect}
                    />
                    <div className={`grid grid-cols-2 gap-2 ${styles.markdownWrapper}`}>
                        <div className={`${styles.markdown}`}>
                            <h1>Markdown Editor</h1>
                            <textarea
                                name="article"
                                id="markdownTextarea"
                                rows={10}
                                value={articleDetails.article}
                                onChange={(e) => handleValueChange(e)}
                                placeholder="Enter Markdown text"
                                className={`${styles.textarea} w-full p-3 border-2 border-solid border-current`}
                            />
                        </div>
                        <div>
                            <h2>Preview</h2>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}
                                components={{ a: LinkRenderer }}
                                className={` prose prose-headings:m-0 prose-p:m-0.6 
                            hr-black prose-hr:border-solid prose-hr:border prose-hr:border-black
                             marker:text-sky-400 ${styles['markdownPreview']}`} >
                                {articleDetails.article}
                            </ReactMarkdown>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    </>);
}

export default Editor;