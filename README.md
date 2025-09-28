# ISARK Tracer

Frontend-only prototype SPA for supply chain traceability. Runs fully in the browser using localStorage. No backend, no blockchain.

Tech: React, Next.js (client-only), TailwindCSS, react-router, html5-qrcode, qr-code-styling.

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000

## Features

- Top navbar with EN/HI toggle, auth, and quick routes
- Mock auth with email/phone/userId + 6-digit PIN
- Role dashboards: Farmer, Transporter, Processor, Lab, Manufacturer, Regulator
- Batch detail: photo upload (camera/file) with auto geotag, timeline, actions
- Transporter trip: start/stop with periodic geo pings
- Processor events: method + yield ledger
- Lab: upload PDF, pass/fail toggles, block failing batches
- Manufacturer: aggregate selection, product creation, QR generation, export JSON
- Consumer QRScan: verify by recomputing proof hash from stored data
- Regulator: filters and simple India map heat tiles
- Offline-first: all data in localStorage

## Logins (seed)

- u_f1 / farmer1@isark / 900000001 PIN 111111 (farmer)
- u_t1 PIN 222222 (transporter)
- u_p1 PIN 333333 (processor)
- u_m1 PIN 444444 (manufacturer)
- u_l1 PIN 555555 (lab)
- u_r1 PIN 666666 (regulator)

Data keys: `isark_users`, `isark_batches`, `isark_aggregates`, `isark_products`
