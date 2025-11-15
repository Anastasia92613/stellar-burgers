describe('проверяем доступность приложения', function() {
    it('сервис должен быть доступен по адресу localhost:4000', function() {
        cy.visit('http://localhost:4000/'); 
    });
});

describe('проверяем страницу конструктора бургеров', function() {
    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', {
            fixture: 'ingredients.json'
        }).as('getIngredientsApi')
        cy.visit('http://localhost:4000/')
        cy.wait('@getIngredientsApi')

        cy.setCookie('accessToken', 'test-token');
        window.localStorage.setItem('accessToken', 'test-token');
        cy.intercept('GET', '/api/auth/user', {
            success: true,
            user: { name: 'Test', email: 'test@mail.ru' }
        });
    });

    it('проверяем, что ингредиентов добавляется в конструктор', () => {

        const addButton = cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').find('button');
        addButton.click();

        cy.get('[data-cy="constructor-bun-top"]').should('contain', 'Краторная булка N-200i');
        cy.get('[data-cy="constructor-bun-bottom"]').should('contain', 'Краторная булка N-200i');
    });

    it('проверяем открытие и закрытие модального окна ингредиента', () => {
        const ingredient = cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]');
        ingredient.click();
        cy.contains('Детали ингредиента').should('be.visible');

        const closeModal = cy.get('[data-cy="close-modal"]');
        closeModal.click();
        cy.contains('Детали ингредиента').should('not.exist');
    });

    it('проверяем создание заказа', () => {
        cy.intercept('POST', '/api/orders', {
        statusCode: 200,
            body: { 
                success: true, 
                order: { number: 12345 },
                name: 'Флюоресцентный бургер'
            }
        }).as('createOrder');

        const addButtonBun = cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').find('button');
        const addButtonMain = cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').find('button');
        addButtonBun.click();
        addButtonMain.click();

        const buttonOrder = cy.get('[data-cy="order"]').find('button');
        buttonOrder.click();
        const orderNumber = cy.get('[data-cy="order-number"]');

        orderNumber.should('be.visible');
        orderNumber.should('contain', '12345');

        const closeModal = cy.get('[data-cy="close-modal"]');
        closeModal.click();
        orderNumber.should('not.exist');

        const constructor = cy.get('[data-cy="constructor"]');

        constructor.should('contain', 'Выберите булки');
        constructor.should('contain', 'Выберите начинку')

    });
});
