var windowSize = {
	width: 0,
	height: 0
},
	loggedIn = false,
	hash;
var userRoles = {},
	customers = {};
	users = {};

users[1] = { 'id':'1', 'firstName': 'Bosse', 'lastName': 'Bossesson', 'userRole': 'Utvecklare', 'username': 'thebose@systämet.se'};
users[2] = { 'id':'2', 'firstName': 'Åsa', 'lastName': 'Nilsson', 'userRole': 'Designer', 'username': 'killeråsa@hotmale.com'};
users[3] = { 'id':'3', 'firstName': 'Nils', 'lastName': 'Nilsson', 'userRole': 'Projektledare', 'username': 'herrnilsson@gunitmail.se'};

userRoles[0] = { 'id':'1', 'name':'Utvecklare' };
userRoles[1] = { 'id':'2', 'name':'Designer' };
userRoles[2] = { 'id':'3', 'name':'Projektledare' };

customers[0] = { 'name': 'KYH Göteborg' };
customers[1] = { 'name': 'Göteborg & Co' };
customers[2] = { 'name': 'Jetebra Ab' };
customers[3] = { 'name': 'Dalkurd FF' };

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

	$('.lightbox').on('focusout', 'input[type=email]', function() {
		var element = $(this),
			email = element.val(),
			validEmail = isValidEmailAddress(email);
		if(!validEmail) { element.css('background', 'red'); }
		if(validEmail) { element.css('background', 'green'); }
	});

	$('.menu').on('click', function(e){
		e.preventDefault();
		var link = $(this).attr('href');
		loadSection(link);
	});

	$('#content').on('click', '.deleteTimeLog', function(e){
		e.preventDefault();
		deleteTimeLog($(this));
	});

	$('#content').on('click', '.addButton', function(e){
		e.preventDefault();
		var element = $(this),
			link = element.attr('href');
		loadSection(link, element);
	});

	$('#content').on('click', '.listHeader', function(){
		var element = $(this),
			activePage = $('nav').find('.active').attr('href'),
			attrId = element.parent().attr('id'),
			projectId = attrId.split('project')[1],
			userId = attrId.split('userId')[1],
			customerId = attrId.split('customer')[1];
		if(activePage == 'project.html') {
			loadProjectView(element, projectId);
		}
		// if(activePage == 'customer.html') {
		// loadCustomerView(element, customerId[1]);
		// } 
		if(activePage == 'user.html') {
			loadUserView(element, userId);
		}
	});

	// $('#content').on('click', '.userHeader', function(){
	//	var element = $(this),
	//		attrId = element.parent().attr('id'),
	//		userId = attrId.split('user');
	// loadUserView(element, userId[1]);
	// });

	$('.lightbox').on('click', 'input[value="Avbryt"]', function(){
		closePopup();
	});

	$('.search').submit(function(e) {
		// loadSearchResult();
		e.preventDefault();
		var link = 'searchResult.html';
		loadSection(link);
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

function deleteTimelog(){
	var form = element.parent(),
		formAction = form.attr('action'),
		checkboxes = form.find('input:checkbox'),
		checked = $("input:checked").length,
		timeLogId;
	if (checked > 0){
		$.each(':checked', function(){
			id = attr('id');
			$.delete_('http://Tidrapportering/timeLog/'+ timeLogId, function(data){
				// Göra något
			});	
		});

	}
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

function loadSection(link, element) {
	var splitLink = link.split('/');
	if(splitLink[0] == 'popups') {
		loadPopup(splitLink[1], element);
		adjustLightbox();
	} else {
		history.pushState(null, null, '#/'+link);
		$('#content').load(link, function() {
			$('.lightbox').fadeOut();
			$('.active').removeClass('active');
			$('a[href="'+ link +'"]').addClass('active');

			var urlSection = link.split('.')[0],
				section = 'load'+ urlSection.charAt(0).toUpperCase() + urlSection.slice(1) + 's';
			window[section]();
		});
	}
}

function loadProjects() {
	var projects = {};
	projects[0] = {
		'projectName': 'Tidrapportering',
		'id': 1,
		'estimate': 200,
		'progress': 73,
		'customer': 'KYH Göteborg',
		'active': true
	};
	projects[1] = {
		'projectName': 'Hemsida',
		'id': 2,
		'estimate': 50,
		'progress': 45,
		'customer': 'Göteborg & Co',
		'active': false
	};
	projects[2] = {
		'projectName': 'Jätteprojektet',
		'id': 3,
		'estimate': 2545,
		'progress': 5000,
		'customer': 'Jetebra Ab',
		'active': true
	};

	$.each(projects, function() {
		var	projectName = this.projectName,
			projectId   = this.id,
			customer    = this.customer,
			estimate    = this.estimate,
			progress    = this.progress,
			active      = this.active;
		$.get('projectList.html', function(code) {
			var html = $(code);
			html.attr('id', 'project'+ projectId)
				.find('h2').html(projectName).end()
				.find('h3').html(customer).end()
				.find('figure').addClass('progressBar'+ projectId).end()
				.find('canvas').attr('id', 'progressBar'+ projectId).end()
				.find('.progressTotal').html(estimate);
			$('#project').append(html);
			if(!active) {
				$('#project'+projectId).find('.listHeader').css('opacity', 0.4);
			}
			progressBarCanvas(projectId, progress, estimate);
		});
	});
}

function loadProjectView(element, projectId) {
	var content = element.parent().find('.projectContent'), 
		projectMembers = {}, 
		myTimeLogs = {}
	;
		console.log(content);

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
		user = '',
		timeLogs = ''
	;

	$.each(userRoles, function() {
		roleOptions += '<option>' + this.name + '</option>';
	});

	$.each(users, function() {
		user += '<li>' + this.firstName + ' ' + this.lastName + '</li>';
	});

	$.each(myTimeLogs, function() {
		timeLogs += '<tr><td>' + this.title + '</td>' +
						'<td class="center">' + this.duration + '</td>' +
						'<td><a href="#" class="commentButton"></a></td>' +
						'<td class="center"><input type="checkbox" name="timeLog" value="#" id="' + this.id + '"/></td>' +
					'</tr>';
	});

	if(content.length < 1) {
		$.get('projectView.html', function(data) {

			var html = $(data);

			html.find('select').append(roleOptions);
			html.find('.projectMemberList').append(user);
			html.find('.timeLogTable').append(timeLogs);
			html.find('tr').filter(':even').css('background-color', '#eee');

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

function loadCustomers() {
	$.each(customers, function() {
		var customerName = this.name;
		$.get('customerList.html', function(data) {
			var html = $(data);
			html.find('h2').html(customerName);
			$('#customers').append(html);
		});
	});
}

function loadUsers() {
	$.each(users, function() {
		var firstName = this.firstName,
			lastName = this.lastName,
			userId = this.id;
		$.get('userList.html', function(data) {
			var html = $(data);
			html.attr('id', 'userId' + userId)
				.find('h2').html(firstName + ' ' + lastName);
			$('#users').append(html);
		});
	});
}

function loadUserView(element, userId) {
	var content = element.parent().find('.userContent'),
		userRole = '<li>' + users[userId].userRole + '</li>';

	/*$.each(users[userId], function() {
		userRole += '<li>' + this.userRole + '</li>';
	});*/
		
	if(content.length < 1) {
		$.get('userView.html', function(data) {
			var html = $(data);

			html.find('.userRoles').append(userRole);

			element.parent().append(html);
			element.parent().find('.userContent').animate({height: 'auto'}, 300);
			element.addClass('active');
		});
	} else {
		content.animate({height: '1px'}, 300, function(){
			content.remove();
		});
		element.removeClass('active');
	}
}

function loadPopup(link, element) {
	$.get('popups/'+ link, function(data) {
		var html = $(data),
			customerOptions = '',
			rolesOptions = '',
			li;
		if(html.find('select').attr('name') == 'customer') {
			$.each(customers, function() {
				customerOptions += '<option value="'+ this.name +'">' + this.name + '</option>';
			});
		}
		if(html.find('select').attr('name') == 'roles') {
			$.each(userRoles, function() {
				rolesOptions += '<option value="'+ this.name +'">' + this.name + '</option>';
			});
		}
		if(link == 'createProject.html' || link == 'editProject.html') {
			html.find('select').append(customerOptions);
		}
		if(link == 'editUser.html') {
			li = element.parent().parent().parent();
			var	id = li.attr('id').split('userId')[1],
				firstName = users[id].firstName,
				lastName = users[id].lastName,
				username = users[id].username;
			
			html.find('#username').val(username);
			html.find('#firstName').val(firstName);
			html.find('#lastName').val(lastName);
			html.find('select').append(rolesOptions);
			html.find('option[value="'+ users[id].userRole +'"]').attr('selected', 'selected');
		}
		if(link == 'editProject.html') {
			li = element.parent().parent().parent();
			var	projectName = li.find('.projectName').text(),
				estimate = li.find('.progressTotal').text(),
				customer = li.find('.customerName').text();
			html.find('input[name=projectName]').val(projectName).end()
				.find('input[name=estimate]').val(estimate);
			html.find('option[value="'+ customer +'"]').attr('selected', 'selected');
		}
		$('.lightbox').html(html).fadeIn();
		adjustLightbox();
	});
}

function closePopup() {
	$('.lightbox').fadeOut().children('div').remove();
}

function adjustLightbox() {
	var lightbox         = $('.lightbox'),
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

function loadSearchResults() {

	var searchResult = {};

	searchResult[0] = {
		'type': 'project',
		'projectName': 'Tidrapportering',
		'id': 1,
		'totalTime': 200,
		'progress': 73,
		'customer': 'KYH Göteborg',
		'active': true
	};
	searchResult[1] = {
		'type': 'project',
		'projectName': 'Hemsida',
		'id': 2,
		'totalTime': 50,
		'progress': 45,
		'customer': 'Göteborg & Co',
		'active': false
	};
	searchResult[2] = {
		'type': 'project',
		'projectName': 'Jätteprojektet',
		'id': 3,
		'totalTime': 2545,
		'progress': 5000,
		'customer': 'Jetebra Ab',
		'active': true
	};

	searchResult[3] = { 'type': 'customer', 'name': 'KYH Göteborg' };
	searchResult[4] = { 'type': 'customer', 'name': 'Göteborg & Co' };
	searchResult[5] = { 'type': 'customer', 'name': 'Jetebra Ab' };
	searchResult[6] = { 'type': 'customer', 'name': 'Dalkurd FF' };
	
	$.each(searchResult, function() {
		var itemType = this.type;
		console.log(itemType);

		switch(itemType) {
			case 'project':
					console.log(this);

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
						.find('.progressTotal').html(totalTime);
					$('#searchResult').append(html);
					if(!active) {
						$('#project'+projectId).find('.listHeader').css('opacity', 0.4);
					}
					progressBarCanvas(projectId, progress, totalTime);

				});
				break;

			case 'customer':
				var customerName = this.name;
				$.get('customerList.html', function(data) {
					var html = $(data);
					html.find('h2').html(customerName);
					$('#searchResult').append(html);
				});
				break;
		}
	});
}