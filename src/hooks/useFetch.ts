import { UnSplash } from "@/types";
import { useEffect, useState } from "react";



function useFetch(url: string) {

  const [fetchedData, setFetchedData] = useState<UnSplash[]>([]);
  const getData = async () => {
    const response = await fetch(url);
    const data = await response.json();
    setFetchedData([...fetchedData,...data.results]);
  }
  useEffect(() => {
    getData()
    return () => { getData()}
  })

  return { fetchedData, getData };
}

export default useFetch;