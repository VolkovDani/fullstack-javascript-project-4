install:
		npm ci
		npm link

publish:
		npm publish --dry-run

lint:
		npx eslint .

test:
		npm test

test_coverage:
		npx jest --coverage
