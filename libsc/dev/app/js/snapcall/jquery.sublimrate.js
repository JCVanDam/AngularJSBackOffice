/*
** jQuery Sublimrate Plugin
**
** about	: This plugin displays clickable rating stars
** version 	: 1.0.0
** created	: 09/12/2016
** updated	: 12/12/2016
** author	: Razvan Ludosanu
**
**
** To custom init the object, pass an object wrapper as argument like in the following example :
**
**  $('__my_selector__').sublimrate({
**	  color: {
**      inactive: #FFFFF,
**      active: #FFFFFF
**	  },
**    size: '30px',
**    callback: function(){ ... }
**  });
**
** The default callback logs the clicked value into the browser's console
*/

define(['jquery'], function($) {
	$.fn.sublimrate = function(options) {
		var self = this;
		
		var settings = $.extend({
			color: {
				inactive: 'black',
				active: 'yellow'
			},
			size: '25px',
			callback: function(rate) {
				return rate;
			}
		}, options);

		for (var i = 1 ; i < 6 ; i++) {
			self.append('<span class="fa fa-star rate-star" value="' + i + '"></span>');
		}

		self.css({
			textAlign: 'center'
		});

		self.find('.rate-star').css({
			color: settings.color.inactive,
			fontSize: settings.size,
			padding: '0px 5px'
		});
		
		self.find('.rate-star').hover(
			function() {
				var rate = $(this).attr('value');

				self.find('.rate-star').each(function() {
					if ($(this).attr('value') <= rate) {
						$(this).css({
							color: settings.color.active,
							cursor: 'pointer'
						});
					}
				});
			},
			function() {
				self.find('.rate-star').css({
					color: settings.color.inactive,
					cursor: 'default'
				});
			}
		);

		self.find('.rate-star').click(function() {
			settings.callback($(this).attr('value'));
		});

		return self;
	};
});