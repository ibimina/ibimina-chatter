import { firebaseStore } from "@/firebase/config";
import { doc, getDoc,  } from "firebase/firestore";
import { useEffect, useRef, useState } from "react"

const useCollection = (user: string) => {
    const [data, setData] = useState<string[]>([])

    const q = useRef(user).current

    useEffect(() => {
        const getData = async () => {
            const docRef = doc(firebaseStore, "users", user);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
               
                setData(docSnap.data().tags)
            } else {
                // docSnap.data() will be undefined in this case
                setData([...data])
            }
        }
        if (user.length > 1) {
            getData()
        }
    }, [user?.length])



    return { data }
}
export default useCollection;