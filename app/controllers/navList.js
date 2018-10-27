app.directive('navList', function() {
	return {
		restrict: 'C',
		scope: false,
		link: function(scope, element, attrs) {
			var item = element.find('.nav-list-item');
			
			item.on('click', function() {
				item.each(function() {
					if ($(this).removeClass('active'));
				});
				$(this).toggleClass('active');
			});
		}
	};
});
