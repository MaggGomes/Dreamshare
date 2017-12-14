describe('Dream Share', function () {
	context('User', function () {
		context('Register', function () {
			it('Success', function () {
				let name = Math.random().toString(36).substr(2, 9);
				let password = Math.random().toString(36).substr(2, 9);

				cy.visit('/');

				cy.get('#nav-register').click();

				cy.get('#register-name').type(name);
				cy.get('#register-email').type(name + '@mail.com');
				cy.get('#register-password').type(password);
				cy.get('#register-confirmpassword').type(password);

				cy.get('#register-submit').click();
				cy.get('#modal-message-register').should('be.empty');
				cy.get('#authentication').should('not.be.visible');
			});

			it('Invalid name', function () {
				let name = Math.random().toString(36).substr(2, 9);
				let password = Math.random().toString(36).substr(2, 9);
				let chars = ['#', ';', '>', '<', '!', '-', '=', '?', '*'];

				cy.visit('/');

				cy.get('#nav-register').click();

				cy.get('#register-email').type(name + '@mail.com');
				cy.get('#register-password').type(password);
				cy.get('#register-confirmpassword').type(password);

				for (var i = 0; i < chars.length; i++) {
					cy.get('#register-name').clear().type(name + chars[i]);
					cy.get('#register-submit').click();
					cy.get('#modal-message-register').contains('Nome inválido. Carateres especiais como # ; > < ! - = ? * não são permitidos.');
					cy.get('#authentication').should('be.visible');
				}
			});

			it('Invalid email', function () {
				let name = Math.random().toString(36).substr(2, 9);
				let password = Math.random().toString(36).substr(2, 9);
				let invalid = [name + '@mai@l.com',
					name + '@mail.co#m',
					name + '@mail.c',
					name + '@' + 'abc@mail.com',
					name + ';' + 'abc@mail.com',
					name + ':' + 'abc@mail.com',
					name + '/' + 'abc@mail.com'];

				cy.visit('/');

				cy.get('#nav-register').click();

				cy.get('#register-name').type(name);
				cy.get('#register-password').type(password);
				cy.get('#register-confirmpassword').type(password);

				for (var i = 0; i < invalid.length; i++) {
					cy.get('#register-email').clear().type(invalid[i]);
					cy.get('#register-submit').click();
					cy.get('#modal-message-register').contains('Endereço de e-mail inválido.');
					cy.get('#authentication').should('be.visible');
				}
			});

			it('Invalid password', function () {
				let name = Math.random().toString(36).substr(2, 9);
				let password = Math.random().toString(36).substr(2, 9);

				cy.visit('/');

				cy.get('#nav-register').click();

				cy.get('#register-name').type(name);
				cy.get('#register-email').type(name + '@mail.com');

				for (var i = 1; i < 4; i++) {
					cy.get('#register-password').type(password.substr(0, i));
					cy.get('#register-confirmpassword').type(password.substr(0, i));
					cy.get('#register-submit').click();
					cy.get('#modal-message-register').contains('Palavra-passe deve ter pelo menos 6 carateres.');
					cy.get('#authentication').should('be.visible');
				}
			});

			it('Passwords don\'t match', function () {
				let name = Math.random().toString(36).substr(2, 9);
				let password = Math.random().toString(36).substr(2, 9);

				cy.visit('/');

				cy.get('#nav-register').click();

				cy.get('#register-name').type(name);
				cy.get('#register-email').type(name + '@mail.com');
				cy.get('#register-password').type(password);
				cy.get('#register-confirmpassword').type(password + 'a');

				cy.get('#register-submit').click();
				cy.get('#modal-message-register').contains('Palavras-passe não coincidem.');
				cy.get('#authentication').should('be.visible');

				cy.get('#register-password').clear().type(password);
				cy.get('#register-confirmpassword').clear().type(password.toUpperCase());

				cy.get('#register-submit').click();
				cy.get('#modal-message-register').contains('Palavras-passe não coincidem.');
				cy.get('#authentication').should('be.visible');
			});

			it('E-mail in use', function () {
				let name = Math.random().toString(36).substr(2, 9);
				let password = Math.random().toString(36).substr(2, 9);

				cy.visit('/');

				cy.get('#nav-register').click();

				cy.get('#register-name').type(name);
				cy.get('#register-email').type('b@mail.com');
				cy.get('#register-password').type(password);
				cy.get('#register-confirmpassword').type(password);

				cy.get('#register-submit').click();
				cy.get('#modal-message-register').contains('E-mail já se encontra em uso.');
				cy.get('#authentication').should('be.visible');
			});
		});
		
		context('Login', function () {
			it('Success', function () {
				let email = 'bs@mail.com';
				let password = 'abc123';

				cy.visit('/');

				cy.get('#nav-signin').click();
				cy.get('.btn-login').click();

				cy.get('#signin-email').type(email);
				cy.get('#signin-password').type(password);

				cy.get('#signin-submit').click();
				cy.get('#modal-message-login').should('be.empty');
				cy.get('#authentication').should('not.be.visible');

				cy.getCookie('user').should('exist');
			});

			it('Wrong email', function () {
				let email = 'b@mail.c';
				let password = 'abc123';

				cy.visit('/');

				cy.get('#nav-signin').click();
				cy.get('.btn-login').click();

				cy.get('#signin-email').type(email);
				cy.get('#signin-password').type(password);

				cy.get('#signin-submit').click();
				cy.get('#modal-message-login').contains('E-mail e/ou palavra-passe incorretos.');
				cy.get('#authentication').should('be.visible');

				cy.getCookie('user').should('not.exist');
			});

			it('Wrong password', function () {
				let email = 'bs@mail.com';
				let password = 'abc1234';

				cy.visit('/');

				cy.get('#nav-signin').click();
				cy.get('.btn-login').click();

				cy.get('#signin-email').type(email);
				cy.get('#signin-password').type(password);

				cy.get('#signin-submit').click();
				cy.get('#modal-message-login').contains('E-mail e/ou palavra-passe incorretos.');
				cy.get('#authentication').should('be.visible');

				cy.getCookie('user').should('not.exist');
			});
			
			it('Logout', function () {
				cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
				cy.visit('/');
				cy.getCookie('user').should('exist');
				cy.get('#nav-logout').click();
				cy.getCookie('user').should('not.exist');
			});
		});
		
		context('Other user actions', function () {
			it('Make donation', function() {
				cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
				cy.visit('/campaigns/5a1e1b6618d55560b7db27a7');
				cy.getCookie('user').should('exist');
				cy.get('.lead-progress').then(($donated) => {
					const previousValue = $donated.text().replace('€', '');
					cy.get('.contribute-value').type('3.1');
					cy.get('.find-btn').contains('Contribuir').click();
					cy.get('.lead-progress').then(($donated) => {
						const currentValue = $donated.text().replace('€', '');
						expect(parseFloat(currentValue)).to.eq(parseFloat(previousValue)+3.1);
					});
				});
			});
			
			it('Make comment', function() {
				const time = Date.now();
				cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
				cy.visit('/campaigns/5a1e1b6618d55560b7db27a7');
				cy.getCookie('user').should('exist');
				cy.get('.campaign-nav-tabs a[href="#comments"]').click();
				cy.get('button[href="#commentArea"]').click();
				cy.get('#commentArea textarea').should('be.visible').type(time);
				cy.get('#commentArea button').contains('Comentar').click();
				
				cy.get('.campaign-nav-tabs a[href="#comments"]').click();
				cy.get('.comment-container .comment-text').contains(time).should('exist');
			});
			
			it('Make reply', function() {
				const time = Date.now();
				cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
				cy.visit('/campaigns/5a1e1b6618d55560b7db27a7');
				cy.getCookie('user').should('exist');
				cy.get('.campaign-nav-tabs a[href="#comments"]').click();
				cy.get('a').contains('Responder').click().then(($reply) => {
					const id = $reply.attr('href');
					cy.get(id + ' textarea').should('be.visible').type(time);
					cy.get(id + ' button').contains('Responder').click();
					
					cy.get('.campaign-nav-tabs a[href="#comments"]').click();
					cy.get('.reply-container .reply-text').contains(time).should('exist');
				});
			});
			
			it('Make report', function() {
				cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
				cy.visit('/campaigns/5a1e1b6618d55560b7db27a7');
				cy.getCookie('user').should('exist');
				cy.get('.campaign-options a[data-target="#reportCampaignModal"]').click();
				cy.get('#reportCampaignModal').should('be.visible');
				cy.get('#reportBtn').click();
			});
		
			// Edit/delete comment & reply
			
			// Create campaign
			
			// Edit campaign
		});
	});

	context('Campaign', function() {
		it('Create campaign', function() {

		});

		it('Access campaign page', function() {

		});

		it('Owner can edit campaign', function() {

		});

		it('Other users can\'t edit campaign', function() {

		});

		it('Comment on campaign', function() {

		});

		it('Report campaign', function() {

		});

		it('See list of campaigns', function() {

		});

		it('See list of trending campaigns', function() {

		});

		it('Search for campaign', function() {

		});
	});
});
