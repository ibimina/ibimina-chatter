import Image from "next/image";

function LinkIcon({ src, alt, href }: { src: string, alt: string, href: string }) {
    return (
        <>
            {
                href?.length > 0 &&
                < a href={href} target="_blank" >
                    <Image src={src} height={24} width={24} alt={alt} />
                </a >
            }
      </>
    )
}

export default LinkIcon;
