import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { DocumentData, collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStore, firebaseAuth, firebaseStorage, timestamp } from "@/firebase/config";
import useCollection from "./useCollection";
import { useAuthContext } from "@/store/store";
import { ArticleProps, CommentProps, BookmarkProps, LikeProps } from "@/types";

function useEditor() {
    const router = useRouter()
    const id = router.query.id
    const { state } = useAuthContext()
    const { displayName, photoURL, uid } = state.user
    const { data } = useCollection("articles", id?.toString()!)
    const [author, setAuthor] = useState({ name: "", uid: "", image: "" })

    const [unsplashSearch, setUnsplashSearch] = useState<string>('Inspiration');
    const [isUnsplashVisible, setIsUnsplashVisible] = useState<boolean>(false);
    const [isvisible, setIsVisible] = useState<boolean>(false);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [articleDetails, setArticleDetails] = useState<DocumentData | ArticleProps>({
        title: "",
        subtitle: "",
        coverImageUrl: "",
        article: "",
        createdat: "",
        readingTime: 0,
        tags: [],
        published: false,
        likes: [] as LikeProps[],
        views: 0,
        bookmarks: [] as BookmarkProps[],
        comments: [] as CommentProps[],
        timestamp: timestamp,
    })
    const getUnsplashTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUnsplashSearch(e.target.value.trim())
    }
    const insertMarkdown = (markdownSyntax: string) => {
        const textarea = document.getElementById('markdownTextarea') as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        textarea.value = (before + markdownSyntax + after);
        setArticleDetails({ ...articleDetails, article: textarea.value })
        textarea.focus();
    };
    const toggleVisible = () => {
        setIsVisible(!isvisible)
    }
    const togglePublishing = () => {
        setIsPublishing(!isPublishing)
    }

    useEffect(() => {
        setAuthor({ name: displayName, uid: uid, image: photoURL })
        if (id) return setArticleDetails(data);

    }, [id, data, displayName, uid, photoURL])

    const publishArticleInFirebase = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (articleDetails.title.trim() === "") {
            alert("Looks like you forgot to add a title")
        } else if (articleDetails.title.trim().length < 9) {
            return alert("Title is too short")
        } else if (articleDetails.article.trim().length > 9 && articleDetails.title.trim() !== "") {
            readingTime()
            const docRef = await addDoc(collection(firebaseStore, "articles"), { ...articleDetails, published: true, author });
            await countTags()
            router.push(`/article/${docRef.id}`)
        }
    }
    function readingTime() {
        const wpm = 225;
        const words = articleDetails.article.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        setArticleDetails({ ...articleDetails, readingTime: time })
    }

    const countTags = async () => {
        const firebaseTags = getDoc(doc(firebaseStore, "tags", "qt9AhhdGU6ZaR5PasTrP"))
        const ft = (await firebaseTags)?.data()?.tags
        articleDetails.tags.forEach(async (tag: string) => {
            const existing = ft?.find((t: { name: string }) => t.name === tag)
            if (existing) {
                await setDoc(doc(firebaseStore, "tags", "qt9AhhdGU6ZaR5PasTrP"), {
                    tags: ft?.map((t: { name: string, count: number }) => t.name === tag ? { ...t, count: t.count + 1 } : t)
                }, { merge: true })
            } else {
                await setDoc(doc(firebaseStore, "tags", "qt9AhhdGU6ZaR5PasTrP"), {
                    tags: [...ft, { name: tag, count: 1 }]
                }, { merge: true })
            }
        })
    }

    const updateArticleInFirebase = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (articleDetails.title.trim() === "") {
            alert("Looks like you forgot to add a title")
        } else if (articleDetails.title.trim().length < 9) {
            return alert("Title is too short")
        } else if (articleDetails.article.trim().length > 9 && articleDetails.title.trim() !== "") {
            const userRef = doc(firebaseStore, 'articles', id?.toString()!);
            setDoc(userRef, {
                ...articleDetails,
                published: true
            }, { merge: true });
            router.push(`/article/${id}`)
        }
    }
    const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setArticleDetails({ ...articleDetails, [e.target.name]: e.target.value })
    }
    const addTag = (e: React.FormEvent) => {
        e.preventDefault();
        let forms = e.currentTarget as HTMLFormElement
        let tag = (e.currentTarget.childNodes[0] as HTMLInputElement).value

        if (tag.trim() !== "" && articleDetails.tags.length < 5) {
            setArticleDetails({ ...articleDetails, tags: [...articleDetails.tags, tag] })
            forms.reset()
        }
    }
    const removeTag = (tag: string) => {
        setArticleDetails({ ...articleDetails, tags: articleDetails.tags.filter((t: string) => t !== tag) })
    }
    const getUnSplashUrl = (url: string) => {
        toggleUnsplash()
        setArticleDetails({ ...articleDetails, coverImageUrl: url })
    }
    const toggleUnsplash = () => {
        setIsUnsplashVisible(!isUnsplashVisible)
    }
    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const uploadpath = `thumbnails/articles/${firebaseAuth.currentUser?.uid}/${file.name}`
        const storageRef = ref(firebaseStorage, uploadpath)
        await uploadBytes(storageRef, file)
        const photoUrl = await getDownloadURL(storageRef)
        setArticleDetails({ ...articleDetails, coverImageUrl: photoUrl })
    }


    const autoSaveDraft = async () => {
        if (articleDetails?.article?.trim() !== "" && articleDetails?.published === false) {
            await addDoc(collection(firebaseStore, "articles"), { ...articleDetails, author })
        }
    }

    const changeRoute = async (route: string) => {
        await autoSaveDraft()
        router.push(`/${route}`)
    }
    return {
        changeRoute,
        articleDetails,
        handleValueChange,
        isvisible,
        toggleVisible,
        updateArticleInFirebase,
        publishArticleInFirebase,
        getUnsplashTerm,
        getUnSplashUrl,
        isUnsplashVisible,
        toggleUnsplash,
        unsplashSearch,
        insertMarkdown,
        uploadImage,
        isPublishing,
        togglePublishing,
        addTag,
        removeTag,
    };
}

export default useEditor;