'use client';
import React, { useState, useEffect } from 'react';

// --- DUMMY DATA ---
const initialLabData = {
  labTechnician: 'Dr. Emily Carter',
  name: 'Central Quality Lab',
  certification: 'ISO 17025',
  phone: '+1 555-LABTEST',
  address: '123 Testing Lane, Science City',
  assignedBatches: [
    {
      id: 'BTCH-4589',
      herbName: 'Ashwagandha',
      status: 'In Testing',
      sampleDetails: {
        sampleId: 'SM-101-AG',
        quantity: '500g',
        receivedDate: '2025-09-15',
        expiryDate: '2026-03-15',
        storageConditions: 'Dry, 20°C',
      },
      receivedFrom: {
        type: 'Processor',
        name: 'HerbCo Processing',
        location: 'Mumbai, India',
        contact: 'procure@herbco.in',
        gps: { lat: 19.076, lng: 72.8777 },
      },
      originDetails: {
        farmer: 'Rajesh Patil',
        farmId: 'FARM-902',
        harvestLocation: 'Maharashtra, India',
        harvestDate: '2025-08-01',
        processingDate: '2025-09-05',
      },
      iotSensorData: {
        temperature: 21.5,
        humidity: 45,
        ph: 6.5,
        moisture: 7.8,
        lastUpdated: '2025-09-26 10:30',
      },
      testResults: {
        certificateId: null,
        moisture: '',
        pesticide: '',
        dna: '',
        heavyMetals: '',
        activeCompounds: '',
        microbial: '',
        testDate: '',
        notes: '',
      },
      uploadedImages: ['https://via.placeholder.com/150/0000FF/808080?text=Sample+Pic+1', 'https://via.placeholder.com/150/0000FF/808080?text=Sample+Pic+2'],
      certificates: [],
      fhirData: {
        resourceType: 'Specimen',
        id: 'spec4589',
        type: { text: 'Herb Batch Sample' },
        collection: { collectedDateTime: '2025-09-15T10:00:00Z' },
      },
    },
    {
      id: 'BTCH-9012',
      herbName: 'Brahmi',
      status: 'Completed',
      sampleDetails: {
        sampleId: 'SM-205-BM',
        quantity: '2kg',
        receivedDate: '2025-09-01',
        expiryDate: '2026-03-01',
        storageConditions: 'Cool, 15°C',
      },
      receivedFrom: {
        type: 'Farm',
        name: 'Ganga Herbs Farm',
        location: 'Chennai, India',
        contact: 'ganga@farm.com',
        gps: { lat: 13.0827, lng: 80.2707 },
      },
      originDetails: {
        farmer: 'Priya Sharma',
        farmId: 'FARM-011',
        harvestLocation: 'Tamil Nadu, India',
        harvestDate: '2025-07-20',
        processingDate: '2025-08-25',
      },
      iotSensorData: {
        temperature: 19.8,
        humidity: 40,
        ph: 6.2,
        moisture: 6.5,
        lastUpdated: '2025-09-26 10:30',
      },
      testResults: {
        certificateId: 'CERT-BM-9012-V1',
        moisture: '5.5',
        pesticide: 'Pass - 0.01 ppm',
        dna: 'Verified - Bacopa monnieri',
        heavyMetals: 'Within limits',
        activeCompounds: '3.1% Bacosides',
        microbial: 'Low count (Pass)',
        testDate: '2025-09-10',
        notes: 'Exceptional quality batch. Bacosides high.',
      },
      uploadedImages: ['https://via.placeholder.com/150/FF0000/FFFFFF?text=Brahmi+Pic+A'],
      certificates: [{ name: 'Test Certificate V1.0', uploadDate: '2025-09-11' }],
      fhirData: {
        resourceType: 'Specimen',
        id: 'spec9012',
        type: { text: 'Herb Batch Sample' },
        collection: { collectedDateTime: '2025-09-01T14:00:00Z' },
      },
    },
  ],
};

const LabTesterDashboard = () => {
  // --- AUTHENTICATION STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // --- DASHBOARD STATE ---
  const [lab, setLab] = useState(initialLabData);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(initialLabData.assignedBatches[0]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testResults, setTestResults] = useState({
    moisture: '',
    pesticide: '',
    dna: '',
    heavyMetals: '',
    activeCompounds: '',
    microbial: '',
    notes: '',
  });

  // Dummy state for new uploads
  const [uploadedImages, setUploadedImages] = useState({});
  const [uploadedCertificates, setUploadedCertificates] = useState({});
  
  // Initialize test results when a new batch is selected
  useEffect(() => {
    if (selectedBatch) {
      setTestResults({
        moisture: selectedBatch.testResults.moisture || '',
        pesticide: selectedBatch.testResults.pesticide || '',
        dna: selectedBatch.testResults.dna || '',
        heavyMetals: selectedBatch.testResults.heavyMetals || '',
        activeCompounds: selectedBatch.testResults.activeCompounds || '',
        microbial: selectedBatch.testResults.microbial || '',
        notes: selectedBatch.testResults.notes || '',
      });
    }
  }, [selectedBatch]);


  // --- HANDLER FUNCTIONS ---

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy Login Logic: just check if fields are non-empty
    if (loginForm.username && loginForm.password) {
      setIsLoggedIn(true);
      // In a real app, you'd fetch the lab data here
    } else {
      alert('Please enter a username and password.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowProfile(false);
  };

  const submitTestResults = () => {
    if (!selectedBatch) return;

    // 1. Generate a dummy Certificate ID and current date
    const newCertificateId = `CERT-${selectedBatch.id}-${new Date().getTime().toString().slice(-4)}`;
    const testDate = new Date().toISOString().split('T')[0];
    const activeCompoundKey = selectedBatch.herbName === 'Ashwagandha' ? 'withanolides' : 'bacosides';

    // 2. Update the batch's test results and status
    const updatedLabBatches = lab.assignedBatches.map(b => 
      b.id === selectedBatch.id
        ? {
            ...b,
            status: 'Completed',
            testResults: {
              ...testResults,
              certificateId: newCertificateId,
              [activeCompoundKey]: testResults.activeCompounds, // Save active compounds correctly
              testDate: testDate,
            },
            // Merge newly uploaded docs into permanent lists (in a real app, this would be backend logic)
            uploadedImages: [...b.uploadedImages, ...(uploadedImages[b.id] || [])],
            certificates: [...b.certificates, ...(uploadedCertificates[b.id] || [])],
          }
        : b
    );

    // 3. Update the global state and reset UI state
    setLab(prevLab => ({ ...prevLab, assignedBatches: updatedLabBatches }));
    setSelectedBatch(updatedLabBatches.find(b => b.id === selectedBatch.id));
    setShowTestModal(false);
    setUploadedImages(prev => { delete prev[selectedBatch.id]; return { ...prev } });
    setUploadedCertificates(prev => { delete prev[selectedBatch.id]; return { ...prev } });
    alert(`Test Results Submitted and Batch ${selectedBatch.id} marked as Completed!`);
  };

  const handleImageUpload = (batchId, file) => {
    const url = URL.createObjectURL(file);
    setUploadedImages(prev => ({
      ...prev,
      [batchId]: [...(prev[batchId] || []), url]
    }));
    alert(`Image "${file.name}" ready for submission.`);
  };

  const handleCertificateUpload = (batchId, file) => {
    const newCert = {
      name: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(file) // For viewing, but not used in this mock
    };
    setUploadedCertificates(prev => ({
      ...prev,
      [batchId]: [...(prev[batchId] || []), newCert]
    }));
    alert(`Certificate "${file.name}" ready for submission.`);
  };

//   // --- LOGIN SCREEN RENDER ---
//   if (!isLoggedIn) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="max-w-md w-full p-8 space-y-6 bg-white rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold text-center text-green-700">HerbTrace Lab Portal</h2>
//           <p className="text-center text-gray-600">Lab Technician Login</p>
//           <form className="space-y-4" onSubmit={handleLogin}>
//             <div>
//               <label className="block text-sm font-medium text-black mb-1">Username</label>
//               <input
//                 type="text"
//                 value={loginForm.username}
//                 onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
//                 placeholder="e.g., ecarter"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-black mb-1">Password</label>
//               <input
//                 type="password"
//                 value={loginForm.password}
//                 onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
//                 placeholder="••••••••"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Sign In
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }

  // --- DASHBOARD RENDER ---
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* <h1 className="text-2xl font-bold text-green-700">Lab Technician Dashboard</h1> */}
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                
                <span className="text-4xl">🧪</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Lab Tester Dashboard</h1>
              </div>
            </div>
            
            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 bg-gray-100 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors"
              >
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                  {lab.labTechnician.charAt(0)}
                </div>
                <span className="text-sm font-medium text-black">{lab.labTechnician}</span>
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Profile Modal */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                        {lab.labTechnician.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-black">{lab.labTechnician}</p>
                        <p className="text-sm text-black">{lab.name}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-black mb-4">
                      <div className="flex justify-between">
                        <span>Certification:</span>
                        <span className="font-medium">{lab.certification}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="font-medium">{lab.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Address:</span>
                        <span className="font-medium">{lab.address}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black">Total Batches</p>
                  <p className="text-2xl font-semibold text-black">{lab.assignedBatches.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black">In Testing</p>
                  <p className="text-2xl font-semibold text-black">
                    {lab.assignedBatches.filter((b) => b.status === 'In Testing').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black">Completed</p>
                  <p className="text-2xl font-semibold text-black">
                    {lab.assignedBatches.filter((b) => b.status === 'Completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-black">Certificates</p>
                  <p className="text-2xl font-semibold text-black">
                    {lab.assignedBatches.filter((b) => b.testResults.certificateId).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Herb Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedBatch ? (
                <>
                  {/* Herb Information Card */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-black">Current Herb Analysis</h3>
                          <p className="text-sm text-black">Batch ID: {selectedBatch.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedBatch.status === 'In Testing' ? 'bg-yellow-100 text-yellow-800' :
                          selectedBatch.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-black'
                        }`}>
                          {selectedBatch.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Herb Details */}
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-black mb-3">🌿 Herb Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-black">Herb Name:</span>
                                <span className="font-medium text-black">{selectedBatch.herbName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-black">Sample ID:</span>
                                <span className="font-medium text-black">{selectedBatch.sampleDetails.sampleId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-black">Quantity:</span>
                                <span className="font-medium text-black">{selectedBatch.sampleDetails.quantity}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-black">Received Date:</span>
                                <span className="font-medium text-black">{selectedBatch.sampleDetails.receivedDate}</span>
                              </div>
                              <div className="text-xs text-black mt-2">
                                📅 Expiry: {selectedBatch.sampleDetails.expiryDate}
                              </div>
                              <div className="text-xs text-black">
                                🌡 Storage: {selectedBatch.sampleDetails.storageConditions}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-black mb-3">🏭 Received From</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-black">Type:</span>
                                <span className="font-medium text-black">{selectedBatch.receivedFrom.type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-black">Name:</span>
                                <span className="font-medium text-black">{selectedBatch.receivedFrom.name}</span>
                              </div>
                              <div className="text-xs text-black mt-2">
                                📍 Location: {selectedBatch.receivedFrom.location}
                              </div>
                              <div className="text-xs text-black">
                                📞 Contact: {selectedBatch.receivedFrom.contact}
                              </div>
                              <div className="text-xs text-black">
                                🗺 GPS: {selectedBatch.receivedFrom.gps.lat.toFixed(4)}, {selectedBatch.receivedFrom.gps.lng.toFixed(4)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Origin Details */}
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-black mb-3">👨‍🌾 Origin Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-black">Farmer:</span>
                                <span className="font-medium text-black">{selectedBatch.originDetails.farmer}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-black">Farm ID:</span>
                                <span className="font-medium text-black">{selectedBatch.originDetails.farmId}</span>
                              </div>
                              <div className="text-xs text-black mt-2">
                                📍 Harvest Location: {selectedBatch.originDetails.harvestLocation}
                              </div>
                              <div className="text-xs text-black">
                                📅 Harvest Date: {selectedBatch.originDetails.harvestDate}
                              </div>
                              <div className="text-xs text-black">
                                🏭 Processing Date: {selectedBatch.originDetails.processingDate}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-black mb-3">📊 IoT Sensor Data</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-black">Temperature:</span>
                                <span className="font-medium text-black">{selectedBatch.iotSensorData.temperature}°C</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-black">Humidity:</span>
                                <span className="font-medium text-black">{selectedBatch.iotSensorData.humidity}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-black">pH Level:</span>
                                <span className="font-medium text-black">{selectedBatch.iotSensorData.ph}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-black">Moisture:</span>
                                <span className="font-medium text-black">{selectedBatch.iotSensorData.moisture}%</span>
                              </div>
                              <div className="text-xs text-black mt-2">
                                🕐 Last Updated: {selectedBatch.iotSensorData.lastUpdated}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex space-x-4">
                        <button
                          onClick={() => setShowTestModal(true)}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          {selectedBatch.testResults.certificateId ? '📝 Update Results' : '🧪 Add Test Results'}
                        </button>
                        <label className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer text-center">
                          📷 Upload Images
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files && handleImageUpload(selectedBatch.id, e.target.files[0])}
                          />
                        </label>
                        <label className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer text-center">
                          📄 Upload Certificate
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => e.target.files && handleCertificateUpload(selectedBatch.id, e.target.files[0])}
                          />
                        </label>
                        {selectedBatch.status === 'Completed' && (
                          <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                            🚀 Send to Manufacturer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Test Results */}
                  {selectedBatch.testResults.certificateId && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-black">Test Results</h3>
                        <p className="text-sm text-black">Certificate ID: {selectedBatch.testResults.certificateId}</p>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-black">Moisture Content</p>
                            <p className="font-semibold text-black">{selectedBatch.testResults.moisture}%</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-black">Pesticide</p>
                            <p className="font-semibold text-black">{selectedBatch.testResults.pesticide}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-black">DNA Verification</p>
                            <p className="font-semibold text-black">{selectedBatch.testResults.dna}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-black">Heavy Metals</p>
                            <p className="font-semibold text-black">{selectedBatch.testResults.heavyMetals}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-black">Active Compounds</p>
                            <p className="font-semibold text-black">
                              {selectedBatch.testResults.activeCompounds || selectedBatch.testResults.withanolides || selectedBatch.testResults.bacosides}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-black">Microbial</p>
                            <p className="font-semibold text-black">{selectedBatch.testResults.microbial}</p>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-black">
                          <span className="font-medium">Test Date:</span> {selectedBatch.testResults.testDate}
                        </div>
                        <div className="mt-2 text-sm text-black">
                          <span className="font-medium">Notes:</span> {selectedBatch.testResults.notes}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Images and Certificates */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-black">Uploaded Documentation</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Images */}
                      {(selectedBatch.uploadedImages.length > 0 || (uploadedImages[selectedBatch.id] || []).length > 0) && (
                        <div>
                          <h4 className="font-medium text-black mb-3">Test Images</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {selectedBatch.uploadedImages.map((src, idx) => (
                              <img
                                key={idx}
                                src={src}
                                alt={`Test image ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                            ))}
                            {(uploadedImages[selectedBatch.id] || []).map((src, idx) => (
                              <img
                                key={`new-${idx}`}
                                src={src}
                                alt={`New upload ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-blue-500 ring-2 ring-blue-500"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certificates */}
                      {(selectedBatch.certificates.length > 0 || (uploadedCertificates[selectedBatch.id] || []).length > 0) && (
                        <div>
                          <h4 className="font-medium text-black mb-3">Certificates</h4>
                          <div className="space-y-2">
                            {selectedBatch.certificates.map((cert, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-black">{cert.name}</p>
                                  <p className="text-sm text-black">Uploaded: {cert.uploadDate}</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800">
                                  📄 View
                                </button>
                              </div>
                            ))}
                            {(uploadedCertificates[selectedBatch.id] || []).map((cert, idx) => (
                              <div key={`new-cert-${idx}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-purple-500">
                                <div>
                                  <p className="font-medium text-black">{cert.name}</p>
                                  <p className="text-sm text-black">Uploaded: {cert.uploadDate}</p>
                                </div>
                                <span className="text-purple-600">✓ New</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* FHIR Data */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-black">FHIR Specimen Data</h3>
                      <p className="text-sm text-black">Healthcare Interoperability Standard</p>
                    </div>
                    <div className="p-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-xs text-black overflow-x-auto">
                          {JSON.stringify(selectedBatch.fhirData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white p-10 rounded-lg shadow text-center text-gray-500">
                    Select a batch from the list to view its details.
                </div>
              )}
            </div>

            {/* Batch List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-black">All Batches</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {lab.assignedBatches.map((batch) => (
                    <div
                      key={batch.id}
                      onClick={() => setSelectedBatch(batch)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedBatch?.id === batch.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 pt-1">
                          <div className={`w-3 h-3 rounded-full ${
                            batch.status === 'In Testing' ? 'bg-yellow-600' :
                            batch.status === 'Completed' ? 'bg-green-600' :
                            'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black truncate">
                            {batch.herbName}
                          </p>
                          <p className="text-xs text-black truncate">
                            From: {batch.receivedFrom.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              batch.status === 'In Testing' ? 'bg-yellow-100 text-yellow-800' :
                              batch.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-black'
                            }`}>
                              {batch.status}
                            </span>
                          </div>
                          <p className="text-xs text-black mt-1">
                            Sample: {batch.sampleDetails.sampleId}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results Modal */}
      {showTestModal && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4 border-b pb-3">
                <div>
                  <h3 className="text-xl font-semibold text-black">Test Results Entry</h3>
                  <p className="text-sm text-black">Batch: {selectedBatch.herbName} ({selectedBatch.id})</p>
                </div>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="text-gray-500 hover:text-red-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); submitTestResults(); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Moisture Content (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={testResults.moisture}
                      onChange={(e) => setTestResults(prev => ({ ...prev, moisture: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., 8.1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Pesticide Residue</label>
                    <input
                      type="text"
                      value={testResults.pesticide}
                      onChange={(e) => setTestResults(prev => ({ ...prev, pesticide: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Pass - 0.02 ppm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">DNA Verification</label>
                    <input
                      type="text"
                      value={testResults.dna}
                      onChange={(e) => setTestResults(prev => ({ ...prev, dna: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Verified - Withania somnifera"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Heavy Metals</label>
                    <input
                      type="text"
                      value={testResults.heavyMetals}
                      onChange={(e) => setTestResults(prev => ({ ...prev, heavyMetals: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Within limits"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Active Compounds (%)</label>
                    <input
                      type="text"
                      value={testResults.activeCompounds}
                      onChange={(e) => setTestResults(prev => ({ ...prev, activeCompounds: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., 2.8% withanolides"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Microbial Count</label>
                    <input
                      type="text"
                      value={testResults.microbial}
                      onChange={(e) => setTestResults(prev => ({ ...prev, microbial: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Low count (Pass)"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-black mb-2">Additional Notes</label>
                  <textarea
                    value={testResults.notes}
                    onChange={(e) => setTestResults(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Additional observations or remarks..."
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowTestModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save Test Results
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTesterDashboard;