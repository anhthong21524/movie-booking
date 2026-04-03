# Contributing Guide

This project uses a simple Git flow designed to keep `main` stable for production while allowing feature work to move independently.

The repository now uses `develop` as the active integration branch.

## Branch Strategy

- `main`: production branch
- `develop`: integration branch
- `feature/*`: feature branches
- `fix/*`: bug fix branches
- `chore/*`: maintenance, tooling, and infrastructure changes

## Workflow

### 1. Start from `develop`

Create all new work from `develop`, not from `main`.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

Examples:

- `feature/auth-login`
- `feature/booking-flow`
- `fix/header-layout`
- `chore/vercel-config`

### 2. Work on a focused branch

- Keep each branch scoped to one feature or one clear change
- Prefer small, reviewable commits
- Push the branch and open a pull request into `develop`

## Pull Request Rules

- `feature/*` -> `develop`
- `fix/*` -> `develop`
- `chore/*` -> `develop`
- `develop` -> `main` only when preparing a release

Do not merge feature branches directly into `main`.
Do not merge `fix/*` or `chore/*` branches directly into `main`.

## Release Flow

When multiple completed features are ready to go live:

1. Ensure `develop` contains all approved feature work
2. Open a pull request from `develop` into `main`
3. Review and merge that PR
4. Vercel deploys production from `main`

This makes `main` the release branch and `develop` the integration branch.

## Current Branch Roles

- `main` is reserved for production-ready releases only
- `develop` is the branch where completed work is integrated before release
- all day-to-day work should branch from `develop`

## Commit Message Style

Use short, clear commit messages.

Examples:

- `feat: add movie detail layout`
- `fix: prevent layout shift on route change`
- `chore: update vercel ignore rules`

## Deployment Notes

- Vercel production deploys from `main`
- `develop` is used for integration and pre-release validation
- feature branches can be used for preview deployments and review

## Team Agreement

This repository follows these working rules:

- production-ready code lives on `main`
- ongoing integrated work lives on `develop`
- all new work starts from `develop`
- releases happen by merging `develop` into `main`
