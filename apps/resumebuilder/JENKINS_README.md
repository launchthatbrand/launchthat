# Jenkins CI/CD Setup for ResumeBuilder

This document explains how the Jenkins CI/CD pipeline is set up to deploy the resumebuilder app from our monorepo to the client's repository.

## Overview

The setup allows us to:

1. Develop the resumebuilder app as part of our monorepo, using workspace dependencies
2. Automatically deploy changes to the client's separate repository
3. Transform package.json to remove workspace references before deployment, making the code ready for Vercel deployment

## Prerequisites

For this to work, you need to set up the following in Jenkins:

1. Credentials:

   - `RESUMEBUILDER_SSH_CREDS`: SSH credentials for accessing the client repository
   - `RESUMEBUILDER_REPO_URL`: URL of the client's Git repository

2. Jenkins Plugin Requirements:
   - Git plugin
   - Pipeline plugin
   - Credentials plugin
   - SSH Agent plugin

## How It Works

### Jenkins Pipeline Flow

1. **Detect Changes**: The pipeline detects changes in the `apps/resumebuilder` directory
2. **Install Dependencies**: Dependencies are installed using pnpm
3. **Transform**: The package.json is modified to replace workspace references with proper versions based on monorepo configuration
4. **Deploy**: The app with transformed dependencies is pushed to the client repository, ready for Vercel deployment

> Note: The build stage is currently commented out as we're just syncing the code. Uncomment it in the Jenkinsfile when you need to build the app before deployment.

### Package.json Transformation

The pipeline intelligently transforms dependencies:

1. **Workspace Dependencies (`workspace:*`)**

   - For internal `@acme/*` packages: Extracts actual version from the package's package.json
   - Example: `"@acme/ui": "workspace:*"` → `"@acme/ui": "^0.1.0"`

2. **Catalog Dependencies**

   - Simple catalog: `"react": "catalog:"` → Uses version from pnpm-workspace.yaml
   - Named catalog: `"react": "catalog:react18"` → Uses version from the named catalog in pnpm-workspace.yaml
   - Example: `"react": "catalog:react18"` → `"react": "18.3.1"`

3. **Other Dependencies**
   - Unchanged: Regular dependencies maintain their original version specifications

This ensures that the client repository's package.json can be directly used with npm/pnpm install without requiring the monorepo structure.

### Development Workflow

1. Work in the monorepo as normal, using workspace references
2. Commit and push changes to our monorepo
3. Jenkins will automatically deploy to the client repository with proper dependency versions

## Deploying to Vercel

Since the app was originally part of a monorepo but is now in a standalone repository, deploying to Vercel requires special considerations to handle workspace dependencies correctly.

### Recommended Approach: Pre-build in Jenkins

To avoid dependency issues on Vercel, the recommended approach is to pre-build the app in Jenkins before pushing to the client repository:

1. **Modify the Jenkinsfile to include building**:

   ```groovy
   stage('Build') {
     steps {
       // Build the app in our monorepo where dependencies are available
       sh 'cd ${APP_DIR} && pnpm build'
     }
   }
   ```

2. **Configure Vercel to Skip Build**:

   - In Vercel, go to "Project Settings" → "Build & Development Settings"
   - Set "Build Command" to `echo "Using pre-built app - skipping build"`
   - Keep the "Output Directory" as `.next`
   - This tells Vercel to use the pre-built output directly without rebuilding

3. **Include the `.next` directory in the client repository**:
   - Update the `rsync` command in the Jenkinsfile to include the `.next` directory:
   ```bash
   rsync -av --exclude='.git' --exclude='node_modules' --exclude='.turbo' ${APP_DIR}/ ${TEMP_DIR}/
   ```

This approach avoids Vercel trying to rebuild the app, which would likely fail due to the workspace dependency references.

### Alternative: Self-contained Client Repository

If you prefer to have Vercel build the app:

1. **Prepare a fully self-contained repository**:

   - Copy all required internal package code into the client repository
   - Use a structure like `/packages/@acme/ui`
   - Modify imports to point to the local copies
   - Update the build command in the Jenkinsfile to handle this structure

2. **Update next.config.js**:

   ```javascript
   /** @type {import('next').NextConfig} */
   const config = {
     transpilePackages: [], // No need if packages are included locally
     // other configs...
   };

   module.exports = config;
   ```

3. **Configure Vercel Normally**:
   - Framework: Next.js
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`

### Method: Vercel CLI Deployment with Pre-built App

You can also use Vercel CLI to deploy directly from Jenkins:

1. **Install Vercel CLI in Jenkins**:

   ```bash
   npm install -g vercel
   ```

2. **Add Vercel Token to Jenkins Credentials**:

   - Create a Vercel API token in the Vercel dashboard
   - Add it as a credential in Jenkins (e.g., `VERCEL_TOKEN`)

3. **Add Deployment Stage to Jenkinsfile**:
   ```groovy
   stage('Deploy to Vercel') {
     steps {
       withCredentials([string(credentialsId: 'VERCEL_TOKEN', variable: 'VERCEL_TOKEN')]) {
         sh '''
           cd ${TEMP_DIR}
           # Deploy with pre-built app
           vercel --token ${VERCEL_TOKEN} --prod --build=false
         '''
       }
     }
   }
   ```

### Important Considerations for Monorepo Deployments

1. **next.config.js Adjustments**:

   - Remove any monorepo-specific configurations (e.g., transpilePackages for workspace deps)
   - For example, change `transpilePackages: ['@acme/ui', '@acme/auth']` to an empty array or remove

2. **Package Resolution**:

   - When pre-building, dependencies must be resolved in the Jenkins environment
   - Environment variables needed for the build must be available in Jenkins

3. **Vercel Configuration File**:
   - Consider adding a `vercel.json` file to configure deployment behavior:
   ```json
   {
     "buildCommand": null,
     "outputDirectory": ".next"
   }
   ```

## Manual Deployment (if needed)

If you need to manually trigger a deployment:

1. Go to the Jenkins dashboard
2. Select the resumebuilder pipeline
3. Click "Build Now"

## Troubleshooting

Common issues:

1. **Missing Credentials**: Ensure all required credentials are configured in Jenkins
2. **Build Failures**: Check the console output for specific errors
3. **Deployment Issues**: Verify SSH access to the client repository
4. **Package.json Transformation Errors**:
   - Check if pnpm-workspace.yaml is properly formatted
   - Ensure internal packages have version fields in their package.json files

### Resolving Workspace Package Dependencies

If you encounter issues with workspace dependencies:

1. **Local Package Clone**:

   - Copy the source code of internal packages into the client repository
   - Use a directory structure like `packages/@acme/ui`
   - Update imports to point to local versions

2. **Package Publishing**:
   - Consider publishing internal packages to a private npm registry
   - Update package.json to reference the published versions

## Maintenance

To update the pipeline:

1. Edit the `Jenkinsfile` in the `apps/resumebuilder` directory
2. Commit and push changes to the monorepo
3. Jenkins will use the updated pipeline on the next build
