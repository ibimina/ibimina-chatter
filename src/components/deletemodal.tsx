import { firebaseStore } from '@/firebase/config'
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React from 'react'

export default function DeleteModal({ articleid, handleModal, published }: { articleid: string, handleModal: () => void, published: boolean }) {
    const router = useRouter()
    const deleteArticle = async () => {
        await deleteDoc(doc(firebaseStore, "articles", articleid))
        if (published) {
            const docRef = collection(firebaseStore, "bookmarks");
            //get snapshots of bookmarks and delete article id
            onSnapshot(docRef, (snap) => {
                snap.forEach((book) => {
                    const bookmarks = book.data().bookmarks
                    const filteredBookmarks = bookmarks.filter((bookmark: string) => bookmark !== articleid)
                    console.log(filteredBookmarks)
                    //update bookmarks
                    setDoc(doc(firebaseStore, "bookmarks", book.id), { bookmarks: filteredBookmarks })
                })
            })
        }
        handleModal()
        router.push('/post')

    }
    return (
        <div className='fixed top-0 left-0 w-full h-full bg-slate-900 bg-opacity-50 z-50 flex items-center justify-center'>
            <div className='max-w-sm mx-1 bg-slate-50 p-2 px-3 rounded-md'>
                <h1 className='mb-3 text-xl font-medium text-center'>Are you sure you want to delete this article?</h1>
                <div className='flex items-center justify-between mb-2'>
                    <button className='bg-violet-500 rounded-md px-2 text-white cursor-pointer text-center p-1' onClick={handleModal}>  No, cancel</button>
                    <button className='bg-red-600 rounded-md px-2 text-white p-2 cursor-pointer' onClick={deleteArticle}>Yes, delete</button>
                </div>
            </div>
        </div>
    )
}
