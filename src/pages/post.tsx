import React, { useState } from 'react';
import { useAuthContext } from '@/store/store';
import { addDoc, collection } from 'firebase/firestore';
import { firebaseAuth, firebaseStorage, firebaseStore } from '@/firebase/config';
import { useRouter } from 'next/router';
import { EditorHeader, Editor } from '@/components/index';
import { CommentProps, } from '@/types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { BookmarkProps, LikeProps } from '@/types/article';

const MarkdownEditor = () => {
    const { state } = useAuthContext();
    const [unsplashSearch, setUnsplashSearch] = useState<string>('Inspiration');
    const [isUnsplashVisible, setIsUnsplashVisible] = useState<boolean>(false);
    const [articleDetails, setArticleDetails] = useState({
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

    })
    const getUnsplashTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUnsplashSearch(e.target.value.trim())
    }
    const insertMarkdown = (markdownSyntax: string) => {
        const textarea = document.getElementById('markdownTextarea') as HTMLTextAreaElement;
        setArticleDetails({ ...articleDetails, article: articleDetails.article + markdownSyntax })
        textarea.focus();
    };

    const router = useRouter()
    const publishArticleInFirebase = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (articleDetails.title.trim() === "") {
            alert("Looks like you forgot to add a title")
        } else if (articleDetails.title.trim().length > 9) {
            return alert("Title is too short")
        } else if (articleDetails.article.trim().length > 9 && articleDetails.title.trim() !== "") {
            const author = {
                name: state?.user?.displayName,
                uid: state?.user?.uid,
                image: state?.user?.photoURL
            }
            await addDoc(collection(firebaseStore, "articles"), { ...articleDetails, published: true, author });
            //    router.push(`/article/${docRef.id}`)
           }
    }

    const autoSaveDraft = async () => {
        if (articleDetails.article.trim() !== "" && articleDetails.published === false) {
            await addDoc(collection(firebaseStore, "articles"), articleDetails)
        }
    }
    const changeRoute = (route: string) => {
        router.push(`/${route}`)
        autoSaveDraft()
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
    return (
        <>
            <EditorHeader
                changeRoute={changeRoute}
                publishArticleInFirebase={publishArticleInFirebase} />
            <Editor
                articleDetails={articleDetails}
                uploadImage={uploadImage}
                isUnsplashVisible={isUnsplashVisible}
                toggleUnsplash={toggleUnsplash}
                unsplashSearch={unsplashSearch}
                getUnsplashTerm={getUnsplashTerm}
                handleValueChange={handleValueChange}
                insertMarkdown={insertMarkdown}
                getUnSplashUrl={getUnSplashUrl}
            />
        </>
    );
};
export default MarkdownEditor;
