# LiteSourcing — Take-Home Interview Project

## Overview

You're building an internal tool for a procurement team at a construction sourcing company. Their job is to find the best suppliers and prices for materials needed across multiple projects. Today they manage everything in spreadsheets — you're building the first version of a proper tool.

**Time**: 3 days
**Scope**: Full-stack web application (frontend + backend)
**Stack**: Your choice — use whatever you're most productive with

---

## The Problem

A sourcing team manages relationships with dozens of suppliers, each offering different products at different prices. When a new construction project comes in, the team gets a list of required materials (called "spec items"). For each spec item, they need to:

1. Search across suppliers to find who sells a matching product
2. Compare prices, lead times, and suppliers
3. Pick the best option

They do this for every item, across multiple projects running simultaneously.

---

## What the Tool Should Do

### 1. Supplier Directory

The team works with many suppliers. Each supplier has a name, country, website, and a catalog of products they sell. Each product in the catalog has a name, category (e.g. "Electrical", "Plumbing", "HVAC"), unit price, currency, unit of measure (e.g. "meter", "piece", "kg"), and lead time in days.

Users should be able to:
- Browse and search suppliers
- View a supplier's product catalog
- Add new suppliers and add products to their catalog

### 2. Project Workspace

The team manages multiple projects at once. Each project has a name, a buyer/client name, and a list of required materials called "spec items." A spec item is something like _"500 meters of 4mm copper cable"_ — it has a name, description, category, quantity, and unit of measure.

Users should be able to:
- Create and manage projects
- Add spec items to a project
- See all spec items for a project at a glance

### 3. Sourcing Workflow

This is the core of the tool. For each spec item, the user needs to find potential supplier products and attach them as "sourcing options." A sourcing option connects a spec item to a specific supplier's product, with a quoted price, total cost, and lead time.

Users should be able to:
- Search across all suppliers' products to find matches for a spec item
- Attach one or more sourcing options to a spec item
- Compare sourcing options for a spec item (price, lead time, supplier)
- Select a winning sourcing option for each spec item

### 4. Project Status & Summary

Projects move through stages: **Draft → Sourcing → Quoted → Closed**. These transitions should have sensible guardrails (e.g. a project shouldn't be marked "Quoted" if its spec items don't have selected sourcing options).

Users should be able to:
- See a project-level summary: total estimated cost, number of suppliers involved, longest lead time across selected options
- Move a project through its lifecycle

---

## Seed Data

A `seed_data.json` file is included with ~10 suppliers and ~80 products across several categories. Use this to populate your database so you don't spend time inventing test data. How you import it is up to you.

---

## What We're Looking For

We're evaluating your ability to design and build a working product, not just write code. Specifically:

- **Data modeling** — How you structure the data and relationships
- **Backend design** — API structure, validation, error handling, separation of concerns
- **Frontend & UX** — Is the tool intuitive and usable? Is the search experience good? Is the comparison view actually helpful?
- **Code quality** — Organization, readability, maintainability
- **Product sense** — Edge cases, guardrails, smart tradeoffs given the time constraint
- **Communication** — Does your README explain your thinking?

There is no single "right" architecture or design. Two candidates will produce very different solutions, and that's the point.

---

## Deliverables

1. A working web application (frontend + backend)
2. A filled-out version of the **Submission Notes** section below
3. Your code in a Git repository (share a link or zip)
4. If you have used any AI tool (Cursor / Claude / Windsurf / Copilot) share the complete conversation history

The application should be runnable locally with minimal setup. Ideally a single command (or two — one for backend, one for frontend).

---

## Submission Notes

_Fill this out before submitting._

### Setup Instructions

<!-- How to install dependencies and run the application locally -->

### Tech Stack

<!-- What you chose and why -->

### Architecture Decisions

<!-- How you structured the backend, frontend, and data model. What tradeoffs did you make? -->

### What I'd Do With More Time

<!-- What would you improve, add, or change if you had another week? -->
