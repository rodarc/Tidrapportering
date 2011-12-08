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
	$('#login').off('click').on('click', function(e){
		e.preventDefault();
		login($(this));
	});

	$('#logout').on('click', function(e){
		e.preventDefault();
		logOut();
	});

	$('.lightbox').on('click', 'input[type=submit]:not([id=login])', function(e){
		e.preventDefault();
		sendForm($(this));
	});

	$('.lightbox').on('focusout', 'input[name=passwordCheck]', function() {
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

	$('#content').on('click', '.projectHeader', function(){
		var element = $(this),
			attrId = element.parent().attr('id'),
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
}

function sendForm(element) {
	var form = element.parent(),
		formAction = form.attr('action'),
		inputFields = form.find('input');
		selects = form.find('select');
	
	var parameters = {};

	$.each(inputFields, function(){
		input = $(this);
		if (input.attr('type') != 'submit' && input.attr('type') != 'reset') {
			var inputName = input.attr('name'),
				inputValue = input.val();

			parameters[inputName] = inputValue;
			console.log(inputName +' : '+ inputValue);
		}
	});

	$.each(selects, function(){
		select = $(this);
		var selectName = select.attr('name'),
			selectValue = select.val();

			parameters[selectName] = selectValue;
			console.log(selectName +' : '+ selectValue);
	});
	console.log('Skickas till ' + formAction);
	$.post('http://Tidrapportering/'+ formAction, parameters, function(data){
		// Göra något
	}, 'json');
}

function login(element) {
	var form = element.parent(),
		formAction = form.attr('action'),
		username = $('#username').val(),
		password = $('#password').val(),
		validEmail = isValidEmailAddress(username);

	/*if(validEmail) {
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
		}, 'json');
	} else {
		form.find('.error').remove();
		form.children().prepend('<p class="error">Fel användarnamn och/eller lösenord</p>');
	}*/
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
	if(loggedIn === true){
		/*$.post('http://tidrapportering/logout.php', function(data){*/
			loggedIn = false;
			/*if(data.status) {*/
				/* ändra till popup window så användaren inte blir redirected till index.html, och måste gå tillbaka till den sida där denne blev utloggad ifrån */
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
	};
	projects[2] = {
		'projectName': 'Jätteprojektet',
		'id': 3,
		'totalTime': 2545,
		'progress': 5000,
		'customer': 'Jetebra Ab',
		'active': true
	};

	$.each(projects, function() {
		var	projectName = this.projectName,
			projectId   = this.id,
			customer    = this.customer,
			totalTime   = this.totalTime,
			progress    = this.progress,
			active      = this.active;
		$.get('projectList.html', function(data) {
			var html = $(data);
			html.attr('id', 'project'+ projectId)
				.find('h2').html(projectName).end()
				.find('h3').html(customer).end()
				.find('figure').addClass('progressBar'+ projectId).end()
				.find('canvas').attr('id', 'progressBar'+ projectId).end()
				.find('.progressTotal').html(totalTime +'h');
			$('#project').append(html);
			if(!active) {
				$('#project'+projectId).find('.projectHeader').css('opacity', 0.4);
			}

			progressBarCanvas(projectId, progress, totalTime);
		});
	});
}

function loadProjectView(element, projectId) {
	var content = element.parent().find('.projectContent'), 
		userRoles = {}, 
		projectMembers = {}, 
		myTimeLogs = {}
	;

	userRoles[0] = {
		'id':'1',
		'name':'Utvecklare'
	};
	userRoles[1] = {
		'id':'2',
		'name':'Designer'
	};
	userRoles[2] = {
		'id':'3',
		'name':'Projektledare'
	};

	projectMembers[0] = {
		'id':'1',
		'name' : 'Bosse Bossesson'
	};
	projectMembers[1] = {
		'id':'2',
		'name' : 'Nisse Nilsson'
	};
	projectMembers[2] = {
		'id':'3',
		'name': 'Asa Nilsson'
	};

	myTimeLogs[0] = {
		'id':'1',
		'title':'Use Cases',
		'comment':'',
		'duration':'3:32'
	};
	myTimeLogs[1] = {
		'id':'2',
		'title':'Design',
		'comment':'',
		'duration':'15:00'
	};
	myTimeLogs[2] = {
		'id':'3',
		'title':'Goldplating DeLuxe',
		'comment':'',
		'duration':'6:47'
	};

	var roleOptions = '',
		projMem = '',
		timeLogs = ''
	;

	$.each(userRoles, function() {
		roleOptions += '<option>' + this.name + '</option>';
	});

	$.each(projectMembers, function() {
		projMem += '<li>' + this.name + '</li>';
	});

	$.each(myTimeLogs, function() {
		timeLogs += '<tr><td>' + this.title + '</td>' +
						'<td class="center">' + this.duration + '</td>' +
						'<td><a href="#" class="commentButton"></a></td>' +
						'<td class="center"><input type="checkbox" name="timeLog" value="#" id="timeLog' + this.id + '"/></td>' +
					'</tr>';
	});

	if(content.length < 1) {
		$.get('projectView.html', function(data) {

			var html = $(data);

			html.find('select').append(roleOptions);
			html.find('.projectMemberList').append(projMem);
			html.find('.timeLogTable').append(timeLogs);

			element.parent().append(html);
			element.parent().find('.projectContent').animate({height: '400px'}, 300);
			element.addClass('active');
		});
	} else {
		content.animate({height: '1px'}, 300, function(){
			content.remove();
		});
		element.removeClass('active');
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
		contentDiv       = lightbox.children('div'),
		contentDivWidth  = contentDiv.width(),
		contentDivHeight = contentDiv.height(),
		contentDivLeft   = windowSize.width / 2 - contentDivWidth / 2,
		contentDivTop    = windowSize.height / 2 - contentDivHeight / 2,
		documentHeight   = $(document).height();

	if(contentDivHeight > windowSize.height) {
		contentDivTop = 100;
	}

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
	$('.progressBar'+ id).append('<span class="canvasText">'+ progress +'h</span>');
	canvasText = $('#project'+ id).find('.canvasText');
	if(canvasText.width() > progressPercent) {
		canvasText.css('left', 4);
	} else if(progress > total) {
		canvasText.css('right', 4);
		$('#project'+ id).find('.canvasText').css('text-shadow', '0 1px 0 rgba(255,255,255,.25)');
	} else {
		canvasText.css('right', textPosition);
	}
}