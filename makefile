server:
	hugo server

tree:
	tree -I node_modules -I themes/ -I resources

# JS targets

test:
	npm test

install:
	npm install

lint:
	npm run typecheck 

check: test lint
