import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { DocumentData, collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";


function useCollectionSnap( c: string, queyrRef: string) {
    const {state}= useAuthContext()
    const [snap, setSnap] = useState<DocumentData>()
    const [error, setError] = useState("")

    useEffect(() => {

        let ref = query(collection(firebaseStore, c),where(queyrRef,"==",state.user.uid));
        const unsub = onSnapshot(ref, (snapshot) => {
            if (snapshot.empty) {
                setError("No documents found");
            } else {
                let result: { id: string; }[] =[]
                snapshot.docs.forEach((doc) => {
                 result.push({ ...doc.data(), id: doc.id });      
                });
           
                setSnap(result);
            }
        }, (err) => {
            setError(err.message);
        });
        return () => {unsub();}
    }, [c, queyrRef, state.user.uid])
    return { snap,error }
}
export default useCollectionSnap;
