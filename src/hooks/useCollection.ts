import { firebaseStore } from "@/firebase/config";
import { DocumentData, doc, getDoc,  } from "firebase/firestore";
import { useEffect, useState } from "react"

const useCollection = (collRef:string,user: string,) => {
    const [data, setData] = useState<DocumentData>([])

    useEffect(() => {
        const getData = async () => {
            const docRef = doc(firebaseStore, collRef, user);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {         
                setData({...docSnap.data(),id:docSnap.id})
            } 
        }
        if (user?.length > 1) {
            getData()
        }
    }, [collRef, user, user?.length])

    return { data }
}
export default useCollection;