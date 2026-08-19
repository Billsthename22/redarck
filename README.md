# Redack Nation

Redack Nation is a Next.js ecommerce site for selling fashion products and art pieces. Customers can browse the collection, view product details, configure available options, add shop products to cart, and pay through Paystack. Admin users can manage shop products, manage art listings, and review paid order details.

## What The Site Does

- Displays a public storefront with home, shop, art, contact, and custom order flows.
- Lets customers view individual products with image galleries, available colors, sizes, and related products.
- Supports a cart sidebar for product checkout.
- Sends product checkout payments to Paystack.
- Records successful paid orders in MongoDB.
- Shows paid orders in the admin details page with customer, delivery, product, payment, and transaction reference data.
- Allows CSV export of paid orders from the admin details page.
- Lets admins create products and art entries with image uploads.

## Recent Changes

- Caps no longer require size selection.
- Cap products still support color selection before add to cart.
- Cap cart items are saved without a selected size.
- Custom size ordering is hidden for caps.
- Standard/Premium quality selection is limited to shirts and hoodies.
- Order records now support `paymentDetails` for Paystack bank/transfer information.
- Paystack verification now backfills missing `paymentDetails` on existing orders when a reference is verified again.
- Admin payment details now show payment channel and bank/transfer fields.
- CSV export now includes payment channel and bank/transfer fields.
- A Paystack webhook route has been added so successful payments can be recorded even when a customer does not return to the success page.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- MongoDB with Mongoose
- Cloudinary for product/art image uploads
- Paystack for checkout payments
- Resend for contact email handling

## Main Routes

- `/` - public home page
- `/shop` - product catalog
- `/product/[id]` - product detail page
- `/Art/[id]` - art detail page
- `/customorder` - custom order flow
- `/contact` - contact page
- `/adminlogin` - admin login page
- `/signup` - admin signup page
- `/adminshop` - manage shop products
- `/adminart` - manage art listings
- `/admindetails` - paid order details
- `/payment/success` - Paystack return page that verifies a payment reference

## API Routes

- `POST /api/login` - validates admin email/password
- `POST /api/signup` - creates an admin account and returns a JWT
- `GET /api/products` - lists products
- `POST /api/products` - creates a product
- `GET /api/products/[id]` - fetches a product
- `PUT /api/products/[id]` - updates a product
- `GET /api/arts` - lists art
- `POST /api/arts` - creates art
- `GET /api/arts/[id]` - fetches art
- `PUT /api/arts/[id]` - updates art
- `POST /api/paystack/initialize` - starts Paystack checkout
- `GET /api/paystack/verify?reference=...` - verifies a Paystack transaction and records/backfills an order
- `POST /api/paystack/webhook` - receives signed Paystack success events and records orders
- `GET /api/orders` - lists recorded paid orders
- `POST /api/contact` - sends contact form email

## Environment Variables

Create `.env.local` for local development:

```env
MONGO_URI=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

PAYSTACK_SECRET_KEY=

RESEND_API_KEY=
EMAIL_TO=

JWT_SECRET=
```

Do not expose secret values with `NEXT_PUBLIC_`. These values are server-side secrets.

## Local Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Type-check the project:

```bash
npx tsc --noEmit
```

Note: the current `npm run lint` script uses `next lint`, which is incompatible with the installed Next CLI version and fails before checking code.

## Paystack Flow

Checkout starts from the cart sidebar:

1. Customer enters name, email, and delivery address.
2. Cart items are sent to `POST /api/paystack/initialize`.
3. The server recalculates product prices from MongoDB.
4. Paystack receives amount, callback URL, customer metadata, delivery address, and line items.
5. Customer pays on Paystack.
6. Paystack redirects to `/payment/success?reference=...`.
7. The success page calls `/api/paystack/verify`.
8. The verify route confirms the transaction with Paystack and creates or updates an `Order`.

The webhook route provides the more reliable server-to-server path:

1. Paystack sends `charge.success` to `/api/paystack/webhook`.
2. The route validates `x-paystack-signature` using `PAYSTACK_SECRET_KEY`.
3. If the payment is successful, it upserts the order by transaction reference.

Set the webhook URL in Paystack:

```text
https://your-domain.com/api/paystack/webhook
```

Webhooks require a public URL. They do not work directly against `localhost` unless a tunnel such as ngrok is used.

## Backfilling Missing Orders

Older paid transactions may be missing from `/admindetails` if the customer paid on Paystack but never returned to `/payment/success`.

To backfill one missing order:

1. Copy the transaction reference from Paystack.
2. Open:

```text
https://your-domain.com/payment/success?reference=PAYSTACK_REFERENCE
```

3. Return to `/admindetails`.
4. Click Refresh.

The verify route will fetch the transaction from Paystack and save it if it was missing. If the order already exists but lacks bank/transfer details, it will backfill `paymentDetails`.

## Admin Authentication Status

The current admin authentication is incomplete.

What exists:

- Admin passwords are hashed with bcrypt.
- `/api/login` validates email and password.
- The login page stores `isAdmin=true` in `localStorage`.
- The admin navbar uses `localStorage` to decide whether to show admin links.

What is missing:

- Login does not create a secure server-side session.
- Login does not set an `httpOnly` cookie.
- There is no `middleware.ts` protecting admin pages.
- Admin API routes such as `/api/orders`, product creation, and art creation are not protected server-side.

This means admin links are hidden in the UI, but the admin pages and APIs should still be protected before production use.

## Product Rules

- Shirts and hoodies can use Standard/Premium quality.
- Premium quality adds to the product price during checkout.
- Caps do not require size.
- Caps can be added to cart with color only.
- Art items are not included in the normal cart checkout flow.

## Order Data

Paid orders are stored with:

- Paystack reference
- Customer name
- Email
- Delivery address
- Amount paid
- Currency
- Status
- Paid timestamp
- Purchased line items
- Payment details such as channel, bank, sender bank, receiver bank, and receiver account number when Paystack provides them

The admin details page reads from MongoDB through `/api/orders`, so only transactions recorded in the `orders` collection appear there.
