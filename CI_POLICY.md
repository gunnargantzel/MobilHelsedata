# CI/CD Policy

## Overview
This repository uses GitHub Actions for continuous integration and deployment to Azure Static Web Apps.

## Workflow Configuration

### Trigger Strategy
- **Push to main**: Deploys to production environment
- **Pull Requests**: Creates preview deployments for testing
- **Auto-commits**: Skipped using `[skip ci]` tag

### Concurrency Control
- Only one deployment can run at a time per branch
- New pushes/PRs will cancel previous runs to prevent conflicts
- Prevents resource waste and deployment conflicts

### Skip CI Mechanism
Add `[skip ci]` to commit messages to skip automated deployments:
```bash
git commit -m "Update documentation [skip ci]"
git commit -m "Fix typo in README [skip ci]"
```

## Deployment Environments

### Production
- **Trigger**: Push to `main` branch
- **Environment**: Production Azure Static Web Apps
- **URL**: `https://ambitious-stone-07a45d403.2.azurestaticapps.net`

### Preview
- **Trigger**: Pull Requests to `main`
- **Environment**: Preview Azure Static Web Apps
- **URL**: Generated per PR for testing

## Security
- Uses Azure Static Web Apps API tokens stored as GitHub Secrets
- No sensitive data exposed in workflow files
- Automatic token rotation supported

## Monitoring
- All deployments are logged in GitHub Actions
- Failed deployments send notifications
- Preview environments are automatically cleaned up when PRs are closed

## Best Practices

### Commit Messages
- Use `[skip ci]` for documentation updates
- Use `[skip ci]` for auto-generated commits
- Include clear descriptions for deployment-triggering commits

### Pull Requests
- Test changes in preview environment before merging
- Close PRs promptly to clean up preview environments
- Use draft PRs for work-in-progress to avoid unnecessary deployments

### Branch Strategy
- `main` branch is protected and requires PR reviews
- Feature branches should target `main`
- Hotfixes should go directly to `main` with proper testing

## Troubleshooting

### Failed Deployments
1. Check GitHub Actions logs for error details
2. Verify Azure Static Web Apps configuration
3. Ensure all required secrets are configured

### Preview Environment Issues
1. Check if PR is still open
2. Verify Azure Static Web Apps API token permissions
3. Review app configuration in `staticwebapp.config.json`

### Performance Issues
- Workflow includes concurrency limits to prevent resource conflicts
- Use `[skip ci]` for non-deployment commits
- Monitor Azure Static Web Apps usage quotas
