# LiteSourcing MVP Submission

## 1. Setup Instructions
* **Prerequisites:** Node.js (v18+), npm/pnpm, and a local database instance (PostgreSQL).
* **Environment:** Copy `.env.example` to `.env` and configure your database connection string.
* **Installation:** `npm install` (Root directory).
* **Running:**
    * `npm run dev:backend` (Starts the Fastify API)
    * `npm run dev:frontend` (Starts the React/Vite development server)
* **Seed Data:** Run `npm run seed` to populate the database with the provided test data.

## 2. Tech Stack
* **Frontend:** React, TanStack Router (type-safe navigation), TanStack Query (data fetching/caching), Tailwind CSS, and Shadcn UI.
* **Backend:** Fastify (Node.js), TypeScript, and PostgreSQL.
* **Tooling:** Cursor/Claude for iterative development and code structuring.

## 3. Architecture & Evaluation Criteria
* **Data Modeling:** I designed a relational schema where `Spec Items` act as the central entity, linking `Products` via a `Sourcing Options` join table. This supports an N:M relationship, facilitating direct price and lead-time comparisons.
* **Backend Design:** The API follows a RESTful pattern with strict separation:
    * **Controllers:** Handle request validation and response formatting.
    * **Services:** Encapsulate complex business logic (e.g., dynamic status calculation).
    * **Repositories:** Abstract the database layer, ensuring clean, maintainable data access.
    * **Error Handling:** Global error management returns descriptive 400-level codes for validation/state-transition failures, surfaced in the UI via toasts.
* **Frontend & UX:**
    * **Intuition:** The workspace utilizes breadcrumb navigation and clear, card-based layouts. 
    * **Comparison View:** Centralized sourcing queries allow for side-by-side comparison of supplier options.
    * **Status Management:** I implemented **Server-Derived Status Logic**; status (`Draft` → `Sourcing` → `Quoted` → `Closed`) is calculated dynamically on the backend to serve as a "source of truth," preventing state inconsistencies.
* **Code Quality:** The project enforces strict TypeScript standards with shared `types` between frontend and backend. The codebase is organized by domain (`/domains/project`, `/domains/supplier`), promoting readability and maintainability.
* **Product Sense:** * **Guardrails:** I implemented backend guardrails to prevent invalid transitions (e.g., forcing winning selections before moving to `Quoted`). 
    * **Trade-offs:** With a 3-day constraint, I prioritized the core sourcing workflow—the "happy path"—over peripheral administrative CRUD (e.g., updating categories or deleting legacy items). This ensures the primary user journey is polished and fully functional. 



## 4. What I'd Do With More Time
* **Comprehensive Admin CRUD:** Implement full edit/delete functionality for suppliers, products, and categories.
* **Enhanced Search Experience:** Introduce debounced search and filtering for the Global Catalog to handle large datasets.
* **Advanced Analytics:** Build dashboards aggregating pricing trends across projects to aid long-term procurement decisions.
* **Robust Auth/Roles:** Integrate multi-user support (e.g., "Buyer" vs. "Admin" permissions).
* **UX Refinement:** Add "Untoggle" functionality for winning items to provide more flexibility in the comparison phase, provided it adheres to state-integrity guardrails.

## 5. Deployment
The project has been deployed on [render](https://flumeai-litesourcing-assignment-frontend.onrender.com);

---
*This documentation is structured to walk the evaluator through my decision-making process, highlighting the "why" behind the architecture and my strategic focus on core product value.*
