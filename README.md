# Quotely 🧾

A quote calculator for freelancers: add your services, choose the hours, days or projects, and watch a receipt-style quote update live. Then copy it as text for WhatsApp or save it as a PDF.

Built as a front-end learning project with plain HTML, CSS, and JavaScript (no frameworks). It is not tied to any company: any freelancer can add and remove their own services.

https://nathaliadebona.github.io/quotely/

## Features

- Add and remove your own services, each with a name and a rate
- Charge per hour, per day, or per project, with the label adapting to the unit (singular and plural)
- Adjust the quantity of each service with − and + buttons
- "Urgent" toggle that adds a 20% surcharge to the total
- Receipt that updates as you type: brand name, client name, validity (7, 15 or 30 days), payment method, and optional notes
- Copy the quote as plain text, ready to paste into WhatsApp
- Download the quote as a PDF through the browser's print dialog, with print styles that show only the receipt
- Empty state messages when there are no services or none selected
- Receipt-style design with a tilted paper, a hard shadow, a zigzag bottom edge, and a stamp
- Responsive layout (mobile and desktop)
- Accessibility basics: a native `<dialog>` for the add service form, `aria-pressed` on toggle buttons, `aria-expanded` on the download panel, `aria-live` on the quantities, and labels linked to inputs

## How the total is calculated

- Each service total is its quantity (hours, days, or projects) times its rate
- The subtotal is the sum of all services with a quantity above zero
- With "Urgent" on, 20% of the subtotal is added as a separate line
- The total is the subtotal plus the surcharge, if any

## Tech stack

- HTML5, CSS3, and JavaScript, no frameworks
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) and [Space Mono](https://fonts.google.com/specimen/Space+Mono) (Google Fonts)

## Project structure

- `index.html`: page structure (services panel, download panel, receipt, and the add service dialog)
- `style.css`: styles, with colors and fonts as CSS variables, mobile first, plus print styles
- `script.js`: services data and rendering, receipt calculations, form validation, text generation, and the copy and PDF buttons

## Running locally

1. Clone the repository.
2. Open `index.html` in your browser (or use a local server such as VS Code's "Live Server" extension).

No build step or dependencies needed.

## Note

Your services and quote data are not saved: reloading the page brings back the three example services and clears the receipt fields.

## Screenshots

_Coming soon._

---

Personal learning project, built by [Nathalia](https://github.com/nathaliadebona).
