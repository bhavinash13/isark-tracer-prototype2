# ISARK Tracer - Demo Guide

## Overview
ISARK Tracer is a comprehensive supply chain transparency platform that connects farmers, processors, testers, and regulators in a seamless ecosystem of trust and traceability.

## Demo Flow

### 1. Landing Page
- Visit the home page to see the role selection interface
- Four main roles: Farmer, Lab Tester, Processor, Regulator
- Each role has distinct features and dashboards

### 2. Authentication
- Click any role to go to the login/signup page
- Demo credentials are provided on the auth page:
  - **Farmer**: farmer1@example.com / 1234
  - **Lab Tester**: lab1@example.com / 1234
  - **Processor**: proc1@example.com / 1234
  - **Regulator**: regulator@example.com / 1234

### 3. Role Dashboards

#### Farmer Dashboard
- View assigned herb batches
- Add new batches with name, location, and photos
- Approve batches for lab testing
- View IoT metrics (temperature, humidity)
- Generate QR codes for batch tracking

#### Lab Tester Dashboard
- View assigned batches for testing
- Add lab results (moisture content, pesticide residue, DNA verification)
- Upload test certificates
- Update batch status after testing

#### Processor Dashboard
- View batches assigned for processing
- Add processing steps (drying, grinding, storage, packaging)
- Track processing timeline
- Mark batches ready for shipment

#### Regulator Dashboard
- View all batches across the supply chain
- Filter and search by batch ID, herb type, or farmer
- Monitor compliance status
- View sustainability scores
- Access analytics and charts

### 4. Batch Details
- Click "View Details" on any batch to see comprehensive information
- View IoT metrics, lab results, processing steps
- See blockchain verification badges
- Access QR code for provenance tracking

### 5. Provenance Page
- Access via QR code or direct link: `/provenance/[productId]`
- Complete supply chain timeline
- Blockchain verification status
- Detailed information for each stage

## Key Features Demonstrated

### Real-time Tracking
- IoT sensor data (temperature, humidity)
- Timestamp tracking for all events
- Live status updates

### Quality Assurance
- Lab testing results
- Pesticide residue checks
- DNA verification
- Moisture content analysis

### Blockchain Integration
- Cryptographically verified data
- Immutable transaction records
- Tamper-proof supply chain history

### Regulatory Compliance
- Compliance status tracking
- Sustainability scoring
- Analytics and reporting
- Filter and search capabilities

### QR Code Integration
- Downloadable QR codes
- Direct links to provenance pages
- Mobile-friendly access

## Technical Implementation

### State Management
- Session-based authentication
- React state for real-time updates
- Mock data integration

### Responsive Design
- Mobile-first approach
- Tailwind CSS styling
- Clean, modern interface

### Component Architecture
- Reusable QR code component
- Network diagram visualization
- Modular dashboard components

## Demo Scenarios

### Scenario 1: Complete Supply Chain Flow
1. Login as Farmer → Add new batch → Approve for testing
2. Login as Lab Tester → Add test results → Mark as tested
3. Login as Processor → Add processing steps → Mark ready for shipment
4. Login as Regulator → View compliance status → Check analytics

### Scenario 2: Provenance Tracking
1. Generate QR code for any batch
2. Scan/access QR code to view provenance page
3. Trace complete supply chain timeline
4. Verify blockchain authenticity

### Scenario 3: Compliance Monitoring
1. Login as Regulator
2. Filter batches by compliance status
3. View sustainability scores
4. Check analytics and charts

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open http://localhost:3000
5. Follow the demo flow above

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Session-based (demo)
- **Data**: Mock data with realistic scenarios
- **Components**: Custom reusable components

This demo showcases a complete supply chain transparency platform with all the requested features and a seamless user experience across all stakeholder roles.
