import { ArticleCard } from "@/components"
import { UserBookmarkProps } from "@/types"
const sampleFeed = {
  id: "ppppppp",
  title: "How to get away with murder",
  subtitle: "Series Movie",
  cover_image: 'https://images.unsplash.com/photo-1549633030-89d0743bad01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTM5NjF8MHwxfHNlYXJjaHw0fHxJbnNwaXJhdGlvbnxlbnwwfHx8fDE2ODY3MzQ1NTh8MA&ixlib=rb-4.0.3&q=80&w=1080',
  content: "lorem isupum Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus excepturi vel omnis exercitationem dolore doloremque ut quis ipsa rem accusamus blanditiis, similique quasi ea quos deserunt architecto? Fuga, illo accusamus.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus excepturi vel omnis exercitationem dolore doloremque ut quis ipsa rem accusamus blanditiis, similique quasi ea quos deserunt architecto? Fuga, illo accusamus.",
  created_at: "",
  topics: ["Javascript"],
  is_published: true,
  views_count: 2,
  bookmarked_by: [{ id: "1ew828hndnfed83", username:"sarah",profile_image: "/images/icons8-user.svg"   }],
  liked_by: [{ id: "1ew828hndnfed83" ,username:"sarah", profile_image:  "/images/icons8-user.svg"}],
  comments: [{ id: "112345678hhgddgvd", profile_image: "/images/icons8-user.svg", username: "sis", comment: "how are you",  }],
  author: {
    username: "mina",
    id: "hjKO876ESXCVBNMPOIUYTREWAS",
    profile_image: "/images/icons8-user.svg"
  },
  reading_time: 5

}
const updateFunc = (id: string, ) => {

}


describe('ArticleCard.cy.tsx', () => {
  it('renders the ArticleCard component', () => {

    cy.mount(<ArticleCard feed={sampleFeed} update={updateFunc} />)
    cy.get("button").contains("1")
  })
})

