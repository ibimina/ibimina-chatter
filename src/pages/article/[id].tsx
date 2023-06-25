import { Header, LinkRenderer } from "@/components";
import useEditor from "@/hooks/useEditor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import Link from "next/link";

function Article() {
    const { articleDetails } = useEditor()

    return (<>

        <Header handleNav={function (): void {
            throw new Error("Function not implemented.");
        }} />
        <div className={`w-11/12 mx-auto mb-4`}>
            <div className={`flex items-center gap-2 mb-2`}>
                {
                    articleDetails?.coverImageUrl ?
                        <div className={`relative w-full h-96 mb-2`}>
                            <Image src={articleDetails?.coverImageUrl} alt="cover image" fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw,  33vw" />
                        </div>
                        : ""
                }
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]}
                components={{ a: LinkRenderer }}
                className={` prose prose-headings:m-0 prose-p:my-0  prose-li:m-0 prose-ol:m-0 prose-ul:m-0 prose-ul:leading-6
                            hr-black prose-hr:border-solid prose-hr:border prose-hr:border-black
                             marker:text-gray-700  break-words whitespace-pre-wrap`} >
                {articleDetails.article}
            </ReactMarkdown>
        </div>
    </>);
}

export default Article;