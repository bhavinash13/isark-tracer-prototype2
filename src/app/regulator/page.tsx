'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockData } from '../../../data/mockData';

export default function RegulatorPage() {
  const [user, setUser] = useState<any>(null);
  const [allBatches, setAllBatches] = useState<any[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFarmer, setSelectedFarmer] = useState('all');

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Get all batches from all farmers
    const batches = mockData.farmers.flatMap(farmer => 
      farmer.products.map(product => ({
        ...product,
        farmer: farmer.name,
        farmerId: farmer.id,
        village: farmer.village,
        location: farmer.location
      }))
    );
    setAllBatches(batches);
    setFilteredBatches(batches);
  }, []);

  useEffect(() => {
    let filtered = allBatches;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(batch => 
        batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.farmer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by herb type
    if (filterType !== 'all') {
      filtered = filtered.filter(batch => batch.name.toLowerCase().includes(filterType.toLowerCase()));
    }

    // Filter by farmer
    if (selectedFarmer !== 'all') {
      filtered = filtered.filter(batch => batch.farmerId === selectedFarmer);
    }

    setFilteredBatches(filtered);
  }, [searchTerm, filterType, selectedFarmer, allBatches]);

  const getComplianceStatus = (batch: any) => {
    if (batch.labResults.moisture && batch.labResults.pesticide && batch.labResults.dna) {
      return { status: 'Compliant', color: 'green' };
    } else if (batch.labResults.moisture || batch.labResults.pesticide || batch.labResults.dna) {
      return { status: 'Partial', color: 'yellow' };
    } else {
      return { status: 'Pending', color: 'red' };
    }
  };

  const getSustainabilityScore = (batch: any) => {
    let score = 0;
    if (batch.iotMetrics.temperature >= 20 && batch.iotMetrics.temperature <= 30) score += 25;
    if (batch.iotMetrics.humidity >= 50 && batch.iotMetrics.humidity <= 70) score += 25;
    if (batch.labResults.pesticide === 'Pass' || batch.labResults.pesticide === 'Within Limits') score += 25;
    if (batch.processingSteps && batch.processingSteps.length > 0) score += 25;
    return score;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please login to access the regulator dashboard.</p>
          <Link href="/auth?role=regulator" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
            Login as Regulator
          </Link>
        </div>
      </div>
    );
  }

  const uniqueFarmers = Array.from(new Set(allBatches.map(batch => batch.farmerId)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Regulator Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Monitor compliance and oversee regulatory requirements across the supply chain.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Batches</p>
                  <p className="text-2xl font-semibold text-gray-900">{allBatches.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Compliant</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {allBatches.filter(batch => getComplianceStatus(batch).status === 'Compliant').length}
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
                  <p className="text-sm font-medium text-gray-600">Partial</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {allBatches.filter(batch => getComplianceStatus(batch).status === 'Partial').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {allBatches.filter(batch => getComplianceStatus(batch).status === 'Pending').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Batch Volume Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Volumes by Herb Type</h3>
              <div className="space-y-4">
                {['Ashwagandha', 'Brahmi'].map(herb => {
                  const count = allBatches.filter(batch => batch.name === herb).length;
                  const percentage = allBatches.length > 0 ? (count / allBatches.length) * 100 : 0;
                  return (
                    <div key={herb}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{herb}</span>
                        <span className="text-gray-900">{count} batches</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compliance Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Status</h3>
              <div className="space-y-4">
                {['Compliant', 'Partial', 'Pending'].map(status => {
                  const count = allBatches.filter(batch => getComplianceStatus(batch).status === status).length;
                  const percentage = allBatches.length > 0 ? (count / allBatches.length) * 100 : 0;
                  const color = status === 'Compliant' ? 'green' : status === 'Partial' ? 'yellow' : 'red';
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{status}</span>
                        <span className="text-gray-900">{count} batches</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-${color}-600`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter & Search</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Search by batch ID, herb name, or farmer..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Herb Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Types</option>
                  <option value="ashwagandha">Ashwagandha</option>
                  <option value="brahmi">Brahmi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farmer</label>
                <select
                  value={selectedFarmer}
                  onChange={(e) => setSelectedFarmer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Farmers</option>
                  {uniqueFarmers.map(farmerId => {
                    const farmer = mockData.farmers.find(f => f.id === farmerId);
                    return (
                      <option key={farmerId} value={farmerId}>
                        {farmer?.name || farmerId}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* Batches Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Batches ({filteredBatches.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Farmer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compliance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sustainability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBatches.map((batch) => {
                    const compliance = getComplianceStatus(batch);
                    const sustainability = getSustainabilityScore(batch);
                    return (
                      <tr key={batch.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                            <div className="text-sm text-gray-500">{batch.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{batch.farmer}</div>
                            <div className="text-sm text-gray-500">{batch.village}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            batch.stage === 'Harvested' ? 'bg-yellow-100 text-yellow-800' :
                            batch.stage === 'Approved for Lab Testing' ? 'bg-green-100 text-green-800' :
                            batch.stage.includes('Processing') ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {batch.stage}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            compliance.color === 'green' ? 'bg-green-100 text-green-800' :
                            compliance.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {compliance.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  sustainability >= 75 ? 'bg-green-600' :
                                  sustainability >= 50 ? 'bg-yellow-600' :
                                  'bg-red-600'
                                }`}
                                style={{ width: `${sustainability}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{sustainability}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/farmers/${batch.id}`}
                            className="text-orange-600 hover:text-orange-900 mr-4"
                          >
                            View Details
                          </Link>
                          <Link
                            href={`/provenance/${batch.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Provenance
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}