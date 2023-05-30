export interface ArticleProps {
    id?: string,
    title: string,
    subtitle: string,
    coverImageUrl: string,
    article: string,
    createdat: string,
    tags: string[],
    published: boolean,
    likes: number,
    views: number,
    bookmarks: number,
    comments: CommentProps[],
    author: {
        name: string,
        uid: string,
        image: string
    }
}

export interface CommentProps{
    name: string,
    uid: string,
    image: string,
    comment: string,
}
