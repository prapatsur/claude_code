# CLAUDE.md

> **Purpose**: This file provides comprehensive documentation for AI assistants (like Claude) working with this codebase. It explains the repository structure, development workflows, coding conventions, and key patterns to follow.

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Codebase Structure](#codebase-structure)
3. [Tech Stack](#tech-stack)
4. [Development Workflow](#development-workflow)
5. [Coding Conventions](#coding-conventions)
6. [Testing Strategy](#testing-strategy)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)
9. [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## Repository Overview

**Status**: New Repository (No code yet)

**Purpose**: [To be defined when code is added]

**Key Features**:
- [To be documented as features are implemented]

**Target Audience**: [To be defined]

---

## Codebase Structure

```
/
├── .git/                    # Git version control
└── CLAUDE.md               # This file - AI assistant documentation
```

### Directory Structure Guidelines (for future development)

When code is added to this repository, organize it following these recommended patterns:

```
/
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── services/           # Business logic and services
│   ├── utils/              # Utility functions
│   ├── types/              # Type definitions
│   └── config/             # Configuration files
├── tests/                  # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
├── docs/                   # Documentation
├── scripts/                # Build and deployment scripts
├── .github/                # GitHub workflows and templates
└── [config files]          # package.json, tsconfig.json, etc.
```

---

## Tech Stack

**Status**: To be determined when code is added

### Recommended Sections

- **Language**: [e.g., TypeScript, Python, Go, Rust]
- **Framework**: [e.g., React, Express, FastAPI, etc.]
- **Build Tools**: [e.g., Webpack, Vite, esbuild]
- **Package Manager**: [e.g., npm, yarn, pnpm, pip, cargo]
- **Database**: [e.g., PostgreSQL, MongoDB, Redis]
- **Testing**: [e.g., Jest, Pytest, Vitest]
- **Linting/Formatting**: [e.g., ESLint, Prettier, Black, rustfmt]

---

## Development Workflow

### Setting Up the Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd claude_code

# [Add setup steps when dependencies are added]
# Example:
# npm install
# cp .env.example .env
# npm run dev
```

### Branch Strategy

- **main/master**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: Feature branches (e.g., `feature/user-authentication`)
- **bugfix/**: Bug fix branches (e.g., `bugfix/login-error`)
- **hotfix/**: Urgent production fixes
- **claude/**: AI assistant working branches (temporary)

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(auth): add JWT authentication
fix(api): resolve null pointer in user endpoint
docs(readme): update installation instructions
```

---

## Coding Conventions

### General Principles

1. **Write Clear, Self-Documenting Code**
   - Use descriptive variable and function names
   - Prefer clarity over cleverness
   - Comment why, not what

2. **Follow DRY (Don't Repeat Yourself)**
   - Extract common logic into reusable functions
   - Use composition over inheritance

3. **Error Handling**
   - Always handle errors explicitly
   - Provide meaningful error messages
   - Log errors with appropriate context

4. **Security Best Practices**
   - Never commit secrets or API keys
   - Validate and sanitize user input
   - Use parameterized queries to prevent SQL injection
   - Implement proper authentication and authorization
   - Follow OWASP Top 10 guidelines

### Code Style Guidelines

**[To be defined based on chosen tech stack]**

Example for TypeScript/JavaScript:
```typescript
// Use const by default, let when reassignment is needed
const userName = "Alice";
let counter = 0;

// Use arrow functions for callbacks
const numbers = [1, 2, 3].map(n => n * 2);

// Use async/await over raw promises
async function fetchData() {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

// Use TypeScript types for better safety
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // implementation
}
```

### File Naming Conventions

- **Source files**: `camelCase.ts`, `PascalCase.tsx` (for React components)
- **Test files**: `*.test.ts`, `*.spec.ts`
- **Config files**: `kebab-case.config.js`
- **Constants**: `UPPER_SNAKE_CASE`

---

## Testing Strategy

### Test Pyramid

1. **Unit Tests** (70%)
   - Test individual functions and components
   - Fast, isolated, deterministic
   - Mock external dependencies

2. **Integration Tests** (20%)
   - Test interactions between modules
   - Verify API contracts
   - Test database operations

3. **End-to-End Tests** (10%)
   - Test critical user journeys
   - Verify entire system works together
   - Run in CI/CD pipeline

### Running Tests

```bash
# [Add commands when testing is set up]
# npm test              # Run all tests
# npm test:unit         # Run unit tests only
# npm test:watch        # Run tests in watch mode
# npm test:coverage     # Generate coverage report
```

### Coverage Requirements

- Aim for 80%+ code coverage
- All critical paths must be tested
- Test edge cases and error conditions

---

## Common Tasks

### Adding a New Feature

1. Create a feature branch
   ```bash
   git checkout -b feature/feature-name
   ```

2. Implement the feature following coding conventions

3. Write tests for the new functionality

4. Update documentation if needed

5. Commit changes following commit conventions

6. Push and create a pull request
   ```bash
   git push -u origin feature/feature-name
   ```

### Fixing a Bug

1. Create a bugfix branch
   ```bash
   git checkout -b bugfix/issue-description
   ```

2. Write a failing test that reproduces the bug

3. Fix the bug

4. Ensure all tests pass

5. Commit and push

### Refactoring Code

1. Ensure comprehensive test coverage exists

2. Make incremental changes

3. Run tests after each change

4. Keep refactoring commits separate from feature/bug commits

---

## Troubleshooting

### Common Issues and Solutions

**[To be populated as the codebase grows]**

Example structure:

#### Issue: [Problem Description]

**Symptoms**:
- [What you observe]

**Cause**:
- [Root cause]

**Solution**:
```bash
# Commands or code to fix
```

---

## Important Notes for AI Assistants

### Key Guidelines

1. **Always Read Before Writing**
   - Use the Read tool before making changes to files
   - Understand context before proposing solutions

2. **Maintain Code Quality**
   - Follow existing patterns and conventions
   - Don't introduce security vulnerabilities
   - Write tests for new functionality

3. **Use Appropriate Tools**
   - Use specialized tools (Read, Edit, Write) over bash commands
   - Run multiple independent operations in parallel
   - Use Task tool for complex, multi-step operations

4. **Git Operations**
   - Work on designated feature branches
   - Never force push to main/master
   - Use conventional commit messages
   - Push with `git push -u origin <branch-name>`

5. **Communication**
   - Provide clear explanations of changes
   - Reference file paths and line numbers (e.g., `src/index.ts:42`)
   - Ask for clarification when requirements are ambiguous

6. **Security Awareness**
   - Never commit sensitive information
   - Validate user input
   - Use parameterized queries
   - Follow OWASP guidelines
   - Implement proper error handling

### Tool Preferences

- **File Reading**: Use `Read` tool (not `cat`)
- **File Editing**: Use `Edit` tool (not `sed`/`awk`)
- **File Writing**: Use `Write` tool (not `echo >`)
- **Searching**: Use `Grep` tool (not `grep` command)
- **File Finding**: Use `Glob` tool (not `find` command)

### Task Management

- Use `TodoWrite` tool for multi-step tasks
- Mark tasks as in_progress before starting
- Mark tasks as completed immediately after finishing
- Keep only one task in_progress at a time

### Code Review Checklist

Before committing changes, verify:

- [ ] Code follows project conventions
- [ ] No security vulnerabilities introduced
- [ ] Tests written and passing
- [ ] No secrets or sensitive data committed
- [ ] Error handling is appropriate
- [ ] Code is documented where necessary
- [ ] No unused imports or variables
- [ ] Performance considerations addressed

---

## Maintenance

### Keeping CLAUDE.md Updated

This file should be updated when:

- New technologies are added to the stack
- Architecture patterns change
- New conventions are established
- Common issues and solutions are discovered
- Development workflows are modified

### Version History

- **2025-11-18**: Initial creation for new repository

---

## Additional Resources

### Documentation

- [Add links to relevant documentation as project grows]

### Related Files

- `README.md`: User-facing documentation
- `CONTRIBUTING.md`: Contribution guidelines
- `.github/PULL_REQUEST_TEMPLATE.md`: PR template
- `.github/ISSUE_TEMPLATE/`: Issue templates

### External Resources

- [Project Website]
- [API Documentation]
- [Design System]
- [Deployment Guide]

---

**Last Updated**: 2025-11-18
**Maintainers**: [To be defined]

---

## Template Instructions (Remove this section when repository has code)

This CLAUDE.md file is currently a template for a new repository. As you add code and establish patterns, update the relevant sections with:

1. **Actual file structure** - Replace the example structure with your real directory layout
2. **Chosen tech stack** - Document the languages, frameworks, and tools you're using
3. **Real conventions** - Update coding standards based on your actual codebase
4. **Actual commands** - Replace example commands with real build, test, and deployment commands
5. **Project-specific patterns** - Document architectural decisions and design patterns
6. **Common issues** - Add troubleshooting entries as you encounter and solve problems

**Quick Start for AI Assistants on Established Codebases**:

When analyzing an existing codebase to update this file:

1. Run `Glob` to find configuration files (package.json, requirements.txt, Cargo.toml, etc.)
2. Examine directory structure with `Bash` ls commands
3. Read key configuration files to understand tech stack
4. Search for common patterns with `Grep`
5. Review existing documentation (README, CONTRIBUTING, etc.)
6. Update each section with real, project-specific information
7. Remove this template instructions section
