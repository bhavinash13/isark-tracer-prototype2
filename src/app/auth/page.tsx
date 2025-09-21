'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { users } from '../../../data/mockData';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  useEffect(() => {
    if (role) {
      setFormData(prev => ({ ...prev, role }));
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login logic
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        // Store user in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(user));
        // Navigate to appropriate dashboard
        const dashboardMap: { [key: string]: string } = {
          farmer: '/farmers',
          lab: '/lab-tester',
          processor: '/processor',
          regulator: '/regulator'
        };
        router.push(dashboardMap[user.role] || '/');
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Signup logic - for demo purposes, just redirect to login
      if (formData.name && formData.email && formData.password && formData.role) {
        alert('Account created successfully! Please login with your credentials.');
        setIsLogin(true);
        setFormData(prev => ({ ...prev, name: '' }));
      } else {
        setError('Please fill in all fields');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const roleInfo = {
    farmer: { title: 'Farmer', description: 'Manage herb batches and track growth', color: 'green' },
    lab: { title: 'Lab Tester', description: 'Conduct quality tests and certification', color: 'blue' },
    processor: { title: 'Processor', description: 'Handle processing and manufacturing', color: 'purple' },
    regulator: { title: 'Regulator', description: 'Monitor compliance and oversight', color: 'orange' }
  };

  const currentRole = roleInfo[formData.role as keyof typeof roleInfo];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">I</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ISARK Tracer</span>
          </Link>
          
          {currentRole && (
            <div className={`bg-${currentRole.color}-50 border border-${currentRole.color}-200 rounded-lg p-4 mb-6`}>
              <h2 className={`text-lg font-semibold text-${currentRole.color}-900`}>
                {currentRole.title} Access
              </h2>
              <p className={`text-sm text-${currentRole.color}-700`}>
                {currentRole.description}
              </p>
            </div>
          )}

          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required={!isLogin}
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="">Select your role</option>
                  <option value="farmer">Farmer</option>
                  <option value="lab">Lab Tester</option>
                  <option value="processor">Processor</option>
                  <option value="regulator">Regulator</option>
                </select>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLogin ? 'Sign in' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-600 hover:text-green-500 text-sm font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs">
              <p>Farmer: farmer1@example.com / 1234</p>
              <p>Lab: lab1@example.com / 1234</p>
              <p>Processor: proc1@example.com / 1234</p>
              <p>Regulator: regulator@example.com / 1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
