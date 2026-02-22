/**
 * ====================================================================
 *  JIRA: SVC-1932 — Fix Dockerfile Multi-Stage Build
 * ====================================================================
 *  P1 | Points: 2 | Labels: devops, javascript (build script)
 *
 *  Docker image is 1.2GB because build stage artifacts included in
 *  production image. Also runs as root.
 *
 *  ACCEPTANCE CRITERIA:
 *  - [ ] Multi-stage build — production image < 200MB
 *  - [ ] Non-root user
 *  - [ ] Only production dependencies in final image
 * ====================================================================
 */

// This file represents the Dockerfile analysis and build script
// The actual Dockerfile is embedded as a template string

const DOCKERFILE = `
FROM node:18

# Should add: RUN adduser --system appuser && USER appuser

WORKDIR /app

COPY . .

RUN npm install


EXPOSE 3000
CMD ["node", "index.js"]
`;

class DockerBuildValidator {
    validate(dockerfile) {
        const issues = [];

        if (!dockerfile.includes('AS builder')) {
            issues.push('Missing multi-stage build');
        }
        if (dockerfile.includes('npm install') && !dockerfile.includes('--production')) {
            issues.push('Installing devDependencies in production');
        }

        return issues;
    }
}

module.exports = { DockerBuildValidator, DOCKERFILE };
