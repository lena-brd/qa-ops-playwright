## Test Data Organization

- **`placeholderData.json`** — if needed a dataset for page page objects, if not use .env file
- **`.env`** — Sensitive credentials: emails and passwords (NOT committed)

## Running Tests

```bash
# Run all tests
npx playwright test

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# View test report
npx playwright show-report
```

## Important Notes

⚠️ **Never commit `.env` file** — It contains sensitive credentials

✅ **Test accounts** — Create separate test accounts for automation (not personal accounts)

### GitHub Actions tests fail

- Verify all secrets are added in GitHub Settings
- Check secret names match exactly (case-sensitive)
