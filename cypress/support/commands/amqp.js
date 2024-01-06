Cypress.Commands.add('purgeQueueMessages', ()=> {

    cy.api({
      url: Cypress.env('amqpHost') + '/tasks/contents',
      method: 'DELETE',
      headers: {
        'Authorization': Cypress.env('amqpToken')
      },
      body: {
        'vhost': 'zjfvltrn',
          'name': Cypress.env('amqpQueue'),
          'mode': 'purge'
      },
      failOnStatusCode: false
    }).then((response)=> {
      return response
    })
  })
  
  Cypress.Commands.add('getMessageQueue', ()=> {
  
    cy.api({
      url: Cypress.env('amqpHost') + '/tasks/get',
      method: 'POST',
      headers: {
        'Authorization': Cypress.env('amqpToken')
      },
      body: {
        'vhost': 'zjfvltrn',
        'name': Cypress.env('amqpQueue'),
        'truncate': '50000',
        'ackmode': 'ack_requeue_true',
        'encoding': 'auto',
        'count': '1'
      },
      failOnStatusCode: false
    }).then((response)=> {
      return response
    })
  })