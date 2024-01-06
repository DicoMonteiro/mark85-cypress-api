import usersData from '../fixtures/users.json'

describe('POST /sessions', () => {

    before(() => {
        // Datas Test
        const userData = {
            name: usersData.sessions.name,
            email: usersData.sessions.email,
            password: usersData.sessions.password
        }

        // Execution Test
        cy.task('deleteUser', userData.email)
        cy.postUser(userData)
            .then(response => {
                expect(response.status).to.eq(201)
                expect(response.body).to.have.property("_id")
                expect(response.body._id).not.to.be.empty
            })
    })

    it('authentication successful', () => {
        // Datas Test
        const userData = {
            email: usersData.sessions.email,
            password: usersData.sessions.password
        }

        // Execution Test
        cy.postSessions(userData)
            .then(response => {
                expect(response.status).to.eq(200)
                expect(response.body.user.name).to.eq(usersData.sessions.name)
                expect(response.body.user.email).to.eq(usersData.sessions.email)
                expect(response.body).to.have.property("token")
                expect(response.body.token).not.to.be.empty
            })
    })

    it('password incorrect', () => {
        // Datas Test
        const userData = {
            email: usersData.sessions.email,
            password: usersData.sessions.inv_pass
        }

        // Execution Test
        cy.postSessions(userData)
            .then(response => {
                expect(response.status).to.eq(401)
            })
    })

    it('email incorrect', () => {
        // Datas Test
        const userData = {
            email: usersData.sessions.inv_email,
            password: usersData.sessions.password
        }

        // Execution Test
        cy.postSessions(userData)
            .then(response => {
                expect(response.status).to.eq(401)
            })
    })

    context('required fields', () => {
        let userData;

        beforeEach(() => {
            userData = {
                email: usersData.sessions.email,
                password: usersData.sessions.password
            }
        })

        it('email is required', () => {

            delete userData.email

            cy.postSessions(userData)
                .then(response => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.eq('ValidationError: \"email\" is required')
                })
        })

        it('password is required', () => {

            delete userData.password

            cy.postSessions(userData)
                .then(response => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.eq('ValidationError: \"password\" is required')
                })
        })
    })
})