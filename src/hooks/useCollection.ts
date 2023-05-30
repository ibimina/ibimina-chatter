import { firebaseStore } from "@/firebase/config";
import { DocumentData, doc, getDoc,  } from "firebase/firestore";
import { useEffect, useRef, useState } from "react"

const useCollection = (collRef:string,user: string,) => {
    const [data, setData] = useState<DocumentData>([])

    const q = useRef(user).current

    useEffect(() => {
        const getData = async () => {
            const docRef = doc(firebaseStore, collRef, user);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {         
                setData(docSnap.data())
            } 
        }
        if (user?.length > 1) {
            getData()
        }
    }, [user?.length])



    return { data }
}
export default useCollection;