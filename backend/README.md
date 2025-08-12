# GreenCart Backend (Express + Mongoose)

This project is the backend for the GreenCart Logistics assessment. It includes models, services, controllers, JWT auth, simulation logic, seed script, unit tests, and API routes.

## Quick start
1. copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. `npm install`
3. Place `drivers.csv`, `routes.csv`, `orders.csv` in `./data` (root of project).
4. `npm run seed` to populate DB.
5. `npm run dev` to start server.

## Simulation endpoint
POST `/api/simulate` (protected)
```json
{ "numberOfDrivers": 6, "start_time": "09:00", "max_hours_per_driver": 8 }
```

## Tests
`npm test` runs unit tests (jest). Tests mock Mongoose models for simulation logic.

## Tests  Credential login toenter
    email: 'admin@example.com',
    password: '123456',
