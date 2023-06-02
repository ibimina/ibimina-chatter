import React, { useEffect } from 'react';
import { EditorHeader, Editor } from '@/components/index';
import useEditor from '@/hooks/useEditor';
import router from 'next/router';
import { useAuthContext } from '@/store/store';

const MarkdownEditor = () => {
    const { state } = useAuthContext();
    const{articleDetails,handleValueChange,uploadImage,
        isUnsplashVisible,toggleUnsplash,unsplashSearch,
        getUnsplashTerm,insertMarkdown,getUnSplashUrl,changeRoute,
        updateArticleInFirebase, isvisible, toggleVisible}=useEditor()

    useEffect(() => {
        if (state?.user === null || state?.user?.uid === "") {
            router.push('/');
        }
    }, [state?.user]);
    return (
        <>
            <EditorHeader
                isvisible={isvisible}
                handleVisible={toggleVisible}
                changeRoute={changeRoute}
                publishArticleInFirebase={updateArticleInFirebase} />
            <Editor
                isvisible={isvisible}
                handleVisible={toggleVisible}
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
