$(document).ready(function () {
	
	/* Modal components */

	/* Signin */
	$signin = '<div class="modal-body">'+
		'<div id="modal-message-signin"></div>'+
		'<div class="modal-social-icons">'+
		'<button class="btn btn-default facebook" id="facebook_login">'+
		'<i class="fa fa-facebook modal-icons"></i> Continuar com Facebook </button>'+
		'</div>'+
		'<div class="login-or">'+
		'<hr class="hr-or">'+
		'<span class="span-or">ou</span>'+
		'</div>'+
		'<h4 class="useemail">Ou use o seu endereço de e-mail</h4>'+
		'<button type="button" class="btn-bottom btn btn-primary btn-login">Entrar</button>'+
		'<button type="button" class="btn-bottom btn btn-secondary btn-register">'+
		'Inscreva-se </button>'+
		'</div>'+
		'<div class="modal-footer">'+
		'<button type="button" class="btn btn-info" data-dismiss="modal">Fechar</button>'+
		'</div>';

	/* Login */
	$login = '<div class="modal-body">'+
		'<div id="modal-message-login"></div>'+
		'<div class="form-group has-feedback">'+
		'<input id="signin-email" type="email" class="form-control" name="email" placeholder="Endereço de e-mail">'+
		'</div>'+
		'<div class="form-group has-feedback">'+
		'<input id="signin-password" type="password" class="form-control" name="password" placeholder="Palavra-passe">'+
		'</div>'+
		'<button id="signin-submit" class="btn btn-primary btn-submit-dialog">Entrar</button>'+
		'</div>'+
		'<div class="modal-footer">'+
		'<button type="button" class="btn btn-info" data-dismiss="modal">Fechar</button>'+
		'<button type="button" class="btn btn-secondary btn-register">Inscreva-se</button>'+
		'</div>';

	/* Register */
	$register = '<div class="modal-body">'+
		'<div id="modal-message-register"></div>'+
		'<div class="form-group">'+
		'<div class="form-group has-feedback input-group">'+
		'<input id="register-name" type="text" class="form-control" placeholder="Nome" name="name">'+
		'</div>'+
		'<div class="form-group has-feedback input-group">'+
		'<input id="register-email" type="email" class="form-control" placeholder="Endereço de e-mail" name="email">'+
		'</div>'+
		'<div class="form-group has-feedback input-group">'+
		'<input id="register-password" type="password" class="form-control" placeholder="Palavra-passe" name="password">'+
		'</div>'+
		'<div class="form-group has-feedback input-group">'+
		'<input id="register-confirmpassword" type="password" class="form-control" placeholder="Confirmar palavra-passe">'+
		'</div>'+
		'</div>'+
		'<button id="register-submit" class="btn btn-primary btn-submit-dialog">Registar</button>'+
		'</div>'+
		'<div class="modal-footer">'+
		'<button type="button" class="btn btn-info" data-dismiss="modal">Fechar</button>'+
		'</div>';


	$('.nav-signin').click(function () {
		$('#authentication .modal-body-footer').html($signin);
	});

	$('#nav-register').click(function () {
		$('#authentication .modal-body-footer').html($register);
	});

	/* Cleans modal inputs */
	$('.modal').on('hidden.bs.modal', function () {
		$('#authentication .modal-body-footer').html($signin);
	});

	$('.btn-login').click(function () {
		$('#authentication .modal-body-footer').html($login);
	});

	$('#authentication').on('click', '.btn-login', function() {
		$('#authentication .modal-body-footer').html($login);
	});

	$('.btn-register').click(function () {
		$('#authentication .modal-body-footer').html($register);
	});

	$('#authentication').on('click', '.btn-register', function() {
		$('#authentication .modal-body-footer').html($register);
	});

	var signin = function(){
		var userEmail = $('#signin-email').val();
		var userPassword = $('#signin-password').val();

		$.post('/users/signin', {email: userEmail, password: userPassword})
			.done(function () {
				location.reload();
			})
			.fail(function () {
				$('#modal-message-login').html('<div class="modal-message-content">E-mail e/ou palavra-passe incorretos.</div>');
			});
	};

	var register = function () {
		var userName = $('#register-name').val();
		var userEmail = $('#register-email').val();
		var userPassword = $('#register-password').val();
		var userConfirmPassword = $('#register-confirmpassword').val();

		if (!/^([A-Za-z0-9ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐð]*)(\s[A-Za-z0-9ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐð]*)*$/.test($('#register-name').val()) && /^\S/.test($('#register-name').val())) {
			$('#modal-message-register').html('<div class="modal-message-content">Nome inválido. Carateres especiais como # ; > < ! - = ? * não são permitidos.</div>');
			return;
		}

		if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($('#register-email').val())) {
			$('#modal-message-register').html('<div class="modal-message-content">Endereço de e-mail inválido.</div>');
			return;
		}

		if (userPassword.length < 6) {
			$('#modal-message-register').html('<div class="modal-message-content">Palavra-passe deve ter pelo menos 6 carateres.</div>');
			return;
		}

		if (userPassword != userConfirmPassword) {
			$('#modal-message-register').html('<div class="modal-message-content">Palavras-passe não coincidem.</div>');
			return;
		}

		$.post('/users/register', {name: userName, email: userEmail, password: userPassword})
			.done(function () {
				location.reload();
			})
			.fail(function () {
				$('#modal-message-register').html('<div class="modal-message-content" style="text-align: left">E-mail já se encontra em uso.</div>');
			});
	};

	/* Sign in */
	$('#signin-submit').click(function () {
		signin();
	});

	$('#authentication').on('click', '#signin-submit', function () {
		signin();
	});

	/* Register */
	$('#register-submit').click(function () {
		register();
	});

	$('#authentication').on('click', '#register-submit', function () {
		register();
	});

	/* Functions to work with menu search */
	(function (window) {
		'use strict';

		function classReg(className) {
			return new RegExp('(^|\\s+)' + className + '(\\s+|$)');
		}

		var hasClass, addClass, removeClass;

		if ('classList' in document.documentElement) {
			hasClass = function (elem, c) {
				return elem.classList.contains(c);
			};
			addClass = function (elem, c) {
				elem.classList.add(c);
			};
			removeClass = function (elem, c) {
				elem.classList.remove(c);
			};
		} else {
			hasClass = function (elem, c) {
				return classReg(c).test(elem.className);
			};
			addClass = function (elem, c) {
				if (!hasClass(elem, c)) {
					elem.className = elem.className + ' ' + c;
				}
			};
			removeClass = function (elem, c) {
				elem.className = elem.className.replace(classReg(c), ' ');
			};
		}

		function toggleClass(elem, c) {
			var fn = hasClass(elem, c) ? removeClass : addClass;
			fn(elem, c);
		}

		var classie = {
			// full names
			hasClass: hasClass,
			addClass: addClass,
			removeClass: removeClass,
			toggleClass: toggleClass,
			// short names
			has: hasClass,
			add: addClass,
			remove: removeClass,
			toggle: toggleClass
		};

		if (typeof define === 'function' && define.amd) {
			// AMD
			define(classie);
		} else {
			// browser global
			window.classie = classie;
		}

	})(window);

	/* Expand search */

	(function () {
		var expandSearch = document.getElementById('expandsearch'),
			input = expandSearch.querySelector('input.expandsearch-input'),
			ctrlClose = expandSearch.querySelector('span.expandsearch-close'),
			isOpen = isAnimating = false,

			toggleSearch = function (evt) {
				// return if open and the input gets focused
				if (evt.type.toLowerCase() === 'focus' && isOpen) return false;
				var offsets = expandSearch.getBoundingClientRect();
				if (isOpen) {
					classie.remove(expandSearch, 'open');
					$('.home-search').css({'display': 'none'});
					$('.expandsearch-content').html('');

					if (input.value !== '') {
						setTimeout(function () {
							classie.add(expandSearch, 'hideInput');
							setTimeout(function () {
								classie.remove(expandSearch, 'hideInput');
								input.value = '';
							}, 300);
						}, 500);
					}
					input.blur();
				} else {
					$('.home-search').css({'display': 'block'});
					classie.add(expandSearch, 'open');
				}
				isOpen = !isOpen;
			};
		// events
		$('#search').click(toggleSearch);

		input.addEventListener('focus', toggleSearch);
		ctrlClose.addEventListener('click', toggleSearch);
		// esc key closes search overlay
		// keyboard navigation events
		document.addEventListener('keydown', function (event) {
			var keyCode = event.keyCode || event.which;
			if (keyCode === 27 && isOpen) {
				toggleSearch(event);
			}
		});
	})();

	/* Facebook login */
	window.fbAsyncInit = function () {
		FB.init({
			appId: '1449290791833636',
			xfbml: true,
			version: 'v2.7'
		});

		FB.getLoginStatus(function (response) {
			if (response.status === 'connected') {
			} else if (response.status === 'not_authorized') {
			} else {
			}
		});

		FB.AppEvents.logPageView();
	};

	(function (d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id))
			return;

		js = d.createElement(s);
		js.id = id;
		js.src = '//connect.facebook.net/en_US/sdk.js';
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	$('#authentication').on('click', '#facebook_login', function () {
		$('#authentication').modal('hide');
		FB.login(function (response) {
			if (response.status === 'connected') {
				FB.api('/me', 'GET', {
					fields: 'name, email, picture.width(300).height(300)'
				}, function (data) {

					if(data.email == null)
						var email = data.id+'@facebook.com';
					else
						email = data.email;

					console.log(data);

					updateSession(data.name, email, data.picture.data.url);

					// TODO - REMOVER ESTAR PARTE DAQUI
					/*FB.logout(function(response) {
					// user is now logged out
					});*/

				});

			} else if (response.status === 'not_authorized') {
			} else {
			}
		}, {scope: 'email'});
	});

	$('#nav-logout').click(function(){
		/*FB.logout(function(response) {
		});*/
		console.log('dada');
		$.get('/users/logout', {})
			.done(function(){
				console.log('logged out');
			})
			.fail(function(){
				console.log('not logged out');
			});

	});
});

function updateSession(userName, userEmail, userPhoto) {
	$.post('/users/signin/3rdparty', {name: userName, email: userEmail, photo: userPhoto})
		.done(function(){
			location.reload();
		})
		.fail(function(){
		});
};

// TODO - IMPLEMENTAR
/*  Searchs a campaign by title */
function searchByTitle(value) {
	if (value.length >= 3) {
		$.get('/campaigns/searchByTitle', {
			title: value,
			limit: 2
		}, function (data) {
			var $results = $('<div></div>');

			$.each(data, function (i, campaign) {
				$results.append('<div class="row card-search-results">'+
					'<div class="col-12">'+
					'<a href="/campaigns/'+campaign._id+'">'+
					'<div class="card">'+
					'<div class="card-block">'+
					'<div class="row">' +
					'<div class="col-5 col-sm-5 col-md-4 col-lg-3 col-xl-2">'+
					'<img class="card-search-image" src="/'+
					campaign.image +'" alt="">'+
					'</div>'+
					'<div class="col-7 col-sm-7 col-md-8 col-lg-9 col-xl-10">' +
					'<h4 class="card-title">'+
					campaign.title+
					'</h4>'+
					'<p class="card-text">'+
					campaign.description+
					'</p>'+
					'</div>'+
					'</div>'+
					'</div>'+
					'</div>'+
					'</div>'+
					'</a>'+
					'</div>'+
					'</div>');
			});

			$('.expandsearch-content').html($results);
		});
	} else {
		$('.expandsearch-content').html('');
	}
};



