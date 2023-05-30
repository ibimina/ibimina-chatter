import React, { useEffect, useState } from 'react';
import { DocumentData, doc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseStorage, firebaseStore } from '@/firebase/config';
import { useRouter } from 'next/router';
import { EditorHeader, Editor } from '@/components/index';
import { ArticleProps, CommentProps, } from '@/types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import useCollection from '@/hooks/useCollection';

const MarkdownEditor = () => {
    const [unsplashSearch, setUnsplashSearch] = useState<string>('Inspiration');
    const [isUnsplashVisible, setIsUnsplashVisible] = useState<boolean>(false);
    const [articleDetails, setArticleDetails] = useState<DocumentData | ArticleProps>({
        title: "",
        subtitle: "",
        coverImageUrl: "",
        article: "",
        createdat: "",
        tags: [],
        published: false,
        likes: 0,
        views: 0,
        bookmarks: 0,
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
    const id = router.query.id
 
    const {data} = useCollection("articles",id?.toString()!)
    useEffect(() => {
     return setArticleDetails(data);
     
    },[data])

    const publishArticleInFirebase = async (e: React.MouseEvent) => {
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
    return (
        <>
            <EditorHeader
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
