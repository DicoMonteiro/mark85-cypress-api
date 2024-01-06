Cypress.Commands.add('postUser', (user)=> {
    cy.api({
        url: '/users',
        method: 'POST',
        body: user,
        failOnStatusCode: false
      }).then((response)=> {
        //expect(response.status).to.eq(200)
        //expect(response.body).to.have.property("_id")
        //cy.log(JSON.stringify(response.body))
        return response
    })
})

Cypress.Commands.add('postSessions', (user)=> {
  cy.api({
      url: '/sessions',
      method: 'POST',
      body: user,
      failOnStatusCode: false
    }).then((response)=> {
      //expect(response.status).to.eq(200)
      //expect(response.body).to.have.property("_id")
      //cy.log(JSON.stringify(response.body))
      return response
  })
})

Cypress.Commands.add('postTasks', (token, task)=> {
  //cy.log(token)
  //cy.log(task)
  cy.api({
      url: '/tasks',
      method: 'POST',
      headers: {
        'Authorization': token
      },
      body: task,
      failOnStatusCode: false
    }).then((response)=> {
      return response
  })
})

Cypress.Commands.add('getTasks', (token)=> {
  cy.api({
      url: '/tasks',
      method: 'GET',
      headers: {
        'Authorization': token
      },
      failOnStatusCode: false
    }).then((response)=> {
      return response
  })
})

Cypress.Commands.add('getTaskId', (token, taskId)=> {
  cy.api({
      url: '/tasks/' + taskId,
      method: 'GET',
      headers: {
        'Authorization': token
      },
      failOnStatusCode: false
    }).then((response)=> {
      return response
  })
})

Cypress.Commands.add('deleteTaskId', (token, taskId)=> {
  cy.api({
      url: '/tasks/' + taskId,
      method: 'DELETE',
      headers: {
        'Authorization': token
      },
      failOnStatusCode: false
    }).then((response)=> {
      return response
  })
})

Cypress.Commands.add('putTaskId', (token, taskId)=> {
  cy.api({
      url: '/tasks/' + taskId + '/done',
      method: 'PUT',
      headers: {
        'Authorization': token
      },
      failOnStatusCode: false
    }).then((response)=> {
      return response
  })
})
