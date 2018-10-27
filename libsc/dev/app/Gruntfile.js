module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			verto: {
				src: 'js/verto/*',
				dest: 'js/verto/verto.js'
			}
		},
		uglify: {
			verto: {
				src: 'js/verto/verto.js',
				dest: 'js/verto/verto.min.js'
			}
		},
		less: {
			css: {
				src: [
					'less/button.less',
					'less/callbar.less',
					'less/popin.less'
				],
				dest: 'css/snapcall.css'
			}
		},
		mustache_render: {
			test: {
				files: [{
					data: "mustache/test.json",
					template: "mustache/test.mustache",
					dest: "mustache/test.html"
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-mustache-render');

	//grunt.registerTask('default', ['concat', 'uglify', 'less']);
};
