# OrderFlow CRM

Full-stack CRM for tracking client orders and deliveries.

## Features

- **Dashboard** — summary stats, upcoming deliveries with urgency indicators (overdue / within 3 days / on track), and a recent orders table with sortable columns
- **Clients** — create, view, edit, and delete clients; per-client order history
- **Orders** — full order lifecycle with status tracking (Pending → In Progress → Shipped → Delivered / Cancelled), delivery dates, product line items, and total value
- **Status management** — update order status inline from the dashboard or client detail page without leaving the view
- **Search & sort** — filter orders by client name, sort by status or delivery date

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, Server Actions)
- [Prisma](https://www.prisma.io) ORM
- [PostgreSQL](https://www.postgresql.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) component library

## Running Locally

**Prerequisites:** Node.js 18+, a running PostgreSQL instance

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/limpeic/orderflow-crm.git
   cd orderflow-crm
   npm install
   ```

2. Set the database URL in a `.env` file:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/orderflow"
   ```

3. Apply the schema and (optionally) seed sample data:

   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).
