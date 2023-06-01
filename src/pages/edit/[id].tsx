import React, { useEffect } from 'react';
import { EditorHeader, Editor } from '@/components/index';
import useEditor from '@/hooks/useEditor';
import router from 'next/router';
import { useAuthContext } from '@/store/store';

const MarkdownEditor = () => {
    const { state } = useAuthContext();
    const {articleDetails,handleValueChange,uploadImage,
        isUnsplashVisible,toggleUnsplash,unsplashSearch,isvisible,toggleVisible,
        getUnsplashTerm,insertMarkdown,getUnSplashUrl,updateArticleInFirebase} = useEditor()
    
    useEffect(() => {
        if (state?.user === null || state?.user?.uid === "") {
            router.push('/');
        }
    }, [state?.user]);
        return (
        <main>
            <EditorHeader
                isvisible={isvisible}
                handleVisible={toggleVisible}
                publishArticleInFirebase={updateArticleInFirebase} />
            <Editor
                isvisible={isvisible}
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
        </main>
    );
};
export default MarkdownEditor;
