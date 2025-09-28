export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help</h1>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Use Home → select your role → Login with email/phone and PIN.</li>
          <li>Farmer can add batches; Transporter/Processor can upload photos and capture GPS.</li>
          <li>Lab Tester adds results; Manufacturer aggregates and creates products.</li>
          <li>Regulator views analytics; Customers use QR Scan to view provenance.</li>
        </ul>
      </div>
    </div>
  );
}
