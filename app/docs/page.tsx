export default function DocsPage() {
  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <p className="text-sm text-muted-foreground">Built with Next.js, Prisma, and PostgreSQL as a full-stack CRM MVP</p>
        <h1 className="mt-3 text-2xl font-semibold">About OrderFlow CRM</h1>
        <p className="mt-2 text-muted-foreground">
          OrderFlow CRM is a simple order management tool for tracking client orders and deliveries.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The dashboard gives you a quick overview of the business. Four summary cards show total clients,
          total orders, active orders (Pending or In Progress), and delivered orders. Below the cards is a
          table of the 10 most recent orders. You can search by client name and sort the table by status
          or delivery date.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Clients</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Clients page lists everyone you do business with — name, company, email, phone, and how many
          orders they have. Click <span className="font-medium text-foreground">Edit</span> to update their
          details or delete the client. The client detail page also shows all of their orders in one place,
          so you can update order statuses without leaving the client view.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Orders</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The Orders page lists every order with its client, title, current status, total value in IDR,
          and delivery date. You can filter orders by status using the pill buttons at the top, and sort
          by delivery date (newest or oldest first) by clicking the Delivery column header.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Creating and editing orders</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Each order belongs to a client and has a title, status, delivery date, and optional notes.
          The order form includes a product table where you can add multiple line items. Each line has a
          product name, quantity, unit price (in IDR), and an optional note. The total order value is
          calculated automatically from the quantities and prices you enter.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Order statuses</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Every order moves through a fixed set of statuses:
        </p>
        <ol className="space-y-1 text-sm text-muted-foreground list-none">
          {[
            ['Pending', 'The order has been recorded but work has not started.'],
            ['In Progress', 'The order is being prepared or produced.'],
            ['Shipped', 'The order has been sent out for delivery.'],
            ['Delivered', 'The client has received the order.'],
            ['Cancelled', 'The order was cancelled and will not be fulfilled.'],
          ].map(([label, desc]) => (
            <li key={label} className="flex gap-2">
              <span className="font-medium text-foreground w-24 shrink-0">{label}</span>
              <span>{desc}</span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground leading-relaxed">
          On the Orders page and the client detail page, clicking a status badge immediately advances
          the order to the next status in the sequence. You can also set any status directly from the
          order edit form.
        </p>
      </section>
    </div>
  )
}
