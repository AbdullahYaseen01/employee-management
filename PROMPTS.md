# AI usage disclosure

This file records how AI assistance was used to implement the Employee Management assessment. It contains no credentials, secrets, employee personal data, or private repository information. Seed records in the mock API are fictional.

## Master implementation prompt

The following prompt was the source of the assessment. It was used as the implementation specification.

> Build a complete, production-quality Employee Management frontend according to the following technical assessment.
>
> Do not stop after generating a plan. Inspect the repository, create a concise implementation plan, implement the application, run all validation commands, fix problems caused by the implementation, and provide a final delivery report.
>
> Core objective: a React and TypeScript Employee Management page that allows HR users to view, search, filter, paginate, inspect, add, edit, and deactivate employees, and recover from loading, empty, validation, and API error states.
>
> No backend is required. Use a mock API designed so that it can later be replaced by a real backend without rewriting the feature.
>
> Required stack when the repository is empty: React, TypeScript strict mode, Vite, TanStack Query, React Hook Form, Zod, MSW or equivalent, Vitest, React Testing Library, and `@testing-library/user-event`.
>
> Architecture must be feature-oriented, with separated domain types, API contract, mock implementation, query/mutation hooks, reusable form schema, reusable UI, page orchestration, and tests.
>
> The employee model, list/detail/create/edit/deactivate flows, URL-backed filters, accessibility, demo states, README senior-touch sections, production build, and automated tests are all in scope.

The full numbered specification from the user message (sections 1–24) was followed as the product requirements document.

## Follow-up prompts used during implementation

1. Verify all functions and refresh the UI with a more colorful premium HR look without breaking behavior.
2. Compile the original technical-task PDF into a 3-page client deliverables pack.
3. Push the dashboard bug-fix and UI refresh to GitHub so Vercel can deploy.

## How AI output was reviewed

Generated code was reviewed for:

- Alignment with the assessment’s architecture and data-flow rules
- Replacement of mock API without UI rewrites
- URL state, debounce, pagination reset, and stale-request handling
- Form validation, mutation error recovery, and the absence of false success states
- Accessibility of dialogs, tables, labels, and status badges
- Test coverage against user-visible behavior rather than internals
- Removal of Vite template leftovers and unused assets

## Validation

Generated code was validated through:

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm run test -- --run`
- `npm run build`
- Manual review of the feature structure, mock API contract, and README senior-touch sections

Storybook was not added; see README for the reason.
