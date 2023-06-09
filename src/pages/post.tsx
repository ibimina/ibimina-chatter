import React, { useEffect } from 'react';
import { EditorHeader, Editor } from '@/components/index';
import useEditor from '@/hooks/useEditor';
import router from 'next/router';
import { useAuthContext } from '@/store/store';

const MarkdownEditor = () => {
    const { articleDetails, handleValueChange,
        uploadImage, isUnsplashVisible, toggleUnsplash,
        unsplashSearch, getUnsplashTerm, insertMarkdown, getUnSplashUrl,
        publishArticleInFirebase, changeRoute, removeTag,
        isvisible, toggleVisible, isPublishing, togglePublishing, addTag
    } = useEditor()
    const { state } = useAuthContext();
    useEffect(() => {
        if (state?.user === null) {
            router.push('/');
        }
    }, [state?.user]);
    return (
        <>
            <EditorHeader
                isvisible={isvisible}
                handleVisible={toggleVisible}
                changeRoute={changeRoute}
                togglePublishing={togglePublishing}
            />
            <Editor
                articleDetails={articleDetails}
                isvisible={isvisible}
                handleVisible={toggleVisible}
                uploadImage={uploadImage}
                isUnsplashVisible={isUnsplashVisible}
                toggleUnsplash={toggleUnsplash}
                unsplashSearch={unsplashSearch}
                getUnsplashTerm={getUnsplashTerm}
                handleValueChange={handleValueChange}
                insertMarkdown={insertMarkdown}
                getUnSplashUrl={getUnSplashUrl}
                publishArticleInFirebase={publishArticleInFirebase}
                isPublishing={isPublishing}
                togglePublishing={togglePublishing}
                addTag={addTag}
                removeTag={removeTag}
            />
        </>
    );
};
export default MarkdownEditor;
