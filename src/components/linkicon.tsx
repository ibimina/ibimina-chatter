import Link from "next/link";
import Image from "next/image";

function LinkIcon({ src, alt, href }: { src: string, alt: string, href: string }) {
    return (
        <>
            {
                href?.length > 0 &&
                < Link href={href} >
                    <Image src={src} height={24} width={24} alt={alt} />
                </Link >
            }
      </>
    )
}

export default LinkIcon;
