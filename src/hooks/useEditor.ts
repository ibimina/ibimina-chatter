import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { DocumentData, collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStore, firebaseAuth, firebaseStorage } from "@/firebase/config";
import useCollection from "./useCollection";
import { useAuthContext } from "@/store/store";
import { ArticleProps, CommentProps, UserBookmarkProps, LikeProps } from "@/types";


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
    const [isDiasbled, setIsDisabled] = useState<boolean>(false);
    const [articleDetails, setArticleDetails] = useState<DocumentData | ArticleProps>({
        title: "",
        subtitle: "",
        coverImageUrl: "",
        article: "",
        readingTime: 0,
        topics: [] as string[],
        published: false,
        likes: [] as LikeProps[],
        views: 0,
        bookmarks: [] as UserBookmarkProps[],
        comments: [] as CommentProps[],
        timestamp: '',
        likesCount: 0,
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
    const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setArticleDetails({ ...articleDetails, [e.target.name]: e.target.value })
    }
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
            setIsDisabled(true)
            const words = articleDetails.article.trim().split(/\s+/).length;
            const time = Math.ceil(words / 225);
            await countTopics()
            const docRef = await addDoc(collection(firebaseStore, "articles"), { ...articleDetails, timestamp: new Date().toISOString(), published: true, author, readingTime: time });
            router.push(`/article/${docRef.id}`)
        }
    }

    const updateArticleInFirebase = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (articleDetails.title.trim() === "") {
            alert("Looks like you forgot to add a title")
        } else if (articleDetails.title.trim().length < 9) {
            return alert("Title is too short")
        } else if (articleDetails.article.trim().length > 9 && articleDetails.title.trim() !== "") {
            setIsDisabled(true)
            const userRef = doc(firebaseStore, 'articles', id?.toString()!);
            await countTopics()
            const words = articleDetails.article.trim().split(/\s+/).length;
            const time = Math.ceil(words / 225);
            setDoc(userRef, {
                ...articleDetails,
                published: true,
                readingTime: time,
                timestamp: new Date().toISOString(),
            }, { merge: true });
            router.push(`/article/${id}`)
        }
    }

    const countTopics = async () => {
        const chatterTopics = getDoc(doc(firebaseStore, "topics", `${process.env.NEXT_PUBLIC_TOPICS_DATABASE_ID}`))
        const realTime: { name: string; count: number; }[] = []
        const ft: { name: string; count: number; }[] = (await chatterTopics)?.data()?.topics
        articleDetails?.topics.forEach(async (topic: string) => {
            const existing = ft?.find((t: { name: string, count: number }) => t.name === topic)
            if (existing) {
                await setDoc(doc(firebaseStore, "topics", `${process.env.NEXT_PUBLIC_TOPICS_DATABASE_ID}`), {
                    topics: ft?.map((t: { name: string, count: number }) => t.name === topic ? { ...t, count: t.count + 1 } : t)
                }, { merge: true })
            } else {
                realTime.push({ name: topic, count: 1 })
                let topics = [...ft, ...realTime]
                await setDoc(doc(firebaseStore, "topics", `${process.env.NEXT_PUBLIC_TOPICS_DATABASE_ID}`), { topics })
            }
        })
    }

    const addTag = (e: React.FormEvent) => {
        e.preventDefault();
        let forms = e.currentTarget as HTMLFormElement
        let topic = (e.currentTarget.childNodes[0] as HTMLInputElement).value
        if (topic.trim() !== "" && articleDetails?.topics?.length < 5) {
            setArticleDetails({ ...articleDetails, topics: [...articleDetails?.topics, topic] })
            forms.reset()
        }
    }
    const removeTag = (topic: string) => {
        setArticleDetails({ ...articleDetails, topics: articleDetails.topics.filter((t: string) => t !== topic) })
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
        if (articleDetails?.id?.length > 0) {
            const userRef = doc(firebaseStore, 'articles', id?.toString()!);
            await setDoc(userRef, {
                ...articleDetails,
                published: false,
            }, { merge: true });
        } else if (articleDetails?.article?.trim() !== "" && articleDetails?.published === false) {
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
        isDiasbled
    };
}

export default useEditor;