$(document).ready(function () {

    /* Cleans modal inputs */
    $('.modal').on('hidden.bs.modal', function () {
        $('#signin-email').val('');
        $('#signin-password').val('');
        $('#modal-message-login').html('');
    });

    $('.btn-signin').click(function () {
        $("#login").modal();
    });

    $('.btn-register').click(function () {
        $("#register").modal();
    });

    /* Sign in */
    $('#signin-submit').click(function () {
        console.log('dadsda');
        var userEmail = $('#signin-email').val();
        var userPassword = $('#signin-password').val();

        $.post("/users/signin", {
                email: userEmail,
                password: userPassword
            }, function (result) {

            if (result === '200') {
                location.reload();
            } else {
                $('#modal-message-login').html('<div class="modal-message-content">E-mail e/ou palavra-passe incorretos.</div>');
            }
        });
    });

    /* Register */
    $('#register-submit').click(function () {
        var userName = $('#register-name').val();
        var userEmail = $('#register-email').val();
        var userPassword = $('#register-password').val();
        var userConfirmPassword = $('#register-confirmpassword').val();

        if (!/^([A-Za-z0-9]*)$/.test($("#register-name").val()) && /^\S/.test($("#register-name").val())) {
            $('#modal-message-register').html('<div class="modal-message-content">Nome inválido. Carateres especiais como # ; > < ! - = ? * não são permitidos.</div>');
            return;
        }

        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#register-email").val())) {
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

        $.post("/users/register", {
                name: userName,
                email: userEmail,
                password: userPassword
            }, function (result) {
                if (result === '200')
                    location.reload();
                else
                    $('#modal-message-register').html('<div class="modal-message-content" style="text-align: left">E-mail já se encontra em uso.</div>');
            });
    });

    /* Real time countdown for the campaigns*/
// Set the date we're counting down to
    var countDownDate = new Date("Jan 5, 2018 15:37:25").getTime();

// Update the count down every 1 second
    var x = setInterval(function() {

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="time-left-counter"
        document.getElementById("time-left-counter").innerHTML = days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ";

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("time-left-counter").innerHTML = "EXPIRED";
        }
    }, 1000);

    /* Functions to work with menu search */
    (function (window) {
        'use strict';

        function classReg(className) {
            return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
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
});



