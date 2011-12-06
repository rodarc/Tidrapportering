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

	$('#content').on('click', '.project', function(){
		var element = $(this);
			attrId = element.attr('id'),
			projectId = attrId.split('project');
		loadProjectView(element, projectId[1]);
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

/*------------------------------------*\
	FORM
\*------------------------------------*/

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

/*------------------------------------*\
	SECTIONS
\*------------------------------------*/

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
			if(link == 'project.html') {
				loadProjects();
			}
		});
	}
}

function loadProjects() {
	var projects = {};
	projects[0] = {
		'projectName': 'Tidrapportering',
		'id': 1,
		'totalTime': 200,
		'progress': 73,
		'customer': 'KYH Göteborg',
		'active': true
	};
	projects[1] = {
		'projectName': 'Hemsida',
		'id': 2,
		'totalTime': 50,
		'progress': 45,
		'customer': 'Göteborg & Co',
		'active': false
	}
	projects[2] = {
		'projectName': 'Jätteprojektet',
		'id': 3,
		'totalTime': 2545,
		'progress': 5000,
		'customer': 'Jetebra Ab',
		'active': true
	}
	/*$.get('http://tidrapportering/getProjects', function(data){
		
	});*/
	$.each(projects, function() {
		var html = '<li id="project'+ this.id +'" class="project cf headerList">'+
			'<div class="projectHeader cf">' +
				'<hgroup>' +
					'<h2 class="projectName">'+ this.projectName +'</h2>' +
					'<h3 class="customerName">'+ this.customer +'</h3>' +
				'</hgroup>' +
				'<figure class="progressBar'+ this.id +' cf">' +
					'<canvas id="progressBar'+ this.id +'"width="300px" height="44px"></canvas>' +
				'</figure>' +
				'<span class="progressTotal">'+ this.totalTime +'h</span>' +
			'</div>' +
		'</li>';
		$('#project').append(html);
		progressBarCanvas(this.id, this.progress, this.totalTime);
		if(!this.active) {
			$('#project'+this.id).css('opacity', .4);
		}
	});
}

function loadProjectView(element, projectId) {
	var content = element.find('#itemView');
	if(content.length < 1) {
		$.get('projectView.html', function(data) {
			element.append(data);
		});
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

function progressBarCanvas(id, progress, total) {  
 	var canvas = document.getElementById('progressBar'+id),
 		ctx = canvas.getContext('2d'),
 		totalPercent = canvas.width / total,
 		progressPercent = progress * totalPercent,  
 		gradient = ctx.createLinearGradient(0, 0, 0, canvas.height),
 		textPosition = 300 - progressPercent + 4;  
 	if(progress > total) {
 		gradient.addColorStop(1, "rgb(193, 53, 42)");  
		gradient.addColorStop(0, "rgb(228, 64, 52)");
 	} else {
 		gradient.addColorStop(1, "rgb(161, 219, 21)");  
		gradient.addColorStop(0, "rgb(207, 245, 114)");
	}
  
	ctx.save();  
	ctx.fillStyle = gradient;  
	ctx.fillRect(0, 0, progressPercent, canvas.height);
	ctx.restore();
	$('#project'+ id +' .progressBar'+ id).append('<span class="canvasText">'+ progress +'h</span>');
	canvasText = $('#project'+ id +' .canvasText');
	if(canvasText.width() > progressPercent) {
		canvasText.css('left', 4);
	} else if(progress > total) {
		canvasText.css('right', 4);
	} else {
		canvasText.css('right', textPosition);
	}
}