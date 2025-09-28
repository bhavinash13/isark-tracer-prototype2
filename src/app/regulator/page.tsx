'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pie, Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
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
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
);

// Enhanced Mock Data Structure
const extendedManufacturers = [
  {
    id: 'MFG001',
    name: 'Patanjali Ayurved Ltd.',
    status: 'Compliant',
    productCount: 45,
    lastAudit: 'Jan 2025',
    complianceScore: 98.5,
    location: 'Haridwar, Uttarakhand',
    category: 'Large Scale',
    establishedYear: 2006,
    revenue: '₹10,561 Cr',
    employeeCount: 25000,
    products: [
      {
        id: 'P001',
        name: 'Divya Ashwagandha Capsules (500mg)',
        type: 'Capsules',
        batchId: 'PROD-2025-001',
        status: 'Active Production',
        herbs: [
          {
            id: 'H001',
            name: 'Ashwagandha Root Extract',
            percentage: 80,
            farmers: [
              {
                farmerId: 'F001',
                farmerName: 'Ram Kumar Sharma',
                batchId: 'ASH-F001-2025',
                location: 'Village Khargone, Ujjain, MP',
                quantity: '45.2 kg',
                testResults: { id: 'T001', grade: 'Premium', purity: '98.5%' }
              },
              {
                farmerId: 'F002',
                farmerName: 'Shyam Patel',
                batchId: 'ASH-F002-2025',
                location: 'Dewas, MP',
                quantity: '38.7 kg',
                testResults: { id: 'T002', grade: 'Premium', purity: '97.8%' }
              }
            ]
          },
          {
            id: 'H002',
            name: 'Brahmi Leaf Powder',
            percentage: 20,
            farmers: [
              {
                farmerId: 'F003',
                farmerName: 'Lakshmi Devi',
                batchId: 'BRA-F003-2025',
                location: 'Wayanad, Kerala',
                quantity: '15.5 kg',
                testResults: { id: 'T003', grade: 'Premium', purity: '96.2%' }
              }
            ]
          }
        ]
      },
      {
        id: 'P002',
        name: 'Herbal Hair Oil',
        type: 'Oil',
        batchId: 'PROD-2025-002',
        status: 'In Development',
        herbs: [
          {
            id: 'H003',
            name: 'Bhringraj Extract',
            percentage: 40,
            farmers: [
              {
                farmerId: 'F004',
                farmerName: 'Rajesh Kumar',
                batchId: 'BHR-F004-2025',
                location: 'Nashik, Maharashtra',
                quantity: '25.3 kg',
                testResults: { id: 'T004', grade: 'Standard', purity: '94.5%' }
              },
              {
                farmerId: 'F005',
                farmerName: 'Suresh Yadav',
                batchId: 'BHR-F005-2025',
                location: 'Pune, Maharashtra',
                quantity: '22.8 kg',
                testResults: { id: 'T005', grade: 'Premium', purity: '97.1%' }
              }
            ]
          },
          {
            id: 'H004',
            name: 'Amla Oil Base',
            percentage: 35,
            farmers: [
              {
                farmerId: 'F006',
                farmerName: 'Priya Sharma',
                batchId: 'AML-F006-2025',
                location: 'Rishikesh, Uttarakhand',
                quantity: '18.9 kg',
                testResults: { id: 'T006', grade: 'Premium', purity: '98.9%' }
              }
            ]
          },
          {
            id: 'H005',
            name: 'Coconut Oil Base',
            percentage: 25,
            farmers: [
              {
                farmerId: 'F007',
                farmerName: 'Ravi Nair',
                batchId: 'COC-F007-2025',
                location: 'Thrissur, Kerala',
                quantity: '30.2 kg',
                testResults: { id: 'T007', grade: 'Standard', purity: '95.8%' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'MFG003',
    name: 'Himalaya Drug Company',
    status: 'Compliant',
    productCount: 89,
    lastAudit: 'Feb 2025',
    complianceScore: 95.7,
    location: 'Bangalore, Karnataka',
    category: 'Large Scale',
    establishedYear: 1930,
    revenue: '₹3,450 Cr',
    employeeCount: 4500,
    products: [
      {
        id: 'P003',
        name: 'Anti-Dandruff Shampoo',
        type: 'Shampoo',
        batchId: 'PROD-2025-003',
        status: 'Active Production',
        herbs: [
          {
            id: 'H006',
            name: 'Tea Tree Extract',
            percentage: 30,
            farmers: [
              {
                farmerId: 'F008',
                farmerName: 'Mohan Das',
                batchId: 'TEA-F008-2025',
                location: 'Ooty, Tamil Nadu',
                quantity: '12.5 kg',
                testResults: { id: 'T008', grade: 'Premium', purity: '97.5%' }
              },
              {
                farmerId: 'F009',
                farmerName: 'Anita Reddy',
                batchId: 'TEA-F009-2025',
                location: 'Kodaikanal, Tamil Nadu',
                quantity: '14.2 kg',
                testResults: { id: 'T009', grade: 'Premium', purity: '98.1%' }
              }
            ]
          },
          {
            id: 'H007',
            name: 'Neem Leaf Extract',
            percentage: 25,
            farmers: [
              {
                farmerId: 'F010',
                farmerName: 'Govind Singh',
                batchId: 'NEE-F010-2025',
                location: 'Jaipur, Rajasthan',
                quantity: '20.8 kg',
                testResults: { id: 'T010', grade: 'Standard', purity: '94.2%' }
              }
            ]
          },
          {
            id: 'H008',
            name: 'Aloe Vera Gel',
            percentage: 20,
            farmers: [
              {
                farmerId: 'F011',
                farmerName: 'Sunita Patel',
                batchId: 'ALO-F011-2025',
                location: 'Gandhinagar, Gujarat',
                quantity: '28.5 kg',
                testResults: { id: 'T011', grade: 'Premium', purity: '96.8%' }
              }
            ]
          },
          {
            id: 'H009',
            name: 'Rosemary Oil',
            percentage: 15,
            farmers: [
              {
                farmerId: 'F012',
                farmerName: 'David Kumar',
                batchId: 'ROS-F012-2025',
                location: 'Shimla, Himachal Pradesh',
                quantity: '8.9 kg',
                testResults: { id: 'T012', grade: 'Premium', purity: '98.7%' }
              }
            ]
          },
          {
            id: 'H010',
            name: 'Lemon Essential Oil',
            percentage: 10,
            farmers: [
              {
                farmerId: 'F013',
                farmerName: 'Maria Joseph',
                batchId: 'LEM-F013-2025',
                location: 'Munnar, Kerala',
                quantity: '5.2 kg',
                testResults: { id: 'T013', grade: 'Premium', purity: '99.1%' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'MFG002', 
    name: 'Dabur India Ltd.',
    status: 'Under Review',
    productCount: 67,
    lastAudit: 'Dec 2024',
    complianceScore: 92.3,
    location: 'Ghaziabad, UP',
    category: 'Large Scale',
    establishedYear: 1884,
    revenue: '₹11,756 Cr',
    employeeCount: 7200,
    products: [
      {
        id: 'P004',
        name: 'Chyawanprash',
        type: 'Paste',
        batchId: 'PROD-2025-004',
        status: 'Quality Review',
        herbs: [
          {
            id: 'H011',
            name: 'Amla Pulp',
            percentage: 50,
            farmers: [
              {
                farmerId: 'F014',
                farmerName: 'Ramesh Gupta',
                batchId: 'AML-F014-2025',
                location: 'Pratapgarh, UP',
                quantity: '120.5 kg',
                testResults: { id: 'T014', grade: 'Standard', purity: '92.8%' }
              },
              {
                farmerId: 'F015',
                farmerName: 'Kamala Devi',
                batchId: 'AML-F015-2025',
                location: 'Barabanki, UP',
                quantity: '98.7 kg',
                testResults: { id: 'T015', grade: 'Standard', purity: '91.2%' }
              }
            ]
          },
          {
            id: 'H012',
            name: 'Ashwagandha Root',
            percentage: 15,
            farmers: [
              {
                farmerId: 'F016',
                farmerName: 'Vikram Singh',
                batchId: 'ASH-F016-2025',
                location: 'Nagaur, Rajasthan',
                quantity: '45.8 kg',
                testResults: { id: 'T016', grade: 'Standard', purity: '93.5%' }
              }
            ]
          }
        ]
      }
    ]
  }
];

// Supply chain data for individual farmer batches
const farmerSupplyChainData = {
  'F001': {
    farmer: {
      name: 'Ram Kumar Sharma',
      farmId: 'F001',
      location: 'Village Khargone, Ujjain, MP',
      gps: '23.1234°N, 75.5678°E',
      harvestDate: '15 Jan 2025, 6:30 AM',
      quantity: '45.2 kg',
      moisture: '8.1%',
      images: ['https://www.leisaindia.org/wp-content/uploads/2015/12/Ashwagandha_016-scaled.jpg', 'https://www.optamins.com/fileadmin/_processed_/6/6/csm_AdobeStock_1296752558___391a7c011d.jpeg'],
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef'
    },
    collector: {
      centerName: 'Ujjain Collection Hub',
      operator: 'Suresh Patel',
      verificationDate: '15 Jan 2025, 9:00 AM',
      verifiedWeight: '45.0 kg',
      moistureCheck: '8.0%',
      digitalReceipt: 'RC-2025-001',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg13BAGN-IjFjtpSwF7vk14ND4Wugu-DazLA&s', 'data:image/jpeg;base64,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'],
      blockchainHash: '0x2b3c4d5e6f7890abcdef12'
    },
    transporter: {
      company: 'Reliable Logistics Ltd',
      vehicle: 'MP04AB1234',
      driver: 'Suresh Singh',
      route: 'Ujjain → Delhi Processing Hub',
      startTime: '15 Jan 2025, 11:00 AM',
      endTime: '16 Jan 2025, 5:00 AM',
      transitDuration: '18 hours',
      tempRange: '22-28°C',
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg13BAGN-IjFjtpSwF7vk14ND4Wugu-DazLA&s', 'data:image/jpeg;base64,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'],
      blockchainHash: '0x3c4d5e6f7890abcdef123'
    },
    processor: {
      facility: 'Delhi Ayurvedic Processing Unit',
      manager: 'Dr. Amit Verma',
      receivalDate: '16 Jan 2025, 6:00 AM',
      processes: ['Cleaning', 'Drying', 'Grinding', 'Extraction'],
      yield: '89.2%',
      finalGrade: 'Pharmaceutical Grade',
      processingDates: '16-18 Jan 2025',
      images: ['https://tiimg.tistatic.com/fp/1/007/528/dried-natural-ashwagandha-roots-for-medicine-use-with-pack-of-500-gram-356.jpg', 'https://krshakexports.com/wp-content/uploads/2022/05/solid-ashwagandha-extract.jpg'],
      blockchainHash: '0x4d5e6f7890abcdef1234'
    },
    tester: {
      lab: 'Delhi Ayurveda Testing Center',
      scientist: 'Dr. Priya Sharma',
      testDate: '19 Jan 2025',
      tests: {
        dnaAuthentication: 'PASS - Withania somnifera confirmed',
        heavyMetals: 'PASS - Within limits',
        pesticides: 'PASS - 0.02 ppm detected',
        withanolides: '2.8% - Premium grade',
        moisture: '7.9% - Optimal',
        microbial: 'PASS - Low count'
      },
      certificateId: 'QT-2025-089',
      images: ['https://www.labofine.com/wp-content/uploads/2023/06/C1107-AboutAshwagandhaTesting-1.jpg', 'data:image/jpeg;base64,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'],
      blockchainHash: '0x5e6f7890abcdef12345'
    }
  },
  'F002': {
    farmer: {
      name: 'Shyam Patel',
      farmId: 'F002',
      location: 'Dewas, MP',
      gps: '22.9676°N, 76.0534°E',
      harvestDate: '18 Jan 2025, 7:00 AM',
      quantity: '38.7 kg',
      moisture: '7.8%',
      images: ['/api/placeholder/150/100?text=Farm+F002+1', '/api/placeholder/150/100?text=Farm+F002+2'],
      blockchainHash: '0x1b3c4d5e6f7890abcdef'
    },
    collector: {
      centerName: 'Dewas Collection Center',
      operator: 'Ramesh Kumar',
      verificationDate: '18 Jan 2025, 10:00 AM',
      verifiedWeight: '38.5 kg',
      moistureCheck: '7.7%',
      digitalReceipt: 'RC-2025-002',
      images: ['/api/placeholder/150/100?text=Collection+F002+1', '/api/placeholder/150/100?text=Collection+F002+2'],
      blockchainHash: '0x2c4d5e6f7890abcdef12'
    },
    transporter: {
      company: 'Safe Transport Co.',
      vehicle: 'MP09XY5678',
      driver: 'Manoj Sharma',
      route: 'Dewas → Delhi Processing Hub',
      startTime: '18 Jan 2025, 2:00 PM',
      endTime: '19 Jan 2025, 8:00 AM',
      transitDuration: '18 hours',
      tempRange: '20-26°C',
      images: ['/api/placeholder/150/100?text=Transport+F002+1', '/api/placeholder/150/100?text=Transport+F002+2'],
      blockchainHash: '0x3d5e6f7890abcdef123'
    },
    processor: {
      facility: 'Delhi Ayurvedic Processing Unit',
      manager: 'Dr. Amit Verma',
      receivalDate: '19 Jan 2025, 9:00 AM',
      processes: ['Cleaning', 'Drying', 'Grinding', 'Extraction'],
      yield: '87.8%',
      finalGrade: 'Pharmaceutical Grade',
      processingDates: '19-21 Jan 2025',
      images: ['/api/placeholder/150/100?text=Processing+F002+1', '/api/placeholder/150/100?text=Processing+F002+2'],
      blockchainHash: '0x4e6f7890abcdef1234'
    },
    tester: {
      lab: 'Delhi Ayurveda Testing Center',
      scientist: 'Dr. Priya Sharma',
      testDate: '22 Jan 2025',
      tests: {
        dnaAuthentication: 'PASS - Withania somnifera confirmed',
        heavyMetals: 'PASS - Within limits',
        pesticides: 'PASS - 0.01 ppm detected',
        withanolides: '2.6% - Premium grade',
        moisture: '7.8% - Optimal',
        microbial: 'PASS - Very low count'
      },
      certificateId: 'QT-2025-090',
      images: ['/api/placeholder/150/100?text=Testing+F002+1', '/api/placeholder/150/100?text=Testing+F002+2'],
      blockchainHash: '0x5f7890abcdef12345'
    }
  }
};

const supplyChainSteps = {
  farmer: { title: 'Farmer/Collector', icon: '🌾', description: 'Harvesting and initial collection' },
  collector: { title: 'Collection Point', icon: '📦', description: 'Aggregation and initial verification' },
  transporter: { title: 'Transportation', icon: '🚚', description: 'GPS-tracked movement to processing' },
  processor: { title: 'Processor', icon: '🏭', description: 'Cleaning, drying, and preparation' },
  tester: { title: 'Quality Tester', icon: '🧪', description: 'Laboratory analysis and certification' }
};

export default function RegulatorPage() {
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedManufacturer, setSelectedManufacturer] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedHerb, setSelectedHerb] = useState<any>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [selectedStep, setSelectedStep] = useState<string>('farmer');
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [batchSearchId, setBatchSearchId] = useState('');

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (loginForm.phone === '+911123456789' && loginForm.password === '1234') {
        const u = { id: 'reg1', role: 'regulator', name: 'Inspector Raj', email: 'regulator@example.com', phone: '+911123456789' };
        sessionStorage.setItem('user', JSON.stringify(u));
        window.location.reload();
      } else {
        alert('Invalid phone or password');
      }
    };
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🛡️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Regulator Login</h2>
            <p className="text-gray-600">Enter your phone and password</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={loginForm.phone}
                onChange={(e) => setLoginForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                placeholder={'+911123456789'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                placeholder={'Enter your password'}
                required
              />
            </div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">Login</button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo credentials:</p>
            <p>Phone: +911123456789</p>
            <p>Password: 1234</p>
          </div>
        </div>
      </div>
    );
  }

  // Chart Data
  const manufacturerStatusData = {
    labels: ['Compliant', 'Under Review', 'Investigation'],
    datasets: [{
      data: [
        extendedManufacturers.filter(m => m.status === 'Compliant').length,
        extendedManufacturers.filter(m => m.status === 'Under Review').length,
        extendedManufacturers.filter(m => m.status === 'Investigation').length
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const categoryDistributionData = {
    labels: ['Large Scale', 'Medium Scale', 'Small Scale'],
    datasets: [{
      data: [
        extendedManufacturers.filter(m => m.category === 'Large Scale').length,
        extendedManufacturers.filter(m => m.category === 'Medium Scale').length,
        extendedManufacturers.filter(m => m.category === 'Small Scale').length
      ],
      backgroundColor: ['#3B82F6', '#8B5CF6', '#06B6D4'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const complianceScoreData = {
    labels: extendedManufacturers.map(m => m.name.split(' ')[0]),
    datasets: [{
      label: 'Compliance Score',
      data: extendedManufacturers.map(m => m.complianceScore),
      backgroundColor: extendedManufacturers.map(m => 
        m.complianceScore >= 95 ? '#10B981' : 
        m.complianceScore >= 90 ? '#F59E0B' : '#EF4444'
      ),
      borderColor: '#374151',
      borderWidth: 1
    }]
  };

    // Batch search function
  const handleBatchSearch = () => {
    if (!batchSearchId.trim()) {
      alert('Please enter a batch ID');
      return;
    }

    // Search for the batch in the farmers data
    let foundFarmer = null;
    let foundHerb = null;
    let foundProduct = null;

    // Search through all manufacturers, products, herbs, and farmers
    for (const manufacturer of extendedManufacturers) {
      for (const product of manufacturer.products || []) {
        for (const herb of product.herbs || []) {
          for (const farmer of herb.farmers || []) {
            if (farmer.farmerId === batchSearchId || farmer.batchId === batchSearchId) {
              foundFarmer = farmer;
              foundHerb = herb;
              foundProduct = product;
              break;
            }
          }
          if (foundFarmer) break;
        }
        if (foundFarmer) break;
      }
      if (foundFarmer) break;
    }

    if (foundFarmer) {
      setSelectedProduct(foundProduct);
      setSelectedHerb(foundHerb);
      setSelectedFarmer(foundFarmer);
    } else {
      alert('Batch ID not found. Please check the ID and try again.');
    }
  };

// Header Component
  const Header = () => (
    <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
          <span className="text-4xl">🛡️</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Regulatory Dashboard</h1>
              <p className="text-sm text-gray-600">Ministry of Ayush - Blockchain Traceability System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-700">System Healthy</span>
            </div>
            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium border border-amber-200">
              🚨 2 Active Alerts
            </div>
            <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              Inspector {user.name}
            </div>

          </div>
        </div>
      </div>

      {/* Batch Search Section - Added below header, above navigation */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <label htmlFor="batch-search" className="sr-only">
                Search Batch ID
              </label>
              <div className="relative flex ">
                <input
                  type="text"
                  id="batch-search"
                  className="block w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Batch ID (e.g., F001 or ASH-F001-2025)"
                  value={batchSearchId}
                  onChange={(e) => setBatchSearchId(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleBatchSearch();
                    }
                   
                  }}
                  autoFocus
                />
              
              </div>
            </div>
            <button
              onClick={handleBatchSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Search Batch
            </button>
            <div className="text-sm text-gray-600">
              <span className="font-medium"> Quick Search:</span> Search by this ID: ASH-F001-2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  // Charts Dashboard Section (only for charts - no colors elsewhere)
  const ChartsDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manufacturer Status</h3>
        <div className="h-48">
          <Pie data={manufacturerStatusData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scale Distribution</h3>
        <div className="h-48">
          <Doughnut data={categoryDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Scores</h3>
        <div className="h-48">
          <Bar data={complianceScoreData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );

  // Navigation Tabs
  interface NavigationTabsProps {
    currentView: string;
    setCurrentView: (view: string) => void;
  }

  const NavigationTabs: React.FC<NavigationTabsProps> = ({ currentView, setCurrentView }) => (
    <div className="mb-6">
      <nav className="flex space-x-8">
        {[
          { id: 'dashboard', label: 'Dashboard Overview' },
          { id: 'manufacturers', label: 'Manufacturers' },
          { id: 'products', label: 'Product Details' },
          { id: 'investigations', label: 'Investigations' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md border-2 transition-colors
              ${
                currentView === tab.id
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-blue-800 text-blue-100 border-blue-900 hover:bg-blue-900 hover:text-white'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
  

  // KPI Section (no extra colors)
  const KPISection = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Manufacturers</p>
            <p className="text-3xl font-bold text-gray-900">{extendedManufacturers.length}</p>
            <p className="text-sm text-gray-600">+2 this month</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">
              {extendedManufacturers.reduce((sum, m) => sum + (m.products?.length || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Across all manufacturers</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Herbs</p>
            <p className="text-3xl font-bold text-gray-900">
              {extendedManufacturers.reduce((sum, m) => 
                sum + (m.products?.reduce((pSum, p) => pSum + (p.herbs?.length || 0), 0) || 0), 0
              )}
            </p>
            <p className="text-sm text-gray-600">Unique herb batches</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Farmers</p>
            <p className="text-3xl font-bold text-gray-900">
              {extendedManufacturers.reduce((sum, m) => 
                sum + (m.products?.reduce((pSum, p) => 
                  pSum + (p.herbs?.reduce((hSum, h) => hSum + (h.farmers?.length || 0), 0) || 0), 0
                ) || 0), 0
              )}
            </p>
            <p className="text-sm text-gray-600">Contributing farmers</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Supply Chain Steps</p>
            <p className="text-3xl font-bold text-gray-900">6</p>
            <p className="text-sm text-gray-600">Tracked stages</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // Manufacturers View
  const ManufacturersView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manufacturers Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {extendedManufacturers.map((manufacturer) => (
          <div
            key={manufacturer.id}
            onClick={() => {
              setSelectedManufacturer(manufacturer);
              setCurrentView('products');
            }}
            className="bg-white rounded-lg shadow-md p-6 border cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-400"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{manufacturer.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                manufacturer.status === 'Compliant' ? 'bg-gray-100 text-gray-800' :
                manufacturer.status === 'Under Review' ? 'bg-gray-100 text-gray-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {manufacturer.status === 'Compliant' ? '✅' : 
                 manufacturer.status === 'Under Review' ? '⚠️' : '🔍'} {manufacturer.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Products:</span>
                <span className="font-medium">{manufacturer.products?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Herbs:</span>
                <span className="font-medium">
                  {manufacturer.products?.reduce((sum, p) => sum + (p.herbs?.length || 0), 0) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Farmers:</span>
                <span className="font-medium">
                  {manufacturer.products?.reduce((sum, p) => 
                    sum + (p.herbs?.reduce((hSum, h) => hSum + (h.farmers?.length || 0), 0) || 0), 0
                  ) || 0}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                📍 {manufacturer.location}
              </div>
              <div className="text-xs text-gray-500">
                 Est. {manufacturer.establishedYear}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Compliance</span>
                <span className="text-xs font-medium">{manufacturer.complianceScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gray-600"
                  style={{ width: `${manufacturer.complianceScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Products View
  const ProductsView = () => {
    if (!selectedManufacturer) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView('manufacturers')}
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            ← Back to Manufacturers
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedManufacturer.name} - Products
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {selectedManufacturer.products?.map((product: any) => (
    <div key={product.id} className="bg-white rounded-lg shadow border">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600">Type: {product.type}</p>
            <p className="text-sm text-gray-600">Batch: {product.batchId}</p>
            <p className="text-sm text-gray-600">Status: {product.status}</p>
          </div>
          {/* Dummy QR Code Image */}
          <div className="ml-4 flex-shrink-0">
            <img
              src="data:image/png;base64,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"
              alt="QR code"
              className="w-20 h-20 object-contain rounded border border-gray-300"
            />
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Herb Composition:</h4>
          <div className="space-y-2">
            {product.herbs?.map((herb: any) => (
              <div key={herb.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium text-black">{herb.name}</span>
                  <span className="text-xs text-gray-600 ml-2">({herb.percentage}%)</span>
                  <div className="text-xs text-gray-500">
                    {herb.farmers?.length || 0} farmer(s) contributing
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedHerb(herb);
                  }}
                  className="text-xs text-emerald-700 hover:text-emerald-800 border border-emerald-200 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  View Farmers
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )) || <div className="text-gray-500">No products found</div>}
</div>

        {/* Herb Details Modal */}
        {selectedHerb && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedHerb.name}</h3>
                    <p className="text-sm text-gray-600">Used in: {selectedProduct?.name}</p>
                    <p className="text-sm text-gray-600">Percentage: {selectedHerb.percentage}%</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedHerb(null);
                      setSelectedProduct(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Contributing Farmers:</h4>
                  {selectedHerb.farmers?.map((farmer: any) => (
                    <div key={farmer.farmerId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <div>
                            <p className="font-medium text-gray-900">{farmer.farmerName}</p>
                            <p className="text-sm text-gray-600">ID: {farmer.farmerId}</p>
                            <p className="text-sm text-gray-600">Location: {farmer.location}</p>
                            <p className="text-sm text-gray-600">Batch: {farmer.batchId}</p>
                            <p className="text-sm text-gray-600">Quantity: {farmer.quantity}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Test ID: {farmer.testResults?.id}</p>
                            <p className="text-sm text-gray-600">Grade: {farmer.testResults?.grade}</p>
                            <p className="text-sm text-gray-600">Purity: {farmer.testResults?.purity}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFarmer(farmer)}
                          className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200"
                        >
                          View Supply Chain
                        </button>
                      </div>
                    </div>
                  )) || <div className="text-gray-500">No farmers found</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Farmer Supply Chain Modal */}
{selectedFarmer && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-black">
              Supply Chain: {selectedFarmer.farmerName}
            </h3>
            <p className="text-sm text-black">Batch ID: {selectedFarmer.batchId}</p>
            <p className="text-sm text-black">Herb: {selectedHerb?.name}</p>
          </div>
          <button
            onClick={() => setSelectedFarmer(null)}
            className="text-black hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Supply Chain Steps */}
        <div className="mb-6">
          <div className="flex flex-wrap justify-center mb-6 space-x-2">
            {Object.keys(supplyChainSteps).map((step) => (
              <button
                key={step}
                onClick={() => setSelectedStep(selectedStep === step ? '' : step)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStep === step
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                {supplyChainSteps[step as keyof typeof supplyChainSteps]?.icon}{' '}
                {supplyChainSteps[step as keyof typeof supplyChainSteps]?.title}
              </button>
            ))}
          </div>

          {/* Step Details */}
          {selectedStep &&
            farmerSupplyChainData[
              selectedFarmer.farmerId as keyof typeof farmerSupplyChainData
            ] && (
              <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">
                    {supplyChainSteps[selectedStep as keyof typeof supplyChainSteps]?.icon}
                  </span>
                  <div>
                    <h4 className="text-xl font-semibold text-black">
                      {supplyChainSteps[selectedStep as keyof typeof supplyChainSteps]?.title}
                    </h4>
                    <p className="text-black">
                      {
                        supplyChainSteps[selectedStep as keyof typeof supplyChainSteps]
                          ?.description
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Step Data */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-black">Step Details:</h5>
                    <div className="space-y-2 text-sm text-black">
                      {Object.entries(
                        farmerSupplyChainData[
                          selectedFarmer.farmerId as keyof typeof farmerSupplyChainData
                        ][
                          selectedStep as keyof typeof farmerSupplyChainData['F001']
                        ]
                      ).map(([key, value]) => {
                        if (key === 'images' || key === 'tests') return null;
                        return (
                          <div key={key}>
                            <span className="font-medium capitalize text-black">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="ml-2 text-black">
                              {typeof value === 'object' && value !== null
                                ? JSON.stringify(value)
                                : String(value)}
                            </span>
                          </div>
                        );
                      })}

                      {/* Special handling for tests in tester step */}
                      {selectedStep === 'tester' &&
                        farmerSupplyChainData[selectedFarmer.farmerId as keyof typeof farmerSupplyChainData].tester.tests && (
                          <div className="space-y-1 mt-3">
                            <div className="font-medium text-black">Test Results:</div>
                            {Object.entries(
                              farmerSupplyChainData[selectedFarmer.farmerId as keyof typeof farmerSupplyChainData].tester.tests
                            ).map(([test, result]) => (
                              <div key={test} className="ml-4 text-xs text-black">
                                <span className="capitalize">
                                  {test.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="ml-2 text-black">{result as string}</span>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Blockchain hash */}
                      {farmerSupplyChainData[selectedFarmer.farmerId as keyof typeof farmerSupplyChainData][
                        selectedStep as keyof typeof farmerSupplyChainData['F001']
                      ].blockchainHash && (
                        <div className="bg-gray-100 p-2 rounded">
                          <span className="font-medium text-black">Blockchain Hash:</span>
                          <code className="text-xs ml-2 text-black">
                            {
                              farmerSupplyChainData[selectedFarmer.farmerId as keyof typeof farmerSupplyChainData][
                                selectedStep as keyof typeof farmerSupplyChainData['F001']
                              ].blockchainHash
                            }
                          </code>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step Images */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-black">Process Images:</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {farmerSupplyChainData[selectedFarmer.farmerId as keyof typeof farmerSupplyChainData][
                        selectedStep as keyof typeof farmerSupplyChainData['F001']
                      ].images?.map((image: string, index: number) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`${selectedStep} process ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                            {selectedStep} - Step {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-black mt-2">
                      * Images retrieved from blockchain IPFS storage
                    </div>
                  </div>
                </div>

                {/* View All Details Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                    📋 View All Step Details & Documents
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  </div>
)}


      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <NavigationTabs currentView={currentView} setCurrentView={setCurrentView}/>
          
          {currentView === 'dashboard' && (
            <>
              <KPISection />
              <ChartsDashboard />
              <ManufacturersView />
            </>
          )}
          
          {currentView === 'manufacturers' && <ManufacturersView />}
          
          {currentView === 'products' && <ProductsView />}
        </div>
      </div>
    </div>
  );
}
