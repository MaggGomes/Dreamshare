describe('Dream Share', function () {
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
	
	context('Comment', function() {
		it('Make comment', function() {
			const comment = Math.random().toString(36).substr(2, 25);
			cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
			cy.visit('/campaigns/5a1e1b6618d55560b7db27a7');
			cy.getCookie('user').should('exist');
			cy.get('.campaign-nav-tabs a[href="#comments"]').click();
			cy.get('button[href="#commentArea"]').click();
			cy.get('#commentArea textarea').should('be.visible').type(comment);
			cy.get('#commentArea button').contains('Comentar').click();
			
			cy.get('.campaign-nav-tabs a[href="#comments"]').click();
			cy.get('.comment-container .comment-text').contains(comment).should('exist');
		});
		
		it('Edit comment', function() {
			const comment = Math.random().toString(36).substr(2, 25);
			const edited = Math.random().toString(36).substr(2, 25);
			cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
			cy.getCookie('user').should('exist');
			cy.request('POST', '/campaigns/5a1e1b6618d55560b7db27a7/comment', {comment: comment});
			cy.visit('/campaigns/5a1e1b6618d55560b7db27a7');
			cy.get('.campaign-nav-tabs a[href="#comments"]').click();
			cy.get('.comment-container .comment-text').contains(comment).should('exist').then(($comment) => {
				var $editButton = $comment.siblings('.edit-comment');
				cy.wrap($editButton).should('exist').click();
				cy.get('.comment-container .comment-text textarea').should('exist').type(edited).then(($input) => {
					var $saveButton = $input.parent('.comment-text').siblings('.save-comment');
					cy.wrap($saveButton).should('exist').click();
					cy.get('.comment-container .comment-text').contains(edited).should('exist');
				});
			});
		});

		it('Delete comment', function() {
			const comment = Math.random().toString(36).substr(2, 25);
			cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
			cy.getCookie('user').should('exist');
			cy.request('POST', '/campaigns/5a1e1b6618d55560b7db27a7/comment', {comment: comment});
			cy.visit('/campaigns/5a1e1b6618d55560b7db27a7');
			cy.get('.campaign-nav-tabs a[href="#comments"]').click();
			cy.get('.comment-container .comment-text').contains(comment).should('exist').then(($comment) => {
				var $deleteButton = $comment.siblings('.delete-comment');
				cy.wrap($deleteButton).should('exist').click();
				cy.get('.comment-container .comment-text').contains(comment).should('not.exist');
			});
		});
	});
	
	context('Reply', function() {
		it('Make reply', function() {
			const comment = Math.random().toString(36).substr(2, 25);
			cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
			cy.visit('/campaigns/5a1e1b6618d55560b7db27a7');
			cy.getCookie('user').should('exist');
			cy.get('.campaign-nav-tabs a[href="#comments"]').click();
			cy.get('a').contains('Responder').click().then(($reply) => {
				const id = $reply.attr('href');
				cy.get(id + ' textarea').should('be.visible').type(comment);
				cy.get(id + ' button').contains('Responder').click();
				
				cy.get('.campaign-nav-tabs a[href="#comments"]').click();
				cy.get('.reply-container .reply-text').contains(comment).should('exist');
			});
		});
		
		it('Edit reply', function() {
			const reply = Math.random().toString(36).substr(2, 25);
			const edited = Math.random().toString(36).substr(2, 25);
			cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
			cy.getCookie('user').should('exist');
			cy.request('POST', '/campaigns/5a1e1b6618d55560b7db27a7/5a2047d678d7c26a7929e976/reply', {reply: reply});
			cy.visit('/campaigns/5a1e1b6618d55560b7db27a7');
			cy.get('.campaign-nav-tabs a[href="#comments"]').click();
			cy.get('.comment-container[data-comment="5a2047d678d7c26a7929e976"] .reply-container .reply-text').contains(reply).should('exist').then(($reply) => {
				var $editButton = $reply.siblings('.edit-reply');
				cy.wrap($editButton).should('exist').click();
				cy.get('.comment-container[data-comment="5a2047d678d7c26a7929e976"] .reply-container .reply-text textarea').should('exist').type(edited).then(($input) => {
					var $saveButton = $input.parent('.reply-text').siblings('.save-reply');
					cy.wrap($saveButton).should('exist').click();
					cy.get('.comment-container[data-comment="5a2047d678d7c26a7929e976"] .reply-container .reply-text').contains(edited).should('exist');
				});
			});
		});

		it('Delete reply', function() {
			const reply = Math.random().toString(36).substr(2, 25);
			const edited = Math.random().toString(36).substr(2, 25);
			cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
			cy.getCookie('user').should('exist');
			cy.request('POST', '/campaigns/5a1e1b6618d55560b7db27a7/5a2047d678d7c26a7929e976/reply', {reply: reply});
			cy.visit('/campaigns/5a1e1b6618d55560b7db27a7');
			cy.get('.campaign-nav-tabs a[href="#comments"]').click();
			cy.get('.comment-container[data-comment="5a2047d678d7c26a7929e976"] .reply-container .reply-text').contains(reply).should('exist').then(($reply) => {
				var $deleteButton = $reply.siblings('.delete-reply');
				cy.wrap($deleteButton).should('exist').click();
				cy.get('.comment-container[data-comment="5a2047d678d7c26a7929e976"] .reply-container .reply-text').contains(reply).should('not.exist');
			});
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
		
		it('Make report', function() {
			cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
			cy.visit('/campaigns/5a1e1b6618d55560b7db27a7');
			cy.getCookie('user').should('exist');
			cy.get('.campaign-options a[data-target="#reportCampaignModal"]').click();
			cy.get('#reportCampaignModal').should('be.visible');
			cy.get('#reportBtn').click();
		});
	});

	context('Campaign', function() {
		/* Create campaign
		it('Create campaign', function() {
			cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
			cy.getCookie('user').should('exist');
			cy.visit('/campaigns/create');
			const title = Math.random().toString(36).substr(2, 25);
			const goal = 100;
			const description = Math.random().toString(36).substr(2, 50);
			const lat = 26.3659659;
			const lng = -81.7814952;
			const date = '2020-04-20';
			cy.fixture('image.jpg').as('image');
			cy.get('#profile-picture-upload').then(function ($input) {
				return Cypress.Blob.base64StringToBlob(this.image, 'image/jpeg').then(function (blob) {
					$input.fileupload('add', {files: blob});
					cy.get('button.enter-block').contains('Criar campanha').click();
				});	
			});
		});
		*/
		
		/* Edit campaign
		it('Edit campaign', function () {
			cy.request('POST', '/users/signin', {email: 'bs@mail.com', password: 'abc123'});
			const title = Math.random().toString(36).substr(2, 25);
			const goal = 100;
			const description = Math.random().toString(36).substr(2, 50);
			const lat = 26.3659659;
			const lng = -81.7814952;
			const date = '2020-04-20';
			cy.fixture('image.jpg').as('image');
			Cypress.Blob.base64StringToBlob(this.image, 'image/jpeg').then(function (blob) {
				cy.request('POST', '/campaigns/create', {title: title, goal: goal, description: description, lat: lat, lng: lng, endDate: date, imageFile: blob});
				console.log(title);
			});	
		});
		*/
	});
	
	context('Navigation', function() {
		it('Homepage campaigns', function() {
			cy.visit('/');
			cy.get('a.card-link').each(function ($el) {
				const link = $el.attr('href');
				const title = $el.find('.card-title').text();
				const text = $el.find('.card-text').text();
				cy.visit(link);
				cy.get('h1').then(($title) => {
					const campaignTitle = $title.text();
					cy.get('.campaign-description').then(($description) => {
						const campaignDescription = $description.text();
						expect(campaignTitle).to.eq(title);
						expect(campaignDescription).to.eq(text);
					});
				});
			});
		});
		
		it('Campaigns list', function() {
			cy.visit('/campaigns');
			cy.get('a.card-link').each(function ($el) {
				const link = $el.attr('href');
				const title = $el.find('.card-title').text();
				const text = $el.find('.card-text').text();
				cy.visit(link);
				cy.get('h1').then(($title) => {
					const campaignTitle = $title.text();
					cy.get('.campaign-description').then(($description) => {
						const campaignDescription = $description.text();
						expect(campaignTitle).to.eq(title);
						expect(campaignDescription).to.eq(text);
					});
				});
			});
		});
		
		it('Search', function() {
			cy.visit('/');
			cy.get('#search').click();
			cy.get('.expandsearch-input').type('test');
			cy.get('.card-search-results a').each(function ($el) {
				const link = $el.attr('href');
				const title = $el.find('.card-title').text();
				expect(title).to.contain('test');
				const text = $el.find('.card-text').text();
				cy.visit(link);
				cy.get('h1').then(($title) => {
					const campaignTitle = $title.text();
					cy.get('.campaign-description').then(($description) => {
						const campaignDescription = $description.text();
						expect(campaignTitle).to.eq(title);
						expect(campaignDescription).to.eq(text);
					});
				});
			});
		});
	});
});

