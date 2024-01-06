import usersData from '../../fixtures/users.json'
import tasksData from '../../fixtures/tasks/get.json'

describe('GET /tasks', () => {

    it('list my tasks', () => {
        // Data Test
        const loginUserData = {
            email: usersData.tasks.get.email,
            password: usersData.tasks.get.password
        }

        cy.task('deleteTasksLike', 'Estud4r')
        cy.task('deleteUser', usersData.tasks.get.email)
        cy.postUser(usersData.tasks.get)
            .then(response => {
                expect(response.status).to.eq(201)
            })

        // Execution Test
        cy.postSessions(loginUserData)
            .then(resp => {
                expect(resp.status).to.eq(200)
                expect(resp.body.token).not.to.be.empty

                tasksData.list.forEach((t) => {
                    cy.postTasks(resp.body.token, t)
                })
                cy.getTasks(resp.body.token)
                    .then(response => {
                        expect(response.status).to.eq(200)
                        expect(response.body[0].name).to.eq(tasksData.list[0].name)
                        expect(response.body[0].tags).not.to.be.empty
                        expect(response.body[0].tags).to.eql(tasksData.list[0].tags)
                        expect(response.body[0].is_done).to.eq(false)
                        expect(response.body[0].user).to.eq(resp.body.user._id)
                        expect(response.body[1].name).to.eq(tasksData.list[1].name)
                        expect(response.body[1].tags).not.to.be.empty
                        expect(response.body[1].tags).to.eql(tasksData.list[1].tags)
                        expect(response.body[1].is_done).to.eq(false)
                        expect(response.body[1].user).to.eq(resp.body.user._id)
                        expect(response.body[2].name).to.eq(tasksData.list[2].name)
                        expect(response.body[2].tags).to.be.empty
                        expect(response.body[2].is_done).to.eq(false)
                        expect(response.body[2].user).to.eq(resp.body.user._id)
                    }).its('body')
                    .should('be.an', 'array')
                    .and('have.length', tasksData.list.length)
            })

    })
})

describe('GET /tasks/:id', () => {

    it('get unique task', () => {
        // Data Test
        const loginUserData = {
            email: usersData.tasks.getUnique.email,
            password: usersData.tasks.getUnique.password
        }

        cy.task('deleteTask', tasksData.unique.name, usersData.tasks.getUnique.email)
        cy.task('deleteUser', usersData.tasks.getUnique.email)
        cy.postUser(usersData.tasks.getUnique)
            .then(response => {
                expect(response.status).to.eq(201)
            })

        // Execution Test
        cy.postSessions(loginUserData)
            .then(respSession => {
                expect(respSession.status).to.eq(200)
                expect(respSession.body.token).not.to.be.empty

                cy.postTasks(respSession.body.token, tasksData.unique)
                    .then(respPostTask => {
                        cy.getTaskId(respSession.body.token, respPostTask.body._id)
                            .then(response => {
                                expect(response.status).to.eq(200)
                                expect(response.body.name).to.eq(tasksData.unique.name)
                                expect(response.body.tags).not.to.be.empty
                                expect(response.body.tags).to.eql(tasksData.unique.tags)
                                expect(response.body.is_done).to.eq(false)
                                expect(response.body.user).to.eq(respSession.body.user._id)
                            })
                    })
            })
    })

    it('task not found', () => {
        // Data Test
        const loginUserData = {
            email: usersData.tasks.getNotFound.email,
            password: usersData.tasks.getNotFound.password
        }

        cy.task('deleteTask', tasksData.not_found.name, usersData.tasks.getNotFound.email)
        cy.task('deleteUser', usersData.tasks.getNotFound.email)
        cy.postUser(usersData.tasks.getNotFound)
            .then(response => {
                expect(response.status).to.eq(201)
            })

        // Execution Test
        cy.postSessions(loginUserData)
            .then(respSession => {
                expect(respSession.status).to.eq(200)
                expect(respSession.body.token).not.to.be.empty

                cy.postTasks(respSession.body.token, tasksData.not_found)
                    .then(respPostTask => {
                        cy.deleteTaskId(respSession.body.token, respPostTask.body._id)
                            .then(response => {
                                expect(response.status).to.eq(204)
                            })
                        cy.getTaskId(respSession.body.token, respPostTask.body._id)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })
    })
})