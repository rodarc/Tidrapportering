var windowSize = {
	width: 0,
	height: 0
},
loggedIn = false,
hash;

$(document).ready(function() {
	$('.lightbox').hide();
	getWindowSize();
	hash = window.location.hash;
	if(hash) {
		var section = hash.split('/');
		loadSection(section[1]);
	}
	if(!hash) {
		start();
	}

	$(window).resize(onResize);
	$('#login').on('click', function(e){
		e.preventDefault();
		login($(this));
	});

	$('#logout').on('click', function(e){
		e.preventDefault();
		logOut();
	});

	$('.formSubmit').on('click', function(e){
		e.preventDefault();
		sendForm($(this));
	});

	$('input[name=passwordCheck]').focusout(function() {
		doesPasswordMatch($(this));
	});

	$('.menu').on('click', function(e){
		e.preventDefault();
		var link = $(this).attr('href');
		loadSection(link);
	});

	$('#content').on('click', '.addButton', function(e){
		e.preventDefault();
		var link = $(this).attr('href');
		loadSection(link);
	});

	$('.lightbox').on('click', 'input[value="Avbryt"]', function(){
		closePopup();
	});
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
	lightbox = $('.lightbox');
	if(!loggedIn) {
		lightbox.show();
		loadLogin();
		adjustLightbox();
	} else {
		lightbox.fadeOut(function() {
			lightbox.children('div').remove();
		});
		loadSection('project.html');
	}
}

function doesPasswordMatch(element) {
	var password = element.parent().find('input[name=password]').val(),
		matchingPassword = element.val();
	
	if(matchingPassword != password) {
		element.css('background', 'red');
	}
	if(matchingPassword == password) {
		element.css('background', 'green');
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
	$.post('http://Tidrapportering/'+ formAction, parameters, function(data){
		// Göra något
	}, 'json')
}

function loadLogin() {
	lightbox = $('.lightbox');
	if(lightbox.find('#login').length > 1) {
		adjustLightbox();
	} else {
		lightbox.load('popups/login.html', function() {
			adjustLightbox();
		});
	}
	$('#login').on('click', function(e) {
		e.preventDefault();
		login($(this));
	});
}

function loadSection(link) {
	var splitLink = link.split('/');
	if(splitLink[0] == 'popups') {
		loadPopup(splitLink[1]);
		adjustLightbox();
	} else {
		history.pushState(null, null, '#/'+link);
		$('#content').load(link, function(){
			$('.lightbox').fadeOut();
			$('.active').removeClass('active');
			$('a[href="'+ link +'"]').addClass('active');
			draw(30, 100);

		})
	}
}

function loadPopup(link) {
	$('.lightbox').load('popups/'+ link, function() {
		adjustLightbox();
	}).fadeIn();
}

function closePopup() {
	$('.lightbox').fadeOut().children('div').remove();
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
		$.post('http://tidrapportering.html/'+ formAction, parameters, function(data){
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
	loggedIn = true;
	start('project.html');
}

function logOut() {
	if(loggedIn = true){
		/*$.post('http://tidrapportering/logout.php', function(data){*/
			loggedIn = false;
			/*if(data.status) {*/
				/*Ändra till pop-up window så användaren inte blir re-directed till index.html, och måste gå tillbaka till den sida där denne blev utloggad ifrån*/
				loadLogin();
			/*}*/
		/*}, 'json')*/
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

	/*lightbox.show();*/

	if(contentDivHeight > windowSize.height) {
		contentDivTop = 100;
	};

	contentDiv.css({
		'margin-left' : contentDivLeft+'px',
		'margin-top' : contentDivTop+'px'
	});
	
	lightbox.height(documentHeight);
}

function draw(progress, total) {  
	var progressPercent = (total-progress);
 	var canvas = document.getElementById('canvas');  
 	var ctx = canvas.getContext('2d');  
 	var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);  
 		gradient.addColorStop(1, "rgb(161, 219, 21)");  
		gradient.addColorStop(0, "rgb(207, 245, 114)");  
  
	ctx.save();  
	ctx.fillStyle = gradient;  
	ctx.fillRect(0, 0, progressProcent, canvas.height);  
	ctx.restore();   
}