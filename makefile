server:
	hugo server

tree:
	tree -I node_modules -I themes/ -I resources

# JS targets

install:
	npm install

test:
	npm test

typecheck:
	npm run typecheck 

lint:
	npm run lint 

check: test lint typecheck
