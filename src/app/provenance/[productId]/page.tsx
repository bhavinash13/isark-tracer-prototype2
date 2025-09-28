'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockData } from '../../../../data/mockData';
import QRCodeComponent from '../../../components/QRCodeComponent';

export default function ProvenancePage() {
  const [batch, setBatch] = useState<any>(null);
  const [farmer, setFarmer] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Find the batch
    const foundFarmer = mockData.farmers.find(f => 
      f.products.some(p => p.id === params.productId)
    );
    
    if (foundFarmer) {
      setFarmer(foundFarmer);
      const foundBatch = foundFarmer.products.find(p => p.id === params.productId);
      if (foundBatch) {
        setBatch(foundBatch);
        
        // Create timeline
        const timelineData = [
          {
            id: 1,
            stage: 'Harvested',
            actor: foundFarmer.name,
            location: foundFarmer.village,
            timestamp: foundBatch.iotMetrics.timestamp,
            description: 'Herb batch harvested and initial data recorded',
            badge: 'blockchain-verified',
            color: 'green',
            icon: '🌾',
            details: {
              temperature: foundBatch.iotMetrics.temperature,
              humidity: foundBatch.iotMetrics.humidity,
              coordinates: `${foundFarmer.location.lat}, ${foundFarmer.location.lng}`
            }
          },
          {
            id: 2,
            stage: 'Lab Testing',
            actor: 'Lab Tester A',
            location: 'Quality Lab',
            timestamp: foundBatch.labResults.moisture ? new Date().toISOString() : null,
            description: 'Quality testing and certification',
            badge: 'quality-tested',
            color: 'blue',
            icon: '🧪',
            details: foundBatch.labResults.moisture ? {
              moisture: foundBatch.labResults.moisture,
              pesticide: foundBatch.labResults.pesticide,
              dna: foundBatch.labResults.dna
            } : null
          },
          {
            id: 3,
            stage: 'Processing',
            actor: 'Processor A',
            location: 'Processing Facility',
            timestamp: foundBatch.processingSteps && foundBatch.processingSteps.length > 0 ? new Date().toISOString() : null,
            description: 'Processing and manufacturing steps',
            badge: 'processing-complete',
            color: 'purple',
            icon: '🏭',
            details: Array.isArray(foundBatch.processingSteps) && foundBatch.processingSteps.length > 0 ? {
              steps: foundBatch.processingSteps.length,
              latestStep: (foundBatch.processingSteps[foundBatch.processingSteps.length - 1] as { name?: string })?.name
            } : null
          },
          {
            id: 4,
            stage: 'Manufacturing',
            actor: 'Manufacturer A',
            location: 'Manufacturing Plant',
            timestamp: foundBatch.stage === 'Ready for Shipment' ? new Date().toISOString() : null,
            description: 'Product manufacturing and packaging',
            badge: 'manufacturing-complete',
            color: 'orange',
            icon: '⚗️',
            details: foundBatch.stage === 'Ready for Shipment' ? {
              status: 'Ready for distribution',
              packaging: 'Certified organic packaging'
            } : null
          },
          {
            id: 5,
            stage: 'Distribution',
            actor: 'Distributor A',
            location: 'Distribution Center',
            timestamp: null,
            description: 'Product distribution to retailers',
            badge: 'distribution-ready',
            color: 'red',
            icon: '🚚',
            details: null
          }
        ];
        
        setTimeline(timelineData);
      }
    }
  }, [params.productId]);

  if (!batch || !farmer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The requested product could not be found in our system.</p>
          <Link href="/" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Product Provenance</h1>
            <p className="text-gray-600">Complete supply chain traceability for {batch.name}</p>
          </div>

          {/* Product Summary */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <p className="text-sm text-gray-900">{batch.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Batch ID</label>
                    <p className="text-sm text-gray-900 font-mono">{batch.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Stage</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      batch.stage === 'Harvested' ? 'bg-yellow-100 text-yellow-800' :
                      batch.stage === 'Approved for Lab Testing' ? 'bg-green-100 text-green-800' :
                      batch.stage.includes('Processing') ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {batch.stage}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code</h2>
                <QRCodeComponent 
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/provenance/${batch.id}`}
                  size={150}
                />
              </div>
            </div>
          </div>

          {/* Supply Chain Timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Supply Chain Timeline</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {timeline.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-8">
                      {eventIdx !== timeline.length - 1 ? (
                        <span
                          className="absolute top-8 left-8 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-16 w-16 rounded-full flex items-center justify-center ring-8 ring-white text-2xl ${
                              event.color === 'green' ? 'bg-green-500' :
                              event.color === 'blue' ? 'bg-blue-500' :
                              event.color === 'purple' ? 'bg-purple-500' :
                              event.color === 'orange' ? 'bg-orange-500' :
                              'bg-gray-300'
                            }`}
                          >
                            {event.icon}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{event.stage}</h3>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">{event.actor}</span> at {event.location}
                              </p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              {event.timestamp ? new Date(event.timestamp).toLocaleDateString() : 'Pending'}
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-700">{event.description}</p>
                          
                          {event.details && (
                            <div className="mt-3 bg-gray-50 rounded-lg p-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Details:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                {Object.entries(event.details).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {String(value)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.color === 'green' ? 'bg-green-100 text-green-800' :
                              event.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                              event.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                              event.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {event.badge.replace('-', ' ')}
                            </span>
                            {event.timestamp && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Blockchain Verification */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Blockchain Verification</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Data Integrity</h3>
                <p className="text-xs text-gray-600">All data cryptographically verified</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Immutable Record</h3>
                <p className="text-xs text-gray-600">Tamper-proof transaction history</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Transparency</h3>
                <p className="text-xs text-gray-600">Full supply chain visibility</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}