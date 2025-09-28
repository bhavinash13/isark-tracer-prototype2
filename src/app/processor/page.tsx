'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// import { mockData } from '../../../data/mockData'; 

// Placeholder for mockData if you don't provide the file
const mockData = {
    processors: [{ id: 'proc-1', email: 'processor@example.com', name: 'Global Herb Processing', assignedBatches: ['BTCH-001', 'BTCH-002'], license: 'PROC-GHP-9876', phone: '+1-555-PROC' }],
    farmers: [
        { id: 'farm-1', products: [{ id: 'BTCH-001', name: 'Ashwagandha Batch A', stage: 'Harvested' }] },
        { id: 'farm-2', products: [{ id: 'BTCH-002', name: 'Brahmi Batch B', stage: 'Drying' }] },
    ],
};

export default function ProcessorPage() {
    // --- START: Hooks defined correctly inside the component function ---
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
    const [photosByBatch, setPhotosByBatch] = useState<Record<string, string[]>>({});
    const [gpsByBatch, setGpsByBatch] = useState<Record<string, { lat: number; lng: number } | null>>({});
    const [showProfile, setShowProfile] = useState(false); 
    // --- END: Hooks defined correctly ---


    useEffect(() => {
        // --- START: Simulate successful login data for the dashboard to always show ---
        const mockUserId = 'proc-1'; 
        const processorMock = mockData.processors.find(p => p.id === mockUserId);

        const mockUser = {
            id: mockUserId,
            email: processorMock?.email || 'processor@example.com',
            role: 'processor',
            name: processorMock?.name || 'Global Herb Processing Co.',
            license: processorMock?.license || 'PROC-GHP-9876',
            phone: processorMock?.phone || '+1-555-PROC'
        };
        setUser(mockUser);

        if (processorMock) {
            const batches = mockData.farmers.flatMap(farmer =>
                farmer.products.filter(product =>
                    processorMock.assignedBatches.includes(product.id)
                )
            );
            setAssignedBatches(batches.map(b => ({
                ...b,
                stage: b.stage || 'Received', 
                processingSteps: b.processingSteps || [] 
            })));
        }
        // --- END: Simulate successful login data ---
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
            // alert(`New step "${processingStep.name}" added to Batch ${selectedBatch.id}`);
        }
    };

    const markReadyForShipment = (batchId: string) => {
        setAssignedBatches(prev => prev.map(batch =>
            batch.id === batchId
                ? { ...batch, stage: 'Ready for Shipment' }
                : batch
        ));
        // alert(`Batch ${batchId} marked as Ready for Shipment.`);
    };

    const onUploadPhoto = (batchId: string, file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setPhotosByBatch(prev => ({ ...prev, [batchId]: [...(prev[batchId] || []), String(reader.result)] }));
        };
        reader.readAsDataURL(file);
        // alert(`Photo uploaded for Batch ${batchId}.`);
    };

    const captureGPS = (batchId: string) => {
        if (!navigator.geolocation) {
            // alert("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition((pos) => {
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setGpsByBatch(prev => ({ ...prev, [batchId]: coords }));
            // alert(`GPS captured for Batch ${batchId}: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        }, (error) => {
            console.error(`Error getting GPS location: ${error.message}`);
        });
    };
    
    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        // alert("Logged out. In a real app, this would redirect.");
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
    
    // Processor info for header display
    const processorInfo = {
        name: user.name,
        initial: user.name.charAt(0),
        licenseNumber: user.license,
        phone: user.phone,
        email: user.email
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    
                    {/* Header: STYLED LIKE TRANSPORTER, BUT WITH PROCESSOR DATA */}
                    <div className="bg-white shadow-sm border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center py-4">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg mr-4"> {/* Changed color to purple for processor */}
                                        <span className="text-4xl">🏭</span> {/* Factory/Processing emoji */}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-black">Processor Dashboard</h1>
                                        {/* Display processor name and a key detail */}
                                        <p className="text-sm text-black">{processorInfo.name} - License: {processorInfo.licenseNumber}</p>
                                    </div>
                                </div>

                                {/* Profile Section */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfile(!showProfile)}
                                        className="flex items-center space-x-3 bg-gray-100 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium"> {/* Changed color */}
                                            S
                                        </div>
                                        <span className="text-sm font-medium text-black">Srinivas</span>
                                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Profile Modal */}
                                    {showProfile && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                            <div className="p-4">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium text-lg"> {/* Changed color */}
                                                        Srinivas
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-black">Srinivas</p>
                                                        <p className="text-sm text-black">{processorInfo.email}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm text-black mb-4">
                                                    <div className="flex justify-between">
                                                        <span>License:</span>
                                                        <span className="font-medium">{processorInfo.licenseNumber}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Phone:</span>
                                                        <span className="font-medium">{processorInfo.phone}</span>
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
                    {/* END Header */}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-6">
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
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

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
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

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
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

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
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
                                                    </div>
                                                    {photosByBatch[batch.id]?.length ? (
                                                        <div className="mt-2 grid grid-cols-3 gap-2">
                                                            {photosByBatch[batch.id].map((src, idx) => (
                                                                <img key={idx} src={src} alt="proc" className="w-full h-16 object-cover rounded" />
                                                            ))}
                                                        </div>
                                                    ) : null}
                                                    {gpsByBatch[batch.id] && (
                                                        <div className="text-xs text-gray-500 mt-1">GPS: {gpsByBatch[batch.id]?.lat.toFixed(4)}, {gpsByBatch[batch.id]?.lng.toFixed(4)}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <label className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer">
                                                Upload Photo
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && onUploadPhoto(batch.id, e.target.files[0])} />
                                            </label>
                                            <button onClick={() => captureGPS(batch.id)} className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Capture GPS</button>
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