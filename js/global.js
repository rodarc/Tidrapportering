var windowSize = {
	width: 0,
	height: 0
},
loggedIn = true;

$(document).ready(function() {
	/*$('body').append('<div class="lightbox"></div>');*/
	getWindowSize();
	/*start();*/
	adjustLightbox();
	$('#login').on('click', function(e){
		e.preventDefault();
		login($(this));
	});
	$('.formSubmit').on('click', function(e){
		e.preventDefault();
		sendForm($(this));
	});
	$(window).resize(onResize);
});

function onResize(){
	getWindowSize();
	adjustLightbox();
}

function getWindowSize() {
	$window = $(window);
	windowSize.width = $window.width();
	windowSize.height = $window.height();
}

function start() {
	if(!loggedIn) {
		loadLogin();
	}
}

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
};

function sendForm(element) {
	var form = element.parent(),
		formAction = form.attr('action'),
		inputFields = form.find('input');
	
	var parameters = {};

	$.each(inputFields, function(){
		input = $(this);
		if (input.attr('type') != 'submit') {
			var inputName = input.attr('name'),
				inputValue = input.val();

			parameters[inputName] = inputValue;
		}
	});
	console.log(parameters);
	$.post('http://Tidrapportering/'+ formAction, parameters, function(data){
		// Göra något
	}, 'json')
}

function loadLogin() {
	$('.lightbox').load('login.html', function(){
		$('#login').on('click', function(e){
			e.preventDefault();
			login($(this));
		});
		adjustLightbox();
	});
}

function login(element) {
	var form = element.parent(),
		formAction = form.attr('action'),
		username = $('#username').val(),
		password = $('#password').val(),
		validEmail = isValidEmailAddress(username);

	if(validEmail) {
		var parameters = {
			'username' : username,
			'password' : password
		};

		$.post('http://tidrapportering/'+ formAction, parameters, function(data){
			if(data.status) {
				loggedIn = true;
				window.location('http://tidrapportering/project.html');
			} else {
				form.find('.error').remove();
				form.children().prepend('<p class="error">Fel användarnamn och/eller lösenord</p>');
			}
		}, 'json')
	} else {
		form.find('.error').remove();
		form.children().prepend('<p class="error">Fel användarnamn och/eller lösenord</p>');
	}
}

function adjustLightbox() {
	var lightbox = $('.lightbox'),
		contentDiv = lightbox.children('div'),
		contentDivWidth = contentDiv.width(),
		contentDivHeight = contentDiv.height(),
		contentDivLeft = windowSize.width / 2 - contentDivWidth / 2,
		contentDivTop = windowSize.height / 2 - contentDivHeight / 2,
		documentHeight = $(document).height();

	lightbox.show();

	if(contentDivHeight > windowSize.height) {
		contentDivTop = 100;
	};

	contentDiv.css({
		'margin-left' : contentDivLeft+'px',
		'margin-top' : contentDivTop+'px'
	});
	
	lightbox.height(documentHeight);
}