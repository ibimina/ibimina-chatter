import { LinkIcon } from "@/components"
describe('LinkIcon.cy.tsx', () => {
  it('should render and display expected content', () => {
    cy.mount(<LinkIcon src="/images/icons8-twitter.svg" alt="twitter" href="https://twitter.com/ibiminaaH" />)
  cy.get('a').should('have.attr', 'href', 'https://twitter.com/ibiminaaH')
  cy.get('img').should('have.attr', 'src', '/images/icons8-twitter.svg')
  cy.get('img').should('have.attr', 'alt', 'twitter')
  })
})