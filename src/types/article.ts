export interface ArticleProps {
    id?: string,
    title: string,
    subtitle: string,
    coverImageUrl: string,
    article: string,
    createdat: string,
    topics: string[],
    published: boolean,
    likes: LikeProps[],
    views: number,
    bookmarks: UserBookmarkProps[],
    comments: CommentProps[],
    author: {
        name: string,
        uid: string,
        image: string
    },
    timestamp: string,
    readingTime:number
}

export interface CommentProps{
    name: string,
    uid: string,
    image: string,
    comment: string,
    timestamp: string,
}
export interface UserBookmarkProps {
    user_uid: string,
}

export interface BookmarkProps {
    article_uid: string,
}

export interface LikeProps {
    uid: string,
    image: string,
    name: string,
}