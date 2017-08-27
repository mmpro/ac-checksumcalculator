test-dev:
	@echo "TESTING DEV"
	claudia test-lambda --version development --event test/event-dev.json

test-live:
	@echo "TESTING PRODUCTION"
	claudia test-lambda --version production --event test/event-live.json

update-dev:
	@echo "Updating DEV"
	claudia update --version development --set-env-from-json config/env/development.json

update-live:
	@echo "Updating PRODUCTION"
	claudia update --version production --set-env-from-json config/env/production.json
