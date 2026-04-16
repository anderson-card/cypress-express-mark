# Copilot Instructions for cypress-express-mark

## Project Overview
Full-stack task management application with **Express.js API** (port 3333), **web frontend** (port 3000), and **Cypress E2E tests**. Uses TypeORM + SQLite for persistence.

## Architecture & Key Components

### Backend API (`apps/markL/api/src/`)
- **Entry**: `server.js` starts Express on port 3333
- **App Setup**: `app.js` initializes Express with CORS (allows all origins), JSON parsing, routing, and error handling
- **Routing**: `routes.js` defines REST endpoints; uses `TaskController` for all handlers
- **Error Handling**: Custom `AppError` class with statusCode property; async errors via `express-async-errors`
- **Database**: TypeORM with SQLite; config in `ormconfig.json`

### MVC Pattern
- **Controllers**: `TaskController.js` handles HTTP requests/responses
- **Models**: TypeORM entities in `models/Task.js` with decorators (@Entity, @Column, @CreateDateColumn)
- **Repositories**: `TasksRepository.js` extends TypeORM Repository for Task CRUD
- **Database**: Connection setup in `database/index.js`; uses `database.test.sqlite` when NODE_ENV=test

### REST API Endpoints
```
POST /tasks              - Create task
GET /tasks               - List all tasks
PUT /tasks/:id           - Update task
DELETE /tasks/:id        - Delete by ID
DELETE /helper/tasks     - Clear all tasks (dev only)
DELETE /helper/tasks/:name - Delete by name (dev only)
```

### Frontend (`apps/markL/web/`)
- Static HTML + bundle in `assets/` (pre-built with Parcel)
- Entry: `index.html` title expected "Gerencie suas tarefas com Mark L"
- No source files; built assets linked in HTML

### E2E Tests (`cypress/`)
- **Pattern**: Use API calls to setup/cleanup data, then test UI
- **Cleanup before UI**: `cy.request('DELETE', '/helper/tasks')` clears previous test data
- **Base URLs**: API at `http://localhost:3333`, Web at `http://localhost:3000`
- Example in `tasks.cy.js`: DELETE helper endpoint, then visit web and interact with form

## Critical Workflows

### Running Development Stack
```bash
# Terminal 1: Start API (port 3333)
cd apps/markL/api
npm install
npm run dev          # Runs 'node src/server.js'

# Terminal 2: Start Web (port 3000)
cd apps/markL/web
npm install
npm start            # Requires local dev server (not in repo)

# Terminal 3: Run Cypress
cypress open         # Or: npm test (if configured in root package.json)
```

### Database Initialization
```bash
cd apps/markL/api
npm run db:init      # Run migrations from 'database/migrations/'
npm run db:drop      # Drop schema (use for test cleanup)
```

### Running Unit Tests
```bash
cd apps/markL/api
npm test             # Currently "echo" placeholder; actual tests use Jest + Supertest (Task.test.js)
```

## Code Patterns & Conventions

### Task Model
```javascript
// Tasks have: id (UUID), name (string), is_done (boolean), created_at (timestamp)
@Entity("tasks")
class Task {
  @PrimaryColumn() id: string
  @Column() name: string
  @Column() is_done: boolean
  @CreateDateColumn() created_at: Date
}
```

### Request/Response Structure
- **Success**: Status 200-204 with data or empty body
- **Error**: Custom AppError returns `{ message: string }` with statusCode
- **Validation**: Use Yup schemas (dependency installed but not widely used yet)

### E2E Test Setup Pattern
1. **Cleanup**: `cy.request()` to delete existing test data via helper endpoints
2. **Visit**: `cy.visit()` to navigate to web app
3. **Interact**: Use Cypress selectors to click, type, assert UI state
4. **Assert**: Check DOM elements for expected UI updates

### Non-Production Routes
Helper routes (DELETE `/helper/tasks*`) are **only available when `NODE_ENV !== 'production'`**. Always use for test setup to ensure clean state.

## Important Files & Dependencies

| File | Purpose |
|------|---------|
| `apps/markL/api/ormconfig.json` | TypeORM config; specifies SQLite path & migration dirs |
| `apps/markL/api/database/migrations/` | SQL migrations; must run with `npm run db:init` |
| `apps/markL/api/src/app.js` | Express middleware pipeline & error handler |
| `cypress/e2e/tasks.cy.js` | Example E2E test showing cleanup + UI flow |
| `.github/workflows/` | (Not in workspace; CI config would go here) |

## Common Pitfalls & Notes

1. **Port Conflicts**: API expects 3333, Web expects 3000. Check if processes are running.
2. **CORS**: Already wildcard enabled; requests from any origin are accepted.
3. **Database Sync**: Migrations must run before API can access schema. Always run `npm run db:init` after setup.
4. **Test Isolation**: Use helper DELETE endpoints in `beforeEach` or test setup to avoid test pollution.
5. **Web Build**: Frontend is pre-built; modifying source files has **no effect** without rebuild.

## When Adding Features

- **New endpoint**: Add route in `routes.js`, implement in `TaskController.js`, use repository for data
- **New field on Task**: Update model in `models/Task.js`, create migration in `database/migrations/`
- **New test**: Use pattern from `tasks.cy.js`: cleanup → visit → interact → assert
- **Error case**: Throw `AppError` with message and statusCode in controller; middleware catches it

