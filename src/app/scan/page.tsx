'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockData } from '../../../data/mockData';
import Image from 'next/image';
import exampleQR from '../../assets/exampleQR.png';
import ISARKlogo from '../../assets/ISARKlogo.png';

export default function ScanPage() {
  const [inputId, setInputId] = useState('');
  const allBatches = mockData.farmers.flatMap(f => f.products);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col justify-center items-center p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 border-2 border-emerald-600 rounded-xl p-3 mb-12 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="w-15 h-15 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <div className="p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300">
          <Image
            src={ISARKlogo}
            alt="ISARK_LOGO"
            width={25}
            height={25}
            className="rounded-lg"
          />
        </div>
        </div>
        <h1 className="text-2xl font-extrabold text-emerald-800 tracking-wide">ISARK Tracer</h1>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-3">Scan this QR</h1>
      <p className="text-gray-600 max-w-md text-center mb-6">
        This QR will take you to the complete journey of a product called{" "}
        <span className="font-semibold text-emerald-700">Premium Ashwagandha Capsules</span>.
      </p>

      {/* QR Image */}
      <div className="p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300">
        <Image
          src={exampleQR}
          alt="Example QR"
          width={300}
          height={300}
          className="rounded-lg"
        />
      </div>

      {/* Footer note */}
      <p className="mt-6 text-sm text-gray-500">
        Powered by <span className="text-emerald-700 font-semibold">ISARK Supply Chain</span>
      </p>
    </div>
  );
}
