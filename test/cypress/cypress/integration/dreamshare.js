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
				cy.get('#register').should('not.be.visible');
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
					cy.get('#register').should('be.visible');
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
					cy.get('#register').should('be.visible');
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
					cy.get('#register').should('be.visible');
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
				cy.get('#register').should('be.visible');

				cy.get('#register-password').clear().type(password);
				cy.get('#register-confirmpassword').clear().type(password.toUpperCase());

				cy.get('#register-submit').click();
				cy.get('#modal-message-register').contains('Palavras-passe não coincidem.');
				cy.get('#register').should('be.visible');
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
				cy.get('#register').should('be.visible');
			});
		});

		context('Login', function () {
			it('Success', function () {
				let email = 'bs@mail.com';
				let password = 'abc123';

				cy.visit('/');

				cy.get('#nav-signin').click();
				cy.get('.btn-signin').click();

				cy.get('#signin-email').type(email);
				cy.get('#signin-password').type(password);

				cy.get('#signin-submit').click();
				cy.get('#modal-message-register').should('be.empty');
				cy.get('#login').should('not.be.visible');

				cy.getCookie('user').should('exist');
			});

			it('Wrong email', function () {
				let email = 'b@mail.c';
				let password = 'abc123';

				cy.visit('/');

				cy.get('#nav-signin').click();
				cy.get('.btn-signin').click();

				cy.get('#signin-email').type(email);
				cy.get('#signin-password').type(password);

				cy.get('#signin-submit').click();
				cy.get('#modal-message-login').contains('E-mail e/ou palavra-passe incorretos.');
				cy.get('#login').should('be.visible');

				cy.getCookie('user').should('not.exist');
			});

			it('Wrong password', function () {
				let email = 'bs@mail.com';
				let password = 'abc1234';

				cy.visit('/');

				cy.get('#nav-signin').click();
				cy.get('.btn-signin').click();

				cy.get('#signin-email').type(email);
				cy.get('#signin-password').type(password);

				cy.get('#signin-submit').click();
				cy.get('#modal-message-login').contains('E-mail e/ou palavra-passe incorretos.');
				cy.get('#login').should('be.visible');

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

		/*
		context('Other user actions', function() {
			it('See own profile', function() {
			})
			
			it('See other profiles', function() {
			})
			
			it('Make donation', function() {
				cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'})								
				cy.visit('/campaigns/59e62f37af7a9c1c1d123196')
				cy.getCookie('user').should('exist')
				
				let initial = Cypress.$('#progress-value')//.text().slice(0, -1)
				console.log(initial.text())
				
				cy.get('.contribute-value').type('1')
				cy.get('button[type="submit"]').contains('Contribuir').click()
				cy.get('#progress-value').should('contain', initial+1+"€")
			})
		})
		*/
	});

	/*
	context('Campaign', function() {
		it('Create campaign', function() {
			
		})
		
		it('Access campaign page', function() {
			
		})
		
		it('Owner can edit campaign', function() {
			
		})
		
		it('Other users can\'t edit campaign', function() {
			
		})
		
		it('Comment on campaign', function() {
			
		})
		
		it('Report campaign', function() {
			
		})
		
		it('See list of campaigns', function() {
			
		})
		
		it('See list of trending campaigns', function() {
			
		})
		
		it('Search for campaign', function() {
			
		})
	})
	*/
});
