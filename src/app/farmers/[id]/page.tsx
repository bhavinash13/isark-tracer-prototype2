'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockData } from '../../../../data/mockData';
import QRCodeComponent from '../../../components/QRCodeComponent';

export default function BatchDetailPage() {
  const [user, setUser] = useState<any>(null);
  const [batch, setBatch] = useState<any>(null);
  const [farmer, setFarmer] = useState<any>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Find the batch
    const foundFarmer = mockData.farmers.find(f => 
      f.products.some(p => p.id === params.id)
    );
    
    if (foundFarmer) {
      setFarmer(foundFarmer);
      const foundBatch = foundFarmer.products.find(p => p.id === params.id);
      if (foundBatch) {
        setBatch(foundBatch);
      }
    }
  }, [params.id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please login to access this page.</p>
          <Link href="/auth" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (!batch || !farmer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Batch Not Found</h2>
          <p className="text-gray-600 mb-4">The requested batch could not be found.</p>
          <Link href="/farmers" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const timeline = [
    {
      id: 1,
      stage: 'Harvested',
      actor: farmer.name,
      location: farmer.village,
      timestamp: batch.iotMetrics.timestamp,
      description: 'Herb batch harvested and initial data recorded',
      badge: 'blockchain-verified',
      color: 'green'
    },
    {
      id: 2,
      stage: 'Lab Testing',
      actor: 'Lab Tester A',
      location: 'Quality Lab',
      timestamp: batch.labResults.moisture ? new Date().toISOString() : null,
      description: 'Quality testing and certification',
      badge: 'quality-tested',
      color: 'blue'
    },
    {
      id: 3,
      stage: 'Processing',
      actor: 'Processor A',
      location: 'Processing Facility',
      timestamp: batch.processingSteps.length > 0 ? new Date().toISOString() : null,
      description: 'Processing and manufacturing steps',
      badge: 'processing-complete',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/farmers"
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{batch.name}</h1>
            <p className="text-gray-600">Batch ID: {batch.id}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Batch Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Batch Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Herb Name</label>
                    <p className="mt-1 text-sm text-gray-900">{batch.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Stage</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      batch.stage === 'Harvested' ? 'bg-yellow-100 text-yellow-800' :
                      batch.stage === 'Approved for Lab Testing' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {batch.stage}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Farmer</label>
                    <p className="mt-1 text-sm text-gray-900">{farmer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-sm text-gray-900">{farmer.village}</p>
                  </div>
                </div>
              </div>

              {/* IoT Metrics */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">IoT Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{batch.iotMetrics.temperature}°C</div>
                    <div className="text-sm text-gray-600">Temperature</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{batch.iotMetrics.humidity}%</div>
                    <div className="text-sm text-gray-600">Humidity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {new Date(batch.iotMetrics.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">Last Updated</div>
                  </div>
                </div>
              </div>

              {/* Lab Results */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lab Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Moisture Content</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {batch.labResults.moisture ? `${batch.labResults.moisture}%` : 'Pending'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pesticide Residue</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {batch.labResults.pesticide || 'Pending'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">DNA Verification</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {batch.labResults.dna || 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Processing Steps */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Processing Steps</h2>
                {batch.processingSteps.length > 0 ? (
                  <div className="space-y-4">
                    {batch.processingSteps.map((step: any, index: number) => (
                      <div key={index} className="border-l-4 border-green-400 pl-4">
                        <h3 className="font-medium text-gray-900">{step.name}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        <p className="text-xs text-gray-500">{step.timestamp}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No processing steps recorded yet.</p>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Supply Chain Timeline</h2>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {timeline.map((event, eventIdx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== timeline.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  event.color === 'green' ? 'bg-green-500' :
                                  event.color === 'blue' ? 'bg-blue-500' :
                                  'bg-purple-500'
                                }`}
                              >
                                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium text-gray-900">{event.actor}</span> at {event.location}
                                </p>
                                <p className="text-sm text-gray-900">{event.description}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {event.timestamp ? new Date(event.timestamp).toLocaleDateString() : 'Pending'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* QR Code */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">QR Code</h3>
                <QRCodeComponent 
                  value={`${window.location.origin}/provenance/${batch.id}`}
                  size={200}
                />
              </div>

              {/* Photos */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Photos</h3>
                <div className="space-y-4">
                  {batch.photos.map((photo: string, index: number) => (
                    <div key={index} className="aspect-w-16 aspect-h-9">
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">🌿</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blockchain Badges */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Blockchain Badges</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Blockchain Verified</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Quality Tested</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Processing Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}