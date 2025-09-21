'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockData } from '../../../data/mockData';

export default function ProcessorPage() {
  const [user, setUser] = useState<any>(null);
  const [assignedBatches, setAssignedBatches] = useState<any[]>([]);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [processingStep, setProcessingStep] = useState({
    name: '',
    description: '',
    duration: '',
    temperature: '',
    notes: ''
  });

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Get assigned batches
      const processor = mockData.processors.find(p => p.id === parsedUser.id);
      if (processor) {
        const batches = mockData.farmers.flatMap(farmer => 
          farmer.products.filter(product => 
            processor.assignedBatches.includes(product.id)
          )
        );
        setAssignedBatches(batches);
      }
    }
  }, []);

  const openProcessingModal = (batch: any) => {
    setSelectedBatch(batch);
    setProcessingStep({
      name: '',
      description: '',
      duration: '',
      temperature: '',
      notes: ''
    });
    setShowProcessingModal(true);
  };

  const handleProcessingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBatch && processingStep.name) {
      const newStep = {
        ...processingStep,
        timestamp: new Date().toISOString(),
        processor: user.email
      };
      
      setAssignedBatches(prev => prev.map(batch => 
        batch.id === selectedBatch.id 
          ? { 
              ...batch, 
              processingSteps: [...(batch.processingSteps || []), newStep],
              stage: 'Processing - ' + processingStep.name
            }
          : batch
      ));
      setShowProcessingModal(false);
      setSelectedBatch(null);
    }
  };

  const markReadyForShipment = (batchId: string) => {
    setAssignedBatches(prev => prev.map(batch => 
      batch.id === batchId 
        ? { ...batch, stage: 'Ready for Shipment' }
        : batch
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please login to access the processor dashboard.</p>
          <Link href="/auth?role=processor" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Login as Processor
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
            <h1 className="text-3xl font-bold text-gray-900">Processor Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Track processing stages and manage production workflows for herb batches.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Processing</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {assignedBatches.filter(b => b.stage.includes('Processing')).length}
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
                  <p className="text-sm font-medium text-gray-600">Ready for Shipment</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {assignedBatches.filter(b => b.stage === 'Ready for Shipment').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Processing Steps</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {assignedBatches.reduce((total, batch) => total + (batch.processingSteps?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Batches */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Assigned Batches for Processing</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {assignedBatches.map((batch) => (
                <div key={batch.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🏭</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{batch.name}</h4>
                          <p className="text-sm text-gray-600">Batch ID: {batch.id}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              batch.stage === 'Ready for Shipment' ? 'bg-green-100 text-green-800' :
                              batch.stage.includes('Processing') ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {batch.stage}
                            </span>
                            <span className="text-sm text-gray-500">
                              Steps: {batch.processingSteps?.length || 0}
                            </span>
                            {batch.labResults.moisture && (
                              <span className="text-sm text-gray-500">
                                Lab Tested: ✓
                              </span>
                            )}
                          </div>
                          {batch.processingSteps && batch.processingSteps.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                              Latest: {batch.processingSteps[batch.processingSteps.length - 1].name}
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
                        onClick={() => openProcessingModal(batch)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Add Processing Step
                      </button>
                      {batch.processingSteps && batch.processingSteps.length > 0 && batch.stage !== 'Ready for Shipment' && (
                        <button
                          onClick={() => markReadyForShipment(batch.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Mark Ready for Shipment
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

      {/* Processing Step Modal */}
      {showProcessingModal && selectedBatch && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add Processing Step - {selectedBatch.name}
              </h3>
              <form onSubmit={handleProcessingSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Step Name
                  </label>
                  <select
                    value={processingStep.name}
                    onChange={(e) => setProcessingStep(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Select processing step</option>
                    <option value="Drying">Drying</option>
                    <option value="Grinding">Grinding</option>
                    <option value="Storage">Storage</option>
                    <option value="Quality Check">Quality Check</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={processingStep.description}
                    onChange={(e) => setProcessingStep(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    rows={3}
                    placeholder="Describe the processing step..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      value={processingStep.duration}
                      onChange={(e) => setProcessingStep(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., 24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      value={processingStep.temperature}
                      onChange={(e) => setProcessingStep(prev => ({ ...prev, temperature: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., 40"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={processingStep.notes}
                    onChange={(e) => setProcessingStep(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    rows={2}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowProcessingModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Add Step
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