This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Architecture Decisions

## Core Framework

- **Next.js 15.1.6**
- **React 19.0.0**
- **TypeScript** - For type safety and improved developer experience

## Backend & Data Layer

- **Firebase 11.3.0** - Selected as the backend solution for:
  - Real-time database capabilities
  - Built-in authentication
  - Easy integration with frontend

## UI & Styling

- **Ant Design 5.23.4** - Enterprise-grade UI component library providing:

  - Comprehensive component ecosystem
  - Built-in design system
  - Accessibility features
- **Tailwind CSS 3.4.17** - Utility-first CSS framework for:

  - Rapid UI development
  - Consistent styling
  - Reduced CSS bundle size through purging

## Development Environment

- **Turbopack** - Next.js bundler for improved development experience
- **ESLint** - Maintaining code quality and consistency
- **PostCSS** - For modern CSS processing and transformations
