(function($) {
	$.fn.sublim = function(color) {
		var self = this;

		self.css(color);

		function init(id) {
			QSlab.log(id);
		};

		function updateColor(color) {
			self.css({background: color});
		};

		return {
			css: $.extend({
				background: "green"
			}, color),
			init: init,
			updateColor: updateColor
		};
	};
})(jQuery);