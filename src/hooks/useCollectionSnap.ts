import { firebaseStore } from "@/firebase/config";
import { DocumentData, collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";


function useCollectionSnap( c: string, queyRef: string,id:string) {
    const [snap, setSnap] = useState<DocumentData>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        setLoading(true);
        let ref = query(collection(firebaseStore, c),where(queyRef!,"==",`${id}`));
        const unsub = onSnapshot(ref, (snapshot) => {
            if (snapshot?.empty) {
                setError("No documents found");
            } else {
                let result: { id: string; }[] =[]
                snapshot.docs.forEach((doc) => {
                 result.push({ ...doc.data(), id: doc.id });      
                });
           
                setSnap(result);
                setLoading(false);
                setError("");
            }
        }, (err) => {
            setError(err.message);
            setLoading(false);
        });
        setLoading(false);
        return () => {unsub();}
    }, [c, id, queyRef])
    return { snap,error,loading }
}
export default useCollectionSnap;
