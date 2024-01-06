import usersData from '../../fixtures/users.json'
import tasksData from '../../fixtures/tasks/put.json'

describe('PUT /tasks/:id', () => {

    it('update task to done', () => {
        // Data Test
        const loginUserData = {
            email: usersData.tasks.put.email,
            password: usersData.tasks.put.password
        }

        cy.task('deleteTask', tasksData.uniqueTask.name, usersData.tasks.put.email)
        cy.task('deleteUser', usersData.tasks.put.email)
        cy.postUser(usersData.tasks.put)
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
                        cy.putTaskId(respSession.body.token, respPostTask.body._id)
                            .then(respPut => {
                                expect(respPut.status).to.eq(204)
                                cy.getTaskId(respSession.body.token, respPostTask.body._id)
                                    .then(response => {
                                        expect(response.status).to.eq(200)
                                        expect(response.body.name).to.eq(tasksData.uniqueTask.name)
                                        expect(response.body.is_done).to.eq(true)
                                        expect(response.body.user).to.eq(respSession.body.user._id)
                                    })
                            })
                    })
            })
    })

    it('task not found', () => {
        // Data Test
        const loginUserData = {
            email: usersData.tasks.putNotFound.email,
            password: usersData.tasks.putNotFound.password
        }

        cy.task('deleteTask', tasksData.not_found.name, usersData.tasks.putNotFound.email)
        cy.task('deleteUser', usersData.tasks.putNotFound.email)
        cy.postUser(usersData.tasks.putNotFound)
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
                        cy.putTaskId(respSession.body.token, respPostTask.body._id)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })
    })
})