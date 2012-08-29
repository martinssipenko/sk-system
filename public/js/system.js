/* DOCUMENT READY */
	$(document).ready(function() {
		//Path.history.listen();
		//$("a").click(function(event){
		//	event.preventDefault();
		//	Path.history.pushState({}, "", $(this).attr("href"));
		//});
		
		$('body').on('blur', '.mandatory', checkEmpty);
		$('body').on('blur', '#number', validateNumber);
		$('body').on('blur', '#name', validateName);
		$('body').on('keyup', '#birth_year', validateYear);
		$('body').on('keyup', '#birth_year', calcGroup);
		$('body').on('keydown', '.numeric', allowOnlyNumbers);
		$('body').on('click', '#genderMale', calcGroup);
		$('body').on('click', '#genderFemale', calcGroup);
		$('body').on('change', '#bicycle', calcGroup);
		$('body').on('closed', '#alert', function() {
			$('#blacklist').val(0);
			$('#birth_year').keyup();
		});
		$('body').on('click', '#reset', function() {
			removeValidationMarkup($('#number'));
			removeValidationMarkup($('#name'));
			removeValidationMarkup($('#birth_year'));
			$('#id').val('');
			$('#blacklist').val(0);
			$('#submit').attr('disabled', 'disabled');
		});
		assignNameTypeahead();

	});

/* FUNCTIONS */
	function fetchContent(url) {
		$.get(url, function(data) {
			$('#content').html(data);
			assignNameTypeahead();
		});
	}
	
	var checkEmpty = function () {
		var field = $(this);
		var value = field.val();
        if (value <= 0 || value == '') {
			removeValidationMarkup(field);
			addValidationMarkup(field, 'error', 'Lauks obligāti jāaizpilda');
            return false;
        }
	}
	
	var validateNumber = function() {
		var field = $(this);
		var value = field.val();
		if (value != '' && value != 0) {
			removeValidationMarkup(field);
			$.post('/10km/reg/cnum/', {number: field.val()}, function(data) {
			  if (data == '#SUCCESS') {
				addValidationMarkup(field, 'success', 'OK');
			  } else if (data == '#FAILURE') {
				addValidationMarkup(field, 'error', 'Numurs jau reģistrēts');
			  }
			});
		}
	}
	
	var validateYear = function() {
		var field = $(this);
        removeValidationMarkup(field);
        var value = field.val()
        var currentYear = (new Date).getFullYear();
        if (value <= 0 || value >= currentYear || value <= currentYear-100) {
            var cont = findContainer(field);
            addValidationMarkup(field, 'error', 'Nepareizs dzimšanas gads!');
        } else if (value <= currentYear-70) {
            addValidationMarkup(field, 'warning', 'Aizdomīgs dzimšanas gads!');
        } else {
            addValidationMarkup(field, 'success', 'OK');
        }
	}
	
	var validateName = function() {
		var field = $(this);
		var value = field.val();
		if(value != '') {
			removeValidationMarkup(field);
			addValidationMarkup(field, 'success', 'OK');
		}
	}
	
	var allowOnlyNumbers = function(event) {
		// Allow: backspace, delete, tab, escape, and enter
		if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
			 // Allow: Ctrl+A
			(event.keyCode == 65 && event.ctrlKey === true) || 
			 // Allow: home, end, left, right
			(event.keyCode >= 35 && event.keyCode <= 39)) {
				 // let it happen, don't do anything
				 return;
		}
		else {
			// Ensure that it is a number and stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
				event.preventDefault(); 
			}   
		}
	}

	
	function findContainer(item) {
		return item.parent();
	}
	
	function addValidationMarkup(item, cls, caption) {
		var cont = findContainer(item);
		cont.addClass(cls);
		item.addClass(cls);
			
		if (caption) {
			var msg = $('<span class="help-inline"/>');
			msg.addClass(cls);
			msg.text(caption);
			item.after(msg);
		}
		
		$('#submit').attr('disabled', 'disabled');
		
		if(cls != 'error') {
			if($('#number').hasClass('success')
			   && $('#name').hasClass('success')
			   && ($('#birth_year').hasClass('success') || $('#birth_year').hasClass('warning'))
			   && $('#blacklist').val() == 0)
			{
				$('#submit').removeAttr('disabled');
			}
		}
	}
	
	function removeValidationMarkup(input) {
		var cont = findContainer(input);
		cont.removeClass('error').removeClass('success').removeClass('warning');
		input.removeClass('error').removeClass('success').removeClass('warning');
		$('.help-inline.error, .help-inline.success, .help-inline.warning', cont).remove();
	}
	
	function assignNameTypeahead() {
		$("#name").typeahead({
		  source: function (query, process) {
			$.post('/ajax/partlookup', {query: query, items: 5}, function (data) {
			  labels = [];
              mapped = {};
			  
			  $.each(data, function(i, item) {
				var query_label = item.name + ' (' + item.birth_year + ')';
				mapped[query_label] = item;
				labels.push(query_label);
			  });
			  process(labels);
			}, 'json');
		  },
          minLength: 3,
		  updater: function (query_label) {
			var item = mapped[query_label];
			$('#birth_year').val(item.birth_year);
			$('#id').val(item.id);
			var radios = $('input:radio[name=gender]');
			radios.filter('[value='+item.gender+']').attr('checked', true);
			if(item.blacklist != undefined && item.blacklist != false) {
				$('#alert-area').html('<div class="alert alert-block alert-error fade in hide" id="alert">' +
								      '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
									  '<p>Uzmanību! Šis dalībnieks ' + item.blacklist + '.</p></div>');
				$('#alert').show();
				$('#blacklist').val(1);
			}
			$('#birth_year').keyup();
			$('#name').blur();
			return item.name;
		  }
		});
	}
	
	var calcGroup = function() {
		var by = $('#birth_year');
		if(by.hasClass('success')) {
			var currentYear = (new Date).getFullYear();
			var year = currentYear - by.val();
			var radios = $('input:radio[name=gender]').filter('[checked=checked]');
			$('#group').val(getGroup(year, $('#bicycle').val(), radios.val()));
		}
	}
	
	function getGroup(age, bicycle, gender) {
		if (bicycle == 'AK') {
			return 'AK';
		}
		if(gender == 'M') {
			gender = 'V';
		} else if (gender == 'F') {
			gender = 'S';
		}
		var groups = jQuery.parseJSON('[{"CV":"BV","TV":"BV","SV":"BV","CS":"BS","TS":"BS","SS":"BS"},{"CV":"BV","TV":"BV","SV":"BV","CS":"BS","TS":"BS","SS":"BS"},{"CV":"BV","TV":"BV","SV":"BV","CS":"BS","TS":"BS","SS":"BS"},{"CV":"BV","TV":"BV","SV":"BV","CS":"BS","TS":"BS","SS":"BS"},{"CV":"BV","TV":"BV","SV":"BV","CS":"BS","TS":"BS","SS":"BS"},{"CV":"BV","TV":"BV","SV":"BV","CS":"BS","TS":"BS","SS":"BS"},{"CV":"BV","TV":"BV","SV":"BV","CS":"BS","TS":"BS","SS":"BS"},{"CV":"BV","TV":"BV","SV":"BV","CS":"BS","TS":"BS","SS":"BS"},{"CV":"BV","TV":"BV","SV":"BV","CS":"BS","TS":"BS","SS":"BS"},{"CV":"TV 1","TV":"TV 1","SV":"SV 1","CS":"TS 1","TS":"TS 1","SS":"SS 1"},{"CV":"TV 1","TV":"TV 1","SV":"SV 1","CS":"TS 1","TS":"TS 1","SS":"SS 1"},{"CV":"TV 1","TV":"TV 1","SV":"SV 1","CS":"TS 1","TS":"TS 1","SS":"SS 1"},{"CV":"TV 1","TV":"TV 1","SV":"SV 1","CS":"TS 1","TS":"TS 1","SS":"SS 1"},{"CV":"CV 3","TV":"TV 2","SV":"SV 2","CS":"CS 3","TS":"TS 2","SS":"SS 3"},{"CV":"CV 3","TV":"TV 2","SV":"SV 2","CS":"CS 3","TS":"TS 2","SS":"SS 3"},{"CV":"CV 3","TV":"TV 2","SV":"SV 2","CS":"CS 3","TS":"TS 2","SS":"SS 3"},{"CV":"CV 3","TV":"TV 2","SV":"SV 2","CS":"CS 3","TS":"TS 2","SS":"SS 3"},{"CV":"CV 3","TV":"TV 3","SV":"SV 3","CS":"CS 3","TS":"TS 3","SS":"SS 3"},{"CV":"CV 3","TV":"TV 3","SV":"SV 3","CS":"CS 3","TS":"TS 3","SS":"SS 3"},{"CV":"CV 3","TV":"TV 3","SV":"SV 3","CS":"CS 3","TS":"TS 3","SS":"SS 3"},{"CV":"CV 3","TV":"TV 3","SV":"SV 3","CS":"CS 3","TS":"TS 3","SS":"SS 3"},{"CV":"CV 3","TV":"TV 3","SV":"SV 3","CS":"CS 3","TS":"TS 3","SS":"SS 3"},{"CV":"CV 3","TV":"TV 3","SV":"SV 3","CS":"CS 3","TS":"TS 3","SS":"SS 3"},{"CV":"CV 3","TV":"TV 3","SV":"SV 3","CS":"CS 3","TS":"TS 3","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 3","TV":"TV 4","SV":"SV 3","CS":"CS 3","TS":"TS 4","SS":"SS 3"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"},{"CV":"CV 5","TV":"TV 5","SV":"SV 5","CS":"CS 5","TS":"TS 5","SS":"SS 5"}]');
		return groups[age][bicycle+gender];
	}
	

