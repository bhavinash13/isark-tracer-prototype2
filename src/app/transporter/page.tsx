'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Enhanced Mock Data for Transporter with Pre-uploaded Images
const mockTransporterData = {
  transporters: [
    {
      id: 'T001',
      name: 'Reliable Logistics Ltd',
      driverName: 'Suresh Singh',
      vehicleNumber: 'MP04AB1234',
      licenseNumber: 'DL-2025-001',
      phone: '+91 9876543210',
      assignedShipments: [
        {
          id: 'SHIP-001',
          batchId: 'ASH-F001-2025',
          herbName: 'Ashwagandha Root Extract',
          farmerDetails: {
            name: 'Ram Kumar Sharma',
            farmId: 'F001',
            location: 'Village Khargone, Ujjain, MP',
            harvestDate: '15 Jan 2025'
          },
          destination: {
            type: 'Processor',
            name: 'Delhi Ayurvedic Processing Unit',
            address: 'Industrial Area, Delhi',
            contact: '+91 11-2345678'
          },
          status: 'In Transit',
          quantity: '45.2 kg',
          pickupDate: '16 Jan 2025',
          expectedDelivery: '17 Jan 2025',
          currentLocation: 'Highway EN-8, Gwalior',
          shipmentStages: [
            { stage: 'Pickup from Farmer', status: 'completed', timestamp: '16 Jan 2025, 10:00 AM' },
            { stage: 'In Transit', status: 'current', timestamp: '16 Jan 2025, 2:30 PM' },
            { stage: 'Delivered to Processor', status: 'pending', timestamp: '' }
          ],
          preUploadedImages: [
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg13BAGN-IjFjtpSwF7vk14ND4Wugu-DazLA&s',
            'https://www.shutterstock.com/image-photo/mini-lorry-loaded-fresh-food-260nw-2419628951.jpg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStBi1jd4DFVyjdOI9x7LDFoJNdS4mT3V_nDA&s'
          ]
        },
        {
          id: 'SHIP-002',
          batchId: 'BRA-F003-2025',
          herbName: 'Brahmi Leaf Powder',
          farmerDetails: {
            name: 'Lakshmi Devi',
            farmId: 'F003',
            location: 'Wayanad, Kerala',
            harvestDate: '12 Jan 2025'
          },
          destination: {
            type: 'Testing Lab',
            name: 'Kerala Herbal Testing Center',
            address: 'Technopark, Trivandrum',
            contact: '+91 471-2345678'
          },
          status: 'Delivered',
          quantity: '15.5 kg',
          pickupDate: '14 Jan 2025',
          expectedDelivery: '15 Jan 2025',
          currentLocation: 'Delivered',
          shipmentStages: [
            { stage: 'Pickup from Processor', status: 'completed', timestamp: '14 Jan 2025, 9:00 AM' },
            { stage: 'In Transit', status: 'completed', timestamp: '14 Jan 2025, 11:30 AM' },
            { stage: 'Delivered to Testing Lab', status: 'completed', timestamp: '15 Jan 2025, 8:00 AM' }
          ],
          preUploadedImages: [
            '/api/placeholder/200/150?text=Processor+Pickup',
            '/api/placeholder/200/150?text=Transit+Photo',
            '/api/placeholder/200/150?text=Lab+Delivery',
            '/api/placeholder/200/150?text=Handover+Receipt'
          ]
        },
        {
          id: 'SHIP-003',
          batchId: 'NEE-F010-2025',
          herbName: 'Neem Leaf Extract',
          farmerDetails: {
            name: 'Govind Singh',
            farmId: 'F010',
            location: 'Jaipur, Rajasthan',
            harvestDate: '20 Jan 2025'
          },
          destination: {
            type: 'Manufacturer',
            name: 'Himalaya Drug Company',
            address: 'Bangalore, Karnataka',
            contact: '+91 80-12345678'
          },
          status: 'Scheduled',
          quantity: '20.8 kg',
          pickupDate: '25 Jan 2025',
          expectedDelivery: '27 Jan 2025',
          currentLocation: 'Awaiting Pickup',
          shipmentStages: [
            { stage: 'Pickup from Testing Lab', status: 'pending', timestamp: '' },
            { stage: 'In Transit', status: 'pending', timestamp: '' },
            { stage: 'Delivered to Manufacturer', status: 'pending', timestamp: '' }
          ],
          preUploadedImages: [
            '/api/placeholder/200/150?text=Previous+Lab+Visit',
            '/api/placeholder/200/150?text=Vehicle+Inspection'
          ]
        }
      ]
    }
  ]
};

export default function TransporterPage() {
  const [user, setUser] = useState<any>(null);
  const [transporter, setTransporter] = useState<any>(null);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [photosByShipment, setPhotosByShipment] = useState<Record<string, string[]>>({});
  const [gpsByShipment, setGpsByShipment] = useState<Record<string, { lat: number; lng: number } | null>>({});
  const [showProfile, setShowProfile] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const u = JSON.parse(userData);
      setUser(u);
      const transporterData = mockTransporterData.transporters.find(t => t.id === u.id) || mockTransporterData.transporters[0];
      setTransporter(transporterData);
      const activeShipment = transporterData.assignedShipments.find(s => s.status === 'In Transit');
      if (activeShipment) {
        setSelectedShipment(activeShipment);
      }
    }
  }, []);

  const onUploadPhoto = (shipmentId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPhotosByShipment(prev => ({
        ...prev,
        [shipmentId]: [...(prev[shipmentId] || []), String(reader.result)]
      }));
    };
    reader.readAsDataURL(file);
  };

  const captureGPS = (shipmentId: string) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setGpsByShipment(prev => ({ ...prev, [shipmentId]: coords }));
    });
  };

  const updateDeliveryStatus = (shipmentId: string) => {
    if (!transporter) return;
    const updatedShipments = transporter.assignedShipments.map((s: any) => {
      if (s.id === shipmentId) {
        const nextStageMap: Record<string, string> = {
          'In Transit': 'Delivered',
          'Scheduled': 'In Transit'
        };
        return {
          ...s,
          status: nextStageMap[s.status] || s.status,
          shipmentStages: s.shipmentStages.map((stage: any, index: number) => {
            if (stage.status === 'current') {
              return { ...stage, status: 'completed', timestamp: new Date().toLocaleString() };
            }
            if (stage.status === 'pending' && index === s.shipmentStages.findIndex((st: any) => st.status === 'current') + 1) {
              return { ...stage, status: 'current', timestamp: new Date().toLocaleString() };
            }
            return stage;
          })
        };
      }
      return s;
    });
    setTransporter({ ...transporter, assignedShipments: updatedShipments });
    if (selectedShipment?.id === shipmentId) {
      const updatedSelected = updatedShipments.find((s: any) => s.id === shipmentId);
      setSelectedShipment(updatedSelected);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.href = '/auth?role=transporter';
  };

  const openImageGallery = (shipmentId: string) => {
    const preUploaded = selectedShipment?.preUploadedImages || [];
    const newUploaded = photosByShipment[shipmentId] || [];
    setGalleryImages([...preUploaded, ...newUploaded]);
    setShowImageGallery(true);
  };

  if (!user || !transporter) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      // Demo credentials: Phone + Password
      if (loginForm.phone === '+919922334455' && loginForm.password === '1234') {
        const u = { id: 'T001', role: 'transporter', name: 'Reliable Logistics Ltd', driverName: 'Suresh Singh', vehicleNumber: 'MP04AB1234', licenseNumber: 'DL-2025-001', phone: '+91 9876543210' };
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
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🚚</span>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">Transporter Login</h1>
            <p className="text-black">Access your shipments and update statuses</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
              <input
                type="tel"
                value={loginForm.phone}
                onChange={(e) => setLoginForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder={'+919922334455'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder={'Enter your password'}
                required
              />
            </div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">Login</button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-black">Demo credentials:</p>
            <p className="text-sm text-black">Phone: +919922334455</p>
            <p className="text-sm text-black">Password: 1234</p>
          </div>
        </div>
      </div>
    );
  }

  // Shipment Tracking Diagram Component
  const ShipmentTrackingDiagram = ({ shipment }: { shipment: any }) => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-black mb-4">Shipment Tracking</h3>
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
          <div 
            className="h-1 bg-blue-600 rounded-full transition-all duration-500"
            style={{ 
              width: `${(shipment.shipmentStages.filter((s: any) => s.status === 'completed').length / shipment.shipmentStages.length) * 100}%` 
            }}
          ></div>
        </div>
        
        {shipment.shipmentStages.map((stage: any, index: number) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
              stage.status === 'completed' ? 'bg-green-600' :
              stage.status === 'current' ? 'bg-blue-600' :
              'bg-gray-300'
            }`}>
              {stage.status === 'completed' ? '✓' : index + 1}
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium text-black">{stage.stage}</p>
              {stage.timestamp && (
                <p className="text-xs text-black">{stage.timestamp}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                {/* <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <span className="text-4xl">🚚</span> 
                </svg> */}
                <span className="text-4xl">🚚</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Transporter Dashboard</h1>
                <p className="text-sm text-black">{transporter.name} - {transporter.vehicleNumber}</p>
              </div>
            </div>
            
            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 bg-gray-100 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {transporter.driverName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-black">{transporter.driverName}</span>
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Profile Modal */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                        {transporter.driverName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-black">{transporter.driverName}</p>
                        <p className="text-sm text-black">{transporter.name}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-black mb-4">
                      <div className="flex justify-between">
                        <span>Vehicle:</span>
                        <span className="font-medium">{transporter.vehicleNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>License:</span>
                        <span className="font-medium">{transporter.licenseNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="font-medium">{transporter.phone}</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* All Shipments List (on the left, takes 1 column) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-black">All Shipments</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {transporter.assignedShipments.map((shipment: any) => (
                    <div
                      key={shipment.id}
                      onClick={() => setSelectedShipment(shipment)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedShipment?.id === shipment.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full ${
                            shipment.status === 'In Transit' ? 'bg-blue-600' :
                            shipment.status === 'Delivered' ? 'bg-green-600' :
                            'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black truncate">
                            {shipment.herbName}
                          </p>
                          <p className="text-xs text-black truncate">
                            {shipment.farmerDetails.name} → {shipment.destination.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                              shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-black'
                            }`}>
                              {shipment.status}
                            </span>
                          </div>
                          <p className="text-xs text-black mt-1">
                            {shipment.quantity} • {shipment.batchId}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Statistics (Below the list, on the left) */}
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-black mb-4">Today's Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Total Shipments</span>
                    <span className="text-lg font-semibold text-black">{transporter.assignedShipments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">In Transit</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {transporter.assignedShipments.filter((s: any) => s.status === 'In Transit').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Delivered</span>
                    <span className="text-lg font-semibold text-green-600">
                      {transporter.assignedShipments.filter((s: any) => s.status === 'Delivered').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-black">Scheduled</span>
                    <span className="text-lg font-semibold text-black">
                      {transporter.assignedShipments.filter((s: any) => s.status === 'Scheduled').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Shipment Details (on the right, takes 3 columns now) */}
            <div className="lg:col-span-3 space-y-6">
              {selectedShipment && (
                <>
                  {/* Shipment Tracking Diagram */}
                  <ShipmentTrackingDiagram shipment={selectedShipment} />

                  {/* Shipment Details - IMPROVED LAYOUT WITH BRIGHTER COLORS */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-black">Current Shipment Details</h3>
                          <p className="text-sm text-black">Batch ID: {selectedShipment.batchId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedShipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          selectedShipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-black'
                        }`}>
                          {selectedShipment.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Herb Details Card - BRIGHT GREEN */}
                        <div className="bg-emerald-600 text-white p-6 rounded-lg shadow-md">
                          <h4 className="text-xl font-bold mb-3 flex items-center">
                            <span className="mr-3 text-2xl">🌿</span> Herb Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {selectedShipment.herbName}</p>
                            <p><strong>Quantity:</strong> {selectedShipment.quantity}</p>
                            <p><strong>Batch ID:</strong> {selectedShipment.batchId}</p>
                          </div>
                        </div>

                        {/* Source Details Card - BRIGHT BLUE */}
                        <div className="bg-sky-600 text-white p-6 rounded-lg shadow-md">
                          <h4 className="text-xl font-bold mb-3 flex items-center">
                            <span className="mr-3 text-2xl">👨‍🌾</span> Source Farmer
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {selectedShipment.farmerDetails.name}</p>
                            <p><strong>Farm ID:</strong> {selectedShipment.farmerDetails.farmId}</p>
                            <p><strong>Location:</strong> {selectedShipment.farmerDetails.location}</p>
                          </div>
                        </div>
                        
                        {/* Destination Details Card - BRIGHT ORANGE */}
                        <div className="bg-orange-600 text-white p-6 rounded-lg shadow-md">
                          <h4 className="text-xl font-bold mb-3 flex items-center">
                            <span className="mr-3 text-2xl">🏭</span> Destination Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Type:</strong> {selectedShipment.destination.type}</p>
                            <p><strong>Name:</strong> {selectedShipment.destination.name}</p>
                            <p><strong>Address:</strong> {selectedShipment.destination.address}</p>
                          </div>
                        </div>

                        {/* Delivery Info Card - BRIGHT RED */}
                        <div className="bg-red-600 text-white p-6 rounded-lg shadow-md">
                          <h4 className="text-xl font-bold mb-3 flex items-center">
                            <span className="mr-3 text-2xl">🚚</span> Delivery Info
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Expected:</strong> {selectedShipment.expectedDelivery}</p>
                            <p><strong>Current:</strong> {selectedShipment.currentLocation}</p>
                            {gpsByShipment[selectedShipment.id] && (
                              <p><strong>GPS:</strong> {gpsByShipment[selectedShipment.id]?.lat.toFixed(4)}, {gpsByShipment[selectedShipment.id]?.lng.toFixed(4)}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - UPDATED STYLING TO BE BLACK */}
                      <div className="mt-6 flex flex-wrap gap-4">
                        <label className="flex-1 min-w-[150px] bg-white border-[2px] border-black text-black px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer text-center transition-colors duration-200 hover:text-white">
                          📷 Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files && onUploadPhoto(selectedShipment.id, e.target.files[0])}
                          />
                        </label>
                        <button
                          onClick={() => captureGPS(selectedShipment.id)}
                          className="flex-1 min-w-[150px] bg-white border-[2px] border-black text-black px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 hover:text-white"
                        >
                          📍 Capture GPS
                        </button>
                        <button
                          onClick={() => updateDeliveryStatus(selectedShipment.id)}
                          className="flex-1 min-w-[150px] bg-white border-[2px] border-black text-black px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 hover:text-white"
                        >
                          📦 Update Delivery
                        </button>
                        <button
                          onClick={() => openImageGallery(selectedShipment.id)}
                          className="flex-1 min-w-[150px] bg-white border-[2px] border-black text-black px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 hover:text-white"
                        >
                          🖼️ View All Images
                        </button>
                      </div>

                      {/* Recently Uploaded Photos Display */}
                      {(photosByShipment[selectedShipment.id] || []).length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-black mb-3">Recently Uploaded Photos</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {(photosByShipment[selectedShipment.id] || []).map((src, idx) => (
                              <img
                                key={idx}
                                src={src}
                                alt={`Recent upload ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pre-uploaded Images Preview */}
                      {selectedShipment.preUploadedImages && selectedShipment.preUploadedImages.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-black mb-3">Previous Shipment Images</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {selectedShipment.preUploadedImages.slice(0, 4).map((src: string, idx: number) => (
                              <img
                                key={idx}
                                src={src}
                                alt={`Previous shipment ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                            ))}
                          </div>
                          {selectedShipment.preUploadedImages.length > 4 && (
                            <p className="text-sm text-black mt-2">
                              +{selectedShipment.preUploadedImages.length - 4} more images. Click "View All Images" to see all.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-black">All Shipment Images</h3>
                  <p className="text-sm text-black">Batch ID: {selectedShipment?.batchId}</p>
                </div>
                <button
                  onClick={() => setShowImageGallery(false)}
                  className="text-black hover:text-red-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt={`Shipment image ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg">
                      Image {idx + 1}
                      {idx < (selectedShipment?.preUploadedImages?.length || 0) ? ' (Previous)' : ' (Recent)'}
                    </div>
                  </div>
                ))}
              </div>

              {galleryImages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-black">No images available for this shipment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}