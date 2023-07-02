import { firebaseStore } from "@/firebase/config";
import { DocumentData, doc, onSnapshot, } from "firebase/firestore";
import { useEffect, useState } from "react"

const useCollection = (collRef: string, user: string,) => {
    const [data, setData] = useState<DocumentData>([])

    useEffect(() => {
        const getData = async () => {
            const docRef = doc(firebaseStore, collRef, user);
            onSnapshot(docRef, (doc) => {
                console.log(doc.data())
                if (doc.exists()) {
                    setData({ ...doc.data(), id: doc.id })
                } else {
                    setData([])
                }
            })
        }
        if (user?.length > 1) {
            getData()
        }

    }, [collRef, user])

    return { data }
}
export default useCollection;