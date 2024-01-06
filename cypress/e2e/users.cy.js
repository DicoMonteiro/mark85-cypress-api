import usersData from '../fixtures/users.json'

describe('POST /users', ()=> {

  it('register a new user', ()=> {

    // Execution Test
    //cy.log(JSON.stringify(usersData.usersSignup[0]))
    cy.task('deleteUser', usersData.usersSignup[0].email)
    cy.postUser(usersData.usersSignup[0])
      .then(response => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property("_id")
        expect(response.body._id).not.to.be.empty
      })
  })

  it('register duplicated', ()=> {

    const message = "Duplicated email!"

    // Execution Test
    cy.task('deleteUser', usersData.usersSignup[1].email)
    cy.postUser(usersData.usersSignup[1])
    cy.postUser(usersData.usersSignup[1])
      .then(response => {
        expect(response.status).to.eq(409)
        //expect(response.body).to.have.property("message", "Duplicated email!")
        expect(response.body.message).to.eq(message)
      })

  })

  context('required fields', ()=> {
    let user;
    
    beforeEach(()=> {
      user = {
       name: usersData.usersSignup[2].name,
       email: usersData.usersSignup[2].email,
       password: usersData.usersSignup[2].password
      }
    })

    it('name is required', ()=> {

      delete user.name

      cy.postUser(user)
        .then(response => {
          expect(response.status).to.eq(400)
          expect(response.body.message).to.eq('ValidationError: \"name\" is required')
      })
    })

    it('email is required', ()=> {

      delete user.email
      
      cy.postUser(user)
        .then(response => {
          expect(response.status).to.eq(400)
          expect(response.body.message).to.eq('ValidationError: \"email\" is required')
      })
    })

    it('password is required', ()=> {

      delete user.password
      
      cy.postUser(user)
        .then(response => {
          expect(response.status).to.eq(400)
          expect(response.body.message).to.eq('ValidationError: \"password\" is required')
      })
    })
  })
})