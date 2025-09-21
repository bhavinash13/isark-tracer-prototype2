"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const roles = [
    {
      id: "farmer",
      title: "Farmer",
      description: "Manage your farm, track crops, and record harvest data",
      icon: "🌾",
      href: "/auth?role=farmer",
      color: "from-green-500 to-emerald-600",
      hoverColor: "from-green-600 to-emerald-700"
    },
    {
      id: "lab-tester",
      title: "Lab Tester",
      description: "Conduct quality tests and generate certification reports",
      icon: "🧪",
      href: "/auth?role=lab",
      color: "from-blue-500 to-cyan-600",
      hoverColor: "from-blue-600 to-cyan-700"
    },
    {
      id: "processor",
      title: "Processor/Manufacturer",
      description: "Track processing stages and manage production workflows",
      icon: "🏭",
      href: "/auth?role=processor",
      color: "from-purple-500 to-violet-600",
      hoverColor: "from-purple-600 to-violet-700"
    },
    {
      id: "regulator",
      title: "Regulator",
      description: "Monitor compliance and oversee regulatory requirements",
      icon: "📋",
      href: "/auth?role=regulator",
      color: "from-orange-500 to-red-600",
      hoverColor: "from-orange-600 to-red-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ISARK Tracer</h1>
            </div>
            <div className="text-sm text-gray-500">
              Supply Chain Transparency Platform
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              ISARK Tracer
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A comprehensive supply chain transparency platform that connects farmers, 
            processors, testers, and regulators in a seamless ecosystem of trust and traceability.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Quality Assurance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Regulatory Compliance</span>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-12">
            Select Your Role
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <Link
                key={role.id}
                href={role.href}
                className="group"
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${hoveredRole === role.id ? role.hoverColor : role.color} flex items-center justify-center text-3xl shadow-lg`}>
                      {role.icon}
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {role.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {role.description}
                    </p>
                    <div className="mt-6">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${role.color} text-white shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                        Access Dashboard
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-12">
            Platform Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analytics</h4>
              <p className="text-gray-600 text-sm">
                Track your supply chain performance with comprehensive analytics and insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure & Trusted</h4>
              <p className="text-gray-600 text-sm">
                Enterprise-grade security with blockchain technology for data integrity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Collaborative</h4>
              <p className="text-gray-600 text-sm">
                Seamless collaboration between all stakeholders in the supply chain.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">I</span>
              </div>
              <span className="text-xl font-semibold">ISARK Tracer</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering supply chain transparency through technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
