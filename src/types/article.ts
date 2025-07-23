export interface ArticleProps {
    id: string,
    title: string,
    subtitle: string,
    cover_image: string,
    content: string,
    topics: string[],
    is_published: boolean,
    views_count: number,
    bookmarked_by:  {
        username: string,
        id: string,
        profile_image: string
    }[],
      liked_by:{
        username: string,
        id: string,
        profile_image: string
    }[],
    comments: { id: string, profile_image: string, username: string, comment: string }[],
    author: {
        username: string,
        id: string,
        profile_image: string
    },
    reading_time: number
    created_at: string
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
    timestamp: string[]
}