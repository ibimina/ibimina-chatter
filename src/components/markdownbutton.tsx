import { useState } from "react";
import styles from '@/styles/editor.module.css'
import { heading, markdownValues } from "@/constants/heading";
import dynamic from "next/dynamic";
const Picker = dynamic(
    () => {
        return import('emoji-picker-react');
    },
    { ssr: false }
);
function Buttons({ handleClick, toggleEmojiPicker, showEmojiPicker, selectEmoji }:
    {
        handleClick: (val: string) => void,
        toggleEmojiPicker: () => void,
        showEmojiPicker: boolean,
        selectEmoji: (emoji: any) => void
    }) {
    const [textHd, setTextHd] = useState<string>('Normal')
    const [showHdOptions, setShowHdOptions] = useState<boolean>(false);
    const handleHeading = (val: string, name: string) => {
        setTextHd(name)
        setShowHdOptions(!showHdOptions)
        handleClick(val)
    }

    return (<>
        <div className={`flex items-center flex-wrap gap-2 mb-5`}>
            <div className={`${styles.hdParent}`}>
                <button className={` ${styles.selectedHd}`} onClick={() => setShowHdOptions(!showHdOptions)}>{textHd}</button>
                <div className={`flex flex-col  ${styles.hd}`}>
                    {showHdOptions &&
                        heading.map((item, index) => {
                            return <button key={index} onClick={() => handleHeading(item.value, item.name)} className={styles.hdBtn}>{item.name}
                            </button>
                        })
                    }
                </div>
            </div>
            {markdownValues.map((item, index) => {
                return <button key={index} onClick={() => handleClick(item.value)} className={`${item.className} ${styles.box}`} aria-label={item.name}></button>
            })
            }
            <div className={`relative`}>
                <button onClick={() => toggleEmojiPicker()} className={` border-2 border-gray-700 p-1`}>😊</button>
                {showEmojiPicker && (
                    <div className={`absolute top-8 right-0`}>
                        <Picker
                            onEmojiClick={selectEmoji}
                        />
                    </div>

                )}
            </div>
        </div>
    </>);
}
export default Buttons;
