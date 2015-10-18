install:
	bower install
	cp bower_components/angular/angular.min.js www/js/vendor/angular-1.4.7.min.js
	cp bower_components/jquery/dist/jquery.min.js www/js/vendor/jquery-2.1.4.min.js
	cp bower_components/jquery-ui/jquery-ui.min.js www/js/vendor/jquery-ui-1.11.4.min.js
	cp bower_components/moment/min/moment.min.js www/js/vendor/moment-2.10.6.min.js
	cp bower_components/bootstrap/dist/js/bootstrap.min.js www/js/vendor/bootstrap-3.3.5.min.js
	cp bower_components/bootstrap/dist/css/bootstrap.min.css www/css/vendor/bootstrap-3.3.5.min.css
	cp bower_components/jquery-ui/themes/base/jquery-ui.min.css www/css/vendor/jquery-ui-1.11.4.min.css
	cp bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2 www/css/fonts/
	cp bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff www/css/fonts/
	cp bower_components/jquery-ui/themes/base/images/ui-icons_777777_256x240.png www/css/vendor/images/
	cp bower_components/jquery-ui/themes/base/images/ui-icons_555555_256x240.png www/css/vendor/images/
	cp bower_components/jquery-ui/themes/base/images/ui-icons_444444_256x240.png www/css/vendor/images/
	cp bower_components/jquery-ui/themes/base/images/ui-icons_ffffff_256x240.png www/css/vendor/images/

publish: install
	cd www/
	tar -czf the-allocator-www.tgz *
	cd ..
	git checkout gh-pages && mv www/the-allocator-www.tgz .
	rmdir www/
	tar -xzf the-allocator-www.tgz && rm the-allocator-www.tgz 
	git commit -a -m "updating gh-pages from master"
	git push

