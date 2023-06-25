import { formatDistanceStrict } from "date-fns";
import { useState, useEffect } from "react";

function useTime(timestamp: string) {
    const [published, setPublished] = useState<string | null>(null)
    useEffect(() => {
        const currentDate = new Date();
        const articleDate = new Date(timestamp);
        const timeDifference = currentDate.getTime() - articleDate.getTime();
        if (timeDifference > 86400000) {
            const formattedDate = articleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            setPublished(formattedDate)
        } else if (timeDifference < 86400000) {
            const formattedDate = formatDistanceStrict(articleDate, currentDate, { addSuffix: true });
            setPublished(formattedDate)

        } 
    }, [timestamp])
    return {published};
}

export default useTime;