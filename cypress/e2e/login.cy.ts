describe('template spec', () => {
  it('passes', () => {
    //visit ibimina chatter login page
    //login


    cy.visit("https://ibimina-chatter.vercel.app")
    cy.get('input[name="email"]').type("kiT@gmail.com")
    cy.get('input[name="password"]').type("kingT1234567")
    cy.get('input[type="submit"]').click()
    //await for the next page to load
    cy.wait(2000)

    //check that the next page url includes /chatter after clicking the next link
    cy.url().should('include', '/chatter')
    //check that the nextpage contains a h1 tag with text Inkspire
    cy.get('h1').contains('InkSpire')

    // post a message
    cy.get('a').contains('write').click()
    cy.get('textarea[name="title"]').type("Testing app with cypress login e2e")
    cy.get('textarea[name="subtitle"]').type("E2e application testing")
    cy.get('textarea[name="article"]').type("When you configure Cypress to record tests to Cypress Cloud, you'll see data from your latest recorded runs in the Cypress app. This increased visibility into your test history allows you to debug your tests faster and more effectively, all within your local workflow.")

    cy.get('button').contains('Publish').click()

    //add a tag
    cy.get('input[name="tags"]').type("Test")
    cy.get('button[type="submit"]').contains('Add').click()
    cy.get('button').contains('Publish now').click()
    // check that the message is posted after two seconds
    cy.wait(9000)
    cy.url().should('include', '/article')
    cy.get('div').contains("When you configure Cypress to record tests to Cypress Cloud, you'll see data from your latest recorded runs in the Cypress app. This increased visibility into your test history allows you to debug your tests faster and more effectively, all within your local workflow.")
    cy.get('a').contains('InkSpire').click()
    cy.url().should('include', '/chatter')

    // logout
    // click a li that contains an image with alt user
    // cy.get('li').contains('img', 'user').click()
    cy.get('li')
        .find('img[alt="user"]')
        .closest('li')
        .click();

    cy.wait(3000)
    // click the logout button
    cy.get('button').contains('Logout').click()
    // url should be the base url which is the login page
    cy.url().should('eq', 'https://ibimina-chatter.vercel.app/')


  })
})
