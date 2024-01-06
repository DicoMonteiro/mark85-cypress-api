import usersData from '../../fixtures/users.json'
import tasksPostData from '../../fixtures/tasks/post.json'

describe('POST /tasks', () => {

    context('register a new task', () => {

        before(() => {
            //purge
            cy.purgeQueueMessages()
                .then(response => {
                    expect(response.status).to.eq(204)
                })
        })

        it('post task', () => {
            // Data Test
            const loginUserData = {
                email: usersData.tasks.post.email,
                password: usersData.tasks.post.password
            }

            cy.task('deleteTask', tasksPostData.post.newTask.name, usersData.tasks.post.email)
            cy.task('deleteUser', usersData.tasks.post.email)
            cy.postUser(usersData.tasks.post)
                .then(response => {
                    expect(response.status).to.eq(201)
                })

            // Execution Test
            cy.postSessions(loginUserData)
                .then(resp => {
                    expect(resp.status).to.eq(200)
                    expect(resp.body.token).not.to.be.empty
                    cy.postTasks(resp.body.token, tasksPostData.post.newTask)
                        .then(response => {
                            expect(response.status).to.eq(201)
                            expect(response.body.name).to.eq(tasksPostData.post.newTask.name)
                            expect(response.body.tags).to.eql(tasksPostData.post.newTask.tags)
                            expect(response.body.tags).not.to.be.empty
                            expect(response.body.is_done).to.be.false
                            expect(response.body.user).to.eq(resp.body.user._id)
                            expect(response.body._id.length).to.eq(24)
                        })
                })

        })

        after(() => {
            //get message
            cy.wait(3000)  // thinking time
            cy.getMessageQueue()
                .then(response => {
                    expect(response.status).to.eq(200)
                    cy.log(JSON.stringify(response.body))
                    //expect(response.body[0].payload).to.include(usersData.tasks.post.name.split(' ')[0])
                    //expect(response.body[0].payload).to.include(tasksPostData.post.newTask.name)
                    //expect(response.body[0].payload).to.include(usersData.tasks.post.email)
                })
        })

    })

    it('duplicated task', () => {
        // Data Test
        const loginUserData = {
            email: usersData.tasks.duplicate.email,
            password: usersData.tasks.duplicate.password
        }

        cy.task('deleteTask', tasksPostData.post.duplicate.name, usersData.tasks.duplicate.email)
        cy.task('deleteUser', usersData.tasks.duplicate.email)
        cy.postUser(usersData.tasks.duplicate)
            .then(response => {
                expect(response.status).to.eq(201)
            })

        // Execution Test
        cy.postSessions(loginUserData)
            .then(resp => {
                expect(resp.status).to.eq(200)
                expect(resp.body.token).not.to.be.empty
                cy.postTasks(resp.body.token, tasksPostData.post.duplicate)
                    .then(response => {
                        expect(response.status).to.eq(201)
                    })

                cy.postTasks(resp.body.token, tasksPostData.post.duplicate)
                    .then(response => {
                        expect(response.status).to.eq(409)
                        expect(response.body.message).to.eq("Duplicated task!")
                    })

            })

    })
})