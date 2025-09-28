'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
);

const mockManufacturerData = {
  manufacturer: {
    id: 'M001',
    name: 'Ayurveda Wellness Corp',
    location: 'Bangalore, India',
    contact: '+91 80-98765432',
    dashboardStats: {
      totalBatches: 15,
      inProduction: 5,
      processedBatches: 10,
      awaitingQualityCheck: 2,
    },
    rawMaterials: [
      { batchId: 'ASH-F001-2025', herbName: 'Ashwagandha Root', quantity: 45.2, status: 'Received', quality: 'Passed', source: 'Ram Kumar Sharma' },
      { batchId: 'BRA-F003-2025', herbName: 'Brahmi Leaf', quantity: 15.5, status: 'In-Storage', quality: 'Passed', source: 'Lakshmi Devi' },
      { batchId: 'TUL-F005-2025', herbName: 'Tulsi Leaf', quantity: 22.0, status: 'In-Production', quality: 'Pending', source: 'Anil Gupta' },
      { batchId: 'NEE-F010-2025', herbName: 'Neem Leaf', quantity: 20.8, status: 'In-Transit', quality: 'Pending', source: 'Govind Singh' },
      { batchId: 'ASH-F011-2025', herbName: 'Ashwagandha Root', quantity: 45.2, status: 'Received', quality: 'Passed', source: 'Ram Kumar Sharma' },
      { batchId: 'BRA-F013-2025', herbName: 'Brahmi Leaf', quantity: 15.5, status: 'In-Storage', quality: 'Passed', source: 'Lakshmi Devi' },
      { batchId: 'TUL-F015-2025', herbName: 'Tulsi Leaf', quantity: 22.0, status: 'In-Production', quality: 'Pending', source: 'Anil Gupta' },
      { batchId: 'NEE-F020-2025', herbName: 'Neem Leaf', quantity: 20.8, status: 'In-Transit', quality: 'Pending', source: 'Govind Singh' },
      { batchId: 'ASH-F021-2025', herbName: 'Ashwagandha Root', quantity: 45.2, status: 'Received', quality: 'Passed', source: 'Ram Kumar Sharma' },
      { batchId: 'BRA-F023-2025', herbName: 'Brahmi Leaf', quantity: 15.5, status: 'In-Storage', quality: 'Passed', source: 'Lakshmi Devi' },
      
    ],
    finishedGoods: [
      { batchId: 'PROD-A-001', productName: 'Ashwagandha Capsules', quantity: 5000, status: 'Ready for Shipment', quality: 'Passed' },
      { batchId: 'PROD-B-002', productName: 'Brahmi Syrup', quantity: 2500, status: 'Shipped', quality: 'Passed' },
      { batchId: 'PROD-C-003', productName: 'Tulsi Tea Bags', quantity: 8000, status: 'In-Packaging', quality: 'Pending' },
    ],
    products: [
      {
        id: 'P001',
        name: 'Ashwagandha Capsules',
        batchId: 'PROD-A-001',
        herbs: [
          {
            id: 'H001',
            name: 'Ashwagandha Root Extract',
            percentage: 80,
            farmers: [
              { farmerId: 'F001', farmerName: 'Ram Kumar Sharma', batchId: 'ASH-F001-2025', location: 'Village Khargone, Ujjain, MP', quantity: '45.2 kg', testResults: { id: 'T001', grade: 'Premium', purity: '98.5%' }},
              { farmerId: 'F002', farmerName: 'Shyam Patel', batchId: 'ASH-F002-2025', location: 'Dewas, MP', quantity: '38.7 kg', testResults: { id: 'T002', grade: 'Premium', purity: '97.8%' }},
            ],
          },
          {
            id: 'H002',
            name: 'Brahmi Leaf Powder',
            percentage: 20,
            farmers: [
              { farmerId: 'F003', farmerName: 'Lakshmi Devi', batchId: 'BRA-F003-2025', location: 'Wayanad, Kerala', quantity: '15.5 kg', testResults: { id: 'T003', grade: 'Premium', purity: '96.2%' }},
            ],
          },
        ],
      },
      {
        id: 'P002',
        name: 'Brahmi Syrup',
        batchId: 'PROD-B-002',
        herbs: [
          {
            id: 'H003',
            name: 'Brahmi Leaf',
            percentage: 100,
            farmers: [
              { farmerId: 'F003', farmerName: 'Lakshmi Devi', batchId: 'BRA-F003-2025', location: 'Wayanad, Kerala', quantity: '15.5 kg', testResults: { id: 'T003', grade: 'Premium', purity: '96.2%' }},
            ],
          },
        ],
      },
      {
        id: 'P003',
        name: 'Tulsi Tea Bags',
        batchId: 'PROD-C-003',
        herbs: [
          {
            id: 'H004',
            name: 'Tulsi Leaf',
            percentage: 100,
            farmers: [
              { farmerId: 'F004', farmerName: 'Anil Gupta', batchId: 'TUL-F004-2025', location: 'Delhi, India', quantity: '22.0 kg', testResults: { id: 'T004', grade: 'Standard', purity: '94.9%' }},
            ],
          },
        ],
      },
    ],
    herbBreakdown: {
      labels: ['Ashwagandha', 'Brahmi', 'Tulsi', 'Neem', 'Other'],
      datasets: [{
        label: 'Raw Material Volume (kg)',
        data: [45.2, 15.5, 22.0, 20.8, 40.5],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      }]
    },
    shipmentStatus: {
      labels: ['In Transit', 'Received', 'Scheduled'],
      datasets: [{
        label: 'Shipment Count',
        data: [1, 1, 2],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      }]
    },
  },
};

export default function ManufacturerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [manufacturer, setManufacturer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const u = JSON.parse(userData);
      if (u.role === 'manufacturer') {
        setUser(u);
        setManufacturer(mockManufacturerData.manufacturer);
      }
    }
    setLoading(false);
  }, []);

  const handleUpdateQuality = (batchId: string, newStatus: string) => {
    if (!manufacturer) return;
    const updatedMaterials = manufacturer.rawMaterials.map((item: any) =>
      item.batchId === batchId ? { ...item, quality: newStatus } : item
    );
    setManufacturer({ ...manufacturer, rawMaterials: updatedMaterials });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.phone === '+919933445566' && loginForm.password === '1234') {
      const u = {
        id: 'm1',
        role: 'manufacturer',
        name: 'Manufacturer A',
        email: 'mfg1@example.com',
        phone: '+919933445566',
      };
      sessionStorage.setItem('user', JSON.stringify(u));
      window.location.reload();
    } else {
      alert('Invalid phone or password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-black">Loading dashboard...</p>
      </div>
    );
  }

  if (!user || user.role !== 'manufacturer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏭</span>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">Manufacturer Login</h1>
            <p className="text-black">Aggregate batches and create products</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
              <input
                type="tel"
                value={loginForm.phone}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                placeholder={'+919933445566'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                placeholder={'Enter your password'}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-black">Demo credentials:</p>
            <p className="text-sm text-black">Phone: +919933445566</p>
            <p className="text-sm text-black">Password: 1234</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
              <div className="p-2 bg-orange-100 rounded-lg mr-4">
                <span className="text-4xl">⚗️</span>
              </div>
            <h1 className="text-2xl font-bold text-gray-900">Manufacturer Dashboard</h1>
            <span className="text-sm text-gray-500">{manufacturer.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Settings</button>
            <button
              onClick={() => {
                sessionStorage.removeItem('user');
                window.location.href = '/auth?role=manufacturer';
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <main className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Batches</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{manufacturer.dashboardStats.totalBatches}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">{/* Icon */}</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Production</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{manufacturer.dashboardStats.inProduction}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">{/* Icon */}</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Processed</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{manufacturer.dashboardStats.processedBatches}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">{/* Icon */}</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Awaiting QC</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{manufacturer.dashboardStats.awaitingQualityCheck}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">{/* Icon */}</div>
          </div>
        </div>

        {/* Raw Material Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Raw Material Inventory</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Herb</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity (kg)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {manufacturer.rawMaterials.map((item: any) => (
                    <tr key={item.batchId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.batchId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.herbName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'Received'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'In-Production'
                              ? 'bg-yellow-100 text-yellow-800'
                              : item.status === 'In-Transit'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.quality === 'Passed'
                              ? 'bg-green-100 text-green-800'
                              : item.quality === 'Failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.quality}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {item.quality === 'Pending' && (
                          <button
                            onClick={() => handleUpdateQuality(item.batchId, 'Passed')}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                          >
                            Approve
                          </button>
                        )}
                        <Link href={`/manufacturer/batch/${item.batchId}`} className="text-blue-600 hover:text-blue-900">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Raw Material Breakdown</h3>
              <Pie data={manufacturer.herbBreakdown} />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipment Status Overview</h3>
              <Bar data={manufacturer.shipmentStatus} />
            </div>
          </div>
        </div>

        {/* Finished Goods Section */}
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Finished Goods Inventory</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {manufacturer.finishedGoods.map((item: any) => (
                    <tr key={item.batchId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.batchId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'Ready for Shipment'
                              ? 'bg-purple-100 text-purple-800'
                              : item.status === 'Shipped'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.quality === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.quality}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/manufacturer/product/${item.batchId}`} className="text-blue-600 hover:text-blue-900">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-6">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {manufacturer.products.map((product: any) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow border border-gray-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600">Batch: {product.batchId}</p>
                  </div>
                  <img
                    src="data:image/png;base64,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"
                    alt="QR code"
                    width={20}
                    height={30}
                    className="w-20 h-20 object-contain rounded border border-gray-300"
                  />
                </div>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="mt-2 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded"
                >
                  View Herb Details
                </button>
              </div>
            ))}
          </div>
        </div>

      {/* Selected Product Herb Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow max-w-4xl w-full p-6 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4">{selectedProduct.name} - Herb Details & Supply Chain</h2>

            {selectedProduct.herbs.map((herb: any) => (
              <div key={herb.id} className="mb-6 border border-gray-300 rounded-md p-4">
                <h3 className="text-xl font-semibold mb-2">{herb.name} ({herb.percentage}%)</h3>

                <div className="text-gray-700 mb-3">
                  <div>
                    <strong>Farmers Contributing: </strong> {herb.farmers.length}
                  </div>
                  <ul className="list-disc list-inside mt-2">
                    {herb.farmers.map((farmer: any) => (
                      <li key={farmer.farmerId}>
                        <strong>{farmer.farmerName}</strong> - Batch: {farmer.batchId} - Quantity: {farmer.quantity} - Grade: {farmer.testResults.grade} - Purity: {farmer.testResults.purity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
    </div>
  );
}
