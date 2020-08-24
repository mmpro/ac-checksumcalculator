test-dev:
	@echo "TESTING DEV"
	node_modules/.bin/claudia test-lambda --version development --event test/event-dev.json --profile DEV

test-live:
	@echo "TESTING PRODUCTION"
	node_modules/.bin/claudia test-lambda --version production --event test/event-live.json

update-dev:
	@echo "Updating DEV"
	node_modules/.bin/claudia update --version development --timeout 900 --set-env-from-json config/env/development.json --profile DEV

update-live:
	@echo "Updating PRODUCTION"
	node_modules/.bin/claudia update --version production --timeout 900 --set-env-from-json config/env/production.json

lint-fix:
	./node_modules/.bin/eslint lambda.js --fix

commit:
	@node ./node_modules/ac-semantic-release/lib/commit.js

release:
	@node ./node_modules/ac-semantic-release/lib/release.js