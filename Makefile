
GULP=./node_modules/.bin/gulp
API=local
SERVER_PORT=4246

build: bower clean
	@$(GULP)

watch: build
	@$(GULP) watch

server:
	@node server --port $(SERVER_PORT)

npm:
	@echo -n "Checking for npm modules..."
	@[ -d node_modules ] && echo "OK" || npm install

bower: npm
	@echo -n "Checking for bower components..."
	@[ -d bower_components ] && echo "OK" || node_modules/.bin/bower install

clean:
	@rm -rf build
