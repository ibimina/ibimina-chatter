import { UnSplash } from "@/types";
import { useEffect, useState } from "react";



function useFetch(unsplashSearch: string, page: number) {
  const [fetchedData, setFetchedData] = useState<UnSplash[]>([]);
  const url = 'https://api.unsplash.com/search/photos?query='
  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`${url}${unsplashSearch}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&page=${page}`);
      const data = await response.json();
      if(page === 1){
        setFetchedData([ ...data.results]);
      }else{
        setFetchedData((fetchedData) => [...fetchedData, ...data.results]);
      }    
    }
    getData();
  },[unsplashSearch, page])

  const getSearchData = async () => {
    const response = await fetch(`${url}${unsplashSearch}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&page=${page}`);
    const data = await response.json();
    setFetchedData([ ...data.results]);
  }
  return { fetchedData,getSearchData };
}

export default useFetch;