import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import useCollection from "./useCollection";
import { useRouter } from "next/router";

function useSingleArticle() {
    const router = useRouter();
    const { id } = router.query;
    const [article, setArticle] = useState<DocumentData>();
    const [comment, setComment] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [isShared, setIsShared] = useState(false);
    const { data } = useCollection("articles", `${id}`)

    useEffect(() => {
        setArticle({ ...data })
    }, [data])
return{article}
}

export default useSingleArticle;