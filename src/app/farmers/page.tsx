'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockData } from '../../../data/mockData';
import QRCodeComponent from '../../components/QRCodeComponent';
import NetworkDiagram from '../../components/NetworkDiagram';

export default function FarmersPage() {
  const [user, setUser] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: '',
    location: '',
    photo: ''
  });

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Get farmer's batches
      const farmer = mockData.farmers.find(f => f.id === parsedUser.id);
      if (farmer) {
        setBatches(farmer.products);
      }
    }
  }, []);

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBatch.name && newBatch.location) {
      const batch = {
        id: `p${Date.now()}`,
        name: newBatch.name,
        stage: 'Harvested',
        photos: [newBatch.photo || 'default-herb.jpg'],
        iotMetrics: {
          temperature: Math.floor(Math.random() * 10) + 20,
          humidity: Math.floor(Math.random() * 20) + 50,
          timestamp: new Date().toISOString()
        },
        labResults: { moisture: null, pesticide: null, dna: null },
        processingSteps: []
      };
      
      setBatches(prev => [...prev, batch]);
      setNewBatch({ name: '', location: '', photo: '' });
      setShowAddBatch(false);
    }
  };

  const approveBatch = (batchId: string) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId 
        ? { ...batch, stage: 'Approved for Lab Testing' }
        : batch
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please login to access the farmer dashboard.</p>
          <Link href="/auth?role=farmer" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Login as Farmer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Manage your herb batches and track their journey through the supply chain.
              </p>
            </div>
            <button
              onClick={() => setShowAddBatch(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add New Batch
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Batches</p>
                  <p className="text-2xl font-semibold text-gray-900">{batches.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {batches.filter(b => b.stage === 'Approved for Lab Testing').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {batches.filter(b => b.stage === 'Harvested').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Processing</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {batches.filter(b => b.stage.includes('Processing')).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Network Diagram */}
          <div className="mb-8">
            <NetworkDiagram />
          </div>

          {/* Batches List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Your Herb Batches</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {batches.map((batch) => (
                <div key={batch.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🌿</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{batch.name}</h4>
                          <p className="text-sm text-gray-600">Batch ID: {batch.id}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              batch.stage === 'Harvested' ? 'bg-yellow-100 text-yellow-800' :
                              batch.stage === 'Approved for Lab Testing' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {batch.stage}
                            </span>
                            <span className="text-sm text-gray-500">
                              Temp: {batch.iotMetrics.temperature}°C
                            </span>
                            <span className="text-sm text-gray-500">
                              Humidity: {batch.iotMetrics.humidity}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/farmers/${batch.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                      {batch.stage === 'Harvested' && (
                        <button
                          onClick={() => approveBatch(batch.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Approve for Testing
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddBatch && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Batch</h3>
              <form onSubmit={handleAddBatch}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Herb Name
                  </label>
                  <input
                    type="text"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Ashwagandha"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newBatch.location}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Village X, District Y"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newBatch.photo}
                    onChange={(e) => setNewBatch(prev => ({ ...prev, photo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddBatch(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Add Batch
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}