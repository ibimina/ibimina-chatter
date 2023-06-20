import { ArticleCard } from "@/components"
import { UserBookmarkProps } from "@/types"
const sampleFeed = {
  id: "ppppppp",
  title: "How to get away with murder",
  subtitle: "Series Movie",
  coverImageUrl: 'https://images.unsplash.com/photo-1549633030-89d0743bad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTM5NjF8MHwxfHNlYXJjaHw0fHxJbnNwaXJhdGlvbnxlbnwwfHx8fDE2ODY3MzQ1NTh8MA&ixlib=rb-4.0.3&q=80&w=1080',
  article: "lorem isupum Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus excepturi vel omnis exercitationem dolore doloremque ut quis ipsa rem accusamus blanditiis, similique quasi ea quos deserunt architecto? Fuga, illo accusamus.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus excepturi vel omnis exercitationem dolore doloremque ut quis ipsa rem accusamus blanditiis, similique quasi ea quos deserunt architecto? Fuga, illo accusamus.",
  createdat: "",
  topics: ["Javascript"],
  published: true,
  likes: [],
  views: 2,
  bookmarks: [{ user_uid: "1ew828hndnfed83" }],
  comments: [{ uid: "112345678hhgddgvd", image: "/images/icons8-user.svg", name: "sis", comment: "how are you", timestamp: "" }],
  author: {
    name: "mina",
    uid: "hjKO876ESXCVBNMPOIUYTREWAS",
    image: "/images/icons8-user.svg"
  },
  timestamp: "20002",
  readingTime: 5

}
const updateFunc = (id: string, bookmark: UserBookmarkProps[]) => {

}


describe('ArticleCard.cy.tsx', () => {
  it('renders the ArticleCard component', () => {

    cy.mount(<ArticleCard feed={sampleFeed} update={updateFunc} />)
    cy.get("button").contains("1")
  })
})

