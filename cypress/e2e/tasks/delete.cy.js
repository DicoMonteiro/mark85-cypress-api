import usersData from '../../fixtures/users.json'
import tasksData from '../../fixtures/tasks/delete.json'

describe('DELETE /tasks/:id', () => {

    it('delete unique task', () => {
        // Data Test
        const loginUserData = {
            email: usersData.tasks.delete.email,
            password: usersData.tasks.delete.password
        }

        cy.task('deleteTask', tasksData.uniqueTask.name, usersData.tasks.delete.email)
        cy.task('deleteUser', usersData.tasks.delete.email)
        cy.postUser(usersData.tasks.delete)
            .then(response => {
                expect(response.status).to.eq(201)
            })

        // Execution Test
        cy.postSessions(loginUserData)
            .then(respSession => {
                expect(respSession.status).to.eq(200)
                expect(respSession.body.token).not.to.be.empty

                cy.postTasks(respSession.body.token, tasksData.uniqueTask)
                    .then(respPostTask => {
                        cy.deleteTaskId(respSession.body.token, respPostTask.body._id)
                            .then(response => {
                                expect(response.status).to.eq(204)
                            })
                    })
            })
    })

    it('task not found', () => {
        // Data Test
        const loginUserData = {
            email: usersData.tasks.deleteNotFound.email,
            password: usersData.tasks.deleteNotFound.password
        }

        cy.task('deleteTask', tasksData.not_found.name, usersData.tasks.deleteNotFound.email)
        cy.task('deleteUser', usersData.tasks.deleteNotFound.email)
        cy.postUser(usersData.tasks.deleteNotFound)
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
                        cy.deleteTaskId(respSession.body.token, respPostTask.body._id)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })
    })
})