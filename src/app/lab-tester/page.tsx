'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockData } from '../../../data/mockData';

export default function LabTesterPage() {
  const [user, setUser] = useState<any>(null);
  const [assignedBatches, setAssignedBatches] = useState<any[]>([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [testResults, setTestResults] = useState({
    moisture: '',
    pesticide: '',
    dna: '',
    notes: ''
  });

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Get assigned batches
      const lab = mockData.labs.find(l => l.id === parsedUser.id);
      if (lab) {
        const batches = mockData.farmers.flatMap(farmer => 
          farmer.products.filter(product => 
            lab.assignedBatches.includes(product.id)
          )
        );
        setAssignedBatches(batches);
      }
    }
  }, []);

  const openTestModal = (batch: any) => {
    setSelectedBatch(batch);
    setTestResults({
      moisture: batch.labResults.moisture || '',
      pesticide: batch.labResults.pesticide || '',
      dna: batch.labResults.dna || '',
      notes: ''
    });
    setShowTestModal(true);
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBatch) {
      setAssignedBatches(prev => prev.map(batch => 
        batch.id === selectedBatch.id 
          ? { 
              ...batch, 
              labResults: {
                moisture: testResults.moisture,
                pesticide: testResults.pesticide,
                dna: testResults.dna
              },
              stage: 'Lab Tested - Ready for Processing'
            }
          : batch
      ));
      setShowTestModal(false);
      setSelectedBatch(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please login to access the lab tester dashboard.</p>
          <Link href="/auth?role=lab" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Login as Lab Tester
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Lab Tester Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Conduct quality tests and generate certification reports for herb batches.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Assigned Batches</p>
                  <p className="text-2xl font-semibold text-gray-900">{assignedBatches.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Pending Tests</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {assignedBatches.filter(b => !b.labResults.moisture).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tests Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {assignedBatches.filter(b => b.labResults.moisture).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Certificates</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {assignedBatches.filter(b => b.labResults.moisture).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Batches */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Assigned Batches for Testing</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {assignedBatches.map((batch) => (
                <div key={batch.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🧪</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{batch.name}</h4>
                          <p className="text-sm text-gray-600">Batch ID: {batch.id}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              batch.labResults.moisture ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {batch.labResults.moisture ? 'Tested' : 'Pending Test'}
                            </span>
                            <span className="text-sm text-gray-500">
                              Temp: {batch.iotMetrics.temperature}°C
                            </span>
                            <span className="text-sm text-gray-500">
                              Humidity: {batch.iotMetrics.humidity}%
                            </span>
                          </div>
                          {batch.labResults.moisture && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="mr-4">Moisture: {batch.labResults.moisture}%</span>
                              <span className="mr-4">Pesticide: {batch.labResults.pesticide}</span>
                              <span>DNA: {batch.labResults.dna}</span>
                            </div>
                          )}
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
                      <button
                        onClick={() => openTestModal(batch)}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          batch.labResults.moisture 
                            ? 'bg-gray-600 text-white hover:bg-gray-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {batch.labResults.moisture ? 'Update Results' : 'Add Test Results'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Test Results Modal */}
      {showTestModal && selectedBatch && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Test Results - {selectedBatch.name}
              </h3>
              <form onSubmit={handleTestSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={testResults.moisture}
                    onChange={(e) => setTestResults(prev => ({ ...prev, moisture: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 12.5"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesticide Residue
                  </label>
                  <select
                    value={testResults.pesticide}
                    onChange={(e) => setTestResults(prev => ({ ...prev, pesticide: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select result</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                    <option value="Within Limits">Within Limits</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNA Verification
                  </label>
                  <select
                    value={testResults.dna}
                    onChange={(e) => setTestResults(prev => ({ ...prev, dna: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select result</option>
                    <option value="Verified">Verified</option>
                    <option value="Not Verified">Not Verified</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={testResults.notes}
                    onChange={(e) => setTestResults(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Additional notes or observations..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowTestModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Results
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