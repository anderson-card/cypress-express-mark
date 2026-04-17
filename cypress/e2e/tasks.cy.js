/// <reference types="cypress" />

describe('Tarefas', () => {

    let testData;

    before(()=> {
        cy.fixture('tasks').then(t => {
            testData = t
        })
    })

    beforeEach(() => {
        cy.viewport(1920, 1080)
    })

    context('Cadastro', () => {
        it('Deve cadastrar uma nova tarefa', () => {

        const taskName = 'Ler um livro de Node.js'
        
        cy.removeTaskByName(taskName)

        cy.createTask(taskName)

        cy.contains('main div p', taskName)
            .should('be.visible')
        })


       /* const tasks = [
            'Jogar Playstation',
            'Estudar programação',
            'Bla bla bla'
            ]

        tasks.forEach(taskName => {
        it(`Deve cadastrar a tarefa: ${taskName}`, () => {

        cy.removeTaskByName(taskName)
        cy.createTask(taskName)

        cy.contains('main div p', taskName)
                .should('be.visible')
            })
        })*/

        it('Não deve permitir tarefa duplicada', () => {

        const task = testData.dup

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
     context('Atualização', () => {
            it('Deve concluir uma tarefa', () => {
            const task={
                name: 'Estudar Javascript',
                is_done: false}
        
            cy.removeTaskByName(task.name)
            cy.postTask(task)

            cy.visit('/')

            cy.contains('p', task.name)
                .parent()
                .find('button[class*=ItemToggle]')
                .click()

            cy.contains('p', task.name)
                .should('have.css', 'text-decoration-line', 'line-through') 
            })
        })

    context('Exclusão', () => {
            it('Deve remover uma tarefa', () => {
            const task={
                name: 'Ler um livro de Node.js',
                is_done: false}
        
            cy.removeTaskByName(task.name)
            cy.postTask(task)

            cy.visit('/')

            cy.contains('p', task.name)
                .parent()
                .find('button[class*=ItemDelete]')
                .click()

            cy.contains('p', task.name)
                .should('not.exist')
            })
        })
})