/// <reference types="cypress" />

describe('Tarefas', () => {

    context('Cadastro', () => {
        it('Deve cadastrar uma nova tarefa', () => {

        const taskName = 'Ler um livro de Node.js'
        
        cy.removeTaskByName(taskName)

        cy.createTask(taskName)

        cy.contains('main div p', taskName)
            .should('be.visible')
        })

        it('Não deve permitir tarefa duplicada', () => {

        const task = {
            name: 'Estudar Javascript',
            is_done: false
        }

        cy.removeTaskByName(task.name)
        cy.postTask(task)

        //Dado que eu tenha uma tarefa duplicada
        cy.createTask(task.name)

        //Quando eu faço o cadastro dessa tarefa
        cy.createTask(task.name)

        // Então vejo a mensagem de duplicidade
        cy.get('.swal2-html-container')
            .should('be.visible')
            .should('have.text', 'Task already exists!')
        })

        it('Campo obrigatório', () =>{
        cy.createTask()
        cy.isRequired('This is a required field')
       })

    })
})
