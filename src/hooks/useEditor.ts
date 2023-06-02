import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { DocumentData, collection, doc, setDoc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStore, firebaseAuth, firebaseStorage,timestamp } from "@/firebase/config";
import useCollection from "./useCollection";
import { useAuthContext } from "@/store/store";
import { ArticleProps, CommentProps, BookmarkProps, LikeProps } from "@/types";

function useEditor() {
    const router = useRouter()
    const id = router.query.id
    const { state } = useAuthContext()
    const { data } = useCollection("articles", id?.toString()!)
    const [unsplashSearch, setUnsplashSearch] = useState<string>('Inspiration');
    const [isUnsplashVisible, setIsUnsplashVisible] = useState<boolean>(false);
    const [isvisible, setIsVisible] = useState<boolean>(false);
    const [articleDetails, setArticleDetails] = useState<DocumentData | ArticleProps>({
        title: "",
        subtitle: "",
        coverImageUrl: "",
        article: "",
        createdat: "",
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
        console.log(textarea.value)
        setArticleDetails({ ...articleDetails, article: textarea.value })
        textarea.focus();
    };
    const toggleVisible = () => {
        setIsVisible(!isvisible)
    }

    useEffect(() => {
        if (id) return setArticleDetails(data);

    }, [id, data])

    const publishArticleInFirebase = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (articleDetails.title.trim() === "") {
            alert("Looks like you forgot to add a title")
        } else if (articleDetails.title.trim().length < 9) {
            return alert("Title is too short")
        } else if (articleDetails.article.trim().length > 9 && articleDetails.title.trim() !== "") {
            const author = {
                name: state?.user?.displayName,
                uid: state?.user?.uid,
                image: state?.user?.photoURL
            }
          const docRef =  await addDoc(collection(firebaseStore, "articles"), { ...articleDetails, published: true, author });
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
            const userRef = doc(firebaseStore, 'articles', id?.toString()!);
            setDoc(userRef, {
                ...articleDetails,
            }, { merge: true });
            //    router.push(`/article/${docRef.id}`)
            console.log("Document update with: ", articleDetails);
        }
    }
    const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setArticleDetails({ ...articleDetails, [e.target.name]: e.target.value })
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
        const author = {
            name: state?.user?.displayName,
            uid: state?.user?.uid,
            image: state?.user?.photoURL
        }
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
        uploadImage
    };
}

export default useEditor;