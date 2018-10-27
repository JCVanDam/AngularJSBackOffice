(function(window) {
	'use strict';

	function defineQSlab() {
		var QSlab = {};

		QSlab.log = function(id) {
			console.log('QSlab => ' + id);
		};

		return QSlab;
	};

	if (typeof(QSlab) === 'undefined') {
		window.QSlab = defineQSlab();
	}
})(window);