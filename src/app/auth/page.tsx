'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { users } from '../../../data/mockData';

function AuthContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [isHindi, setIsHindi] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    pin: '',
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
      const input = formData.emailOrPhone.trim();
      const pin = formData.pin.trim();
      const isValidPin = /^\d{6}$/.test(pin) || /^\d{4}$/.test(pin);

      if (!isValidPin) {
        setError('Please enter a 6-digit PIN (or 4-digit demo code).');
        return;
      }

      const user = users.find(
        u =>
          (u.email === input || u.phone === input) &&
          (u.pin === pin || u.password === pin)
      );

      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        if (user.role === 'farmer') {
          sessionStorage.setItem('farmerId', user.id.trim());
        }

        const dashboardMap: { [key: string]: string } = {
          farmer: '/farmers',
          lab: '/lab-tester',
          processor: '/processor',
          regulator: '/regulator',
          transporter: '/transporter',
          manufacturer: '/manufacturer'
        };

        router.push(dashboardMap[user.role] || '/');
      } else {
        setError('Invalid credentials. Use email/phone and 6-digit PIN.');
      }
    } else {
      if (formData.name && formData.emailOrPhone && formData.pin && formData.role) {
        const pinOk = /^\d{6}$/.test(formData.pin);
        if (!pinOk) {
          setError('PIN must be exactly 6 digits for signup.');
          return;
        }
        alert('Account created for demo! Please login with the entered details.');
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
    farmer: { title: 'Farmer', description: 'Manage herb batches and track growth', color: 'green', icon: '🌾' },
    lab: { title: 'Lab Tester', description: 'Conduct quality tests and certification', color: 'green', icon: '🧪' },
    processor: { title: 'Processor', description: 'Handle processing and manufacturing', color: 'green', icon: '🏭' },
    regulator: { title: 'Regulator', description: 'Monitor compliance and oversight', color: 'green', icon: '🛡️' },
    transporter: { title: 'Transporter', description: 'Pickup and deliver batches', color: 'green', icon: '🚚' },
    manufacturer: { title: 'Manufacturer', description: 'Aggregate batches and create products', color: 'green', icon: '🏭' },
  } as const;

  const currentRole = (formData.role && (roleInfo as any)[formData.role]) || null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
        {/* Language Toggle */}
        <div className="text-right mb-4">
          <button 
            onClick={() => setIsHindi(!isHindi)} 
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
          >
            {isHindi ? 'English' : 'हिंदी'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">{currentRole?.icon || '🌱'}</span>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">
            {isLogin 
              ? (isHindi ? 'खाता लॉगिन' : 'Login to Your Account')
              : (isHindi ? 'खाता बनाएँ' : 'Create Your Account')
            }
          </h1>
          <p className="text-black">
            {currentRole 
              ? (isHindi ? `${currentRole.title} डैशबोर्ड तक पहुंचें` : `Access your ${currentRole.title} dashboard`)
              : (isHindi ? 'अपने डैशबोर्ड तक पहुंचें' : 'Access your dashboard')
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {isHindi ? 'पूरा नाम' : 'Full Name'}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                placeholder={isHindi ? 'अपना पूरा नाम लिखें' : 'Enter your full name'}
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {isHindi ? 'ईमेल या फोन नंबर' : 'Email or Phone Number'}
            </label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
              placeholder={isHindi ? 'अपना ईमेल या फोन नंबर दर्ज करें' : 'Enter your email or phone number'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              {isHindi ? '6-अंकीय पिन' : '6-digit PIN'}
            </label>
            <input
              type="password"
              name="pin"
              inputMode="numeric"
              minLength={4}
              maxLength={6}
              value={formData.pin}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
              placeholder={isHindi ? 'अपना 6-अंकीय पिन दर्ज करें' : 'Enter your 6-digit PIN'}
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {isHindi ? 'भूमिका' : 'Role'}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black bg-white"
                required={!isLogin}
              >
                <option value="">{isHindi ? 'अपनी भूमिका चुनें' : 'Select your role'}</option>
                <option value="farmer">{isHindi ? 'किसान' : 'Farmer'}</option>
                <option value="lab">{isHindi ? 'लैब टेस्टर' : 'Lab Tester'}</option>
                <option value="processor">{isHindi ? 'प्रोसेसर' : 'Processor'}</option>
                <option value="transporter">{isHindi ? 'ट्रांसपोर्टर' : 'Transporter'}</option>
                <option value="manufacturer">{isHindi ? 'निर्माता' : 'Manufacturer'}</option>
                <option value="regulator">{isHindi ? 'नियामक' : 'Regulator'}</option>
              </select>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            {isLogin 
              ? (isHindi ? 'लॉगिन' : 'Login')
              : (isHindi ? 'खाता बनाएँ' : 'Create Account')
            }
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 hover:text-green-500 text-sm font-medium"
          >
            {isLogin 
              ? (isHindi ? "खाता नहीं है? साइन अप करें" : "Don't have an account? Sign up")
              : (isHindi ? "पहले से खाता है? लॉगिन करें" : "Already have an account? Sign in")
            }
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 text-center">
          <p className="text-sm text-black">{isHindi ? 'डेमो क्रेडेंशियल:' : 'Demo credentials:'}</p>
          <div className="space-y-1 text-xs text-black">
            <p>{isHindi ? 'किसान:' : 'Farmer:'} farmer1@example.com {isHindi ? 'या' : 'or'} +919876543210 / 111111</p>
            <p>{isHindi ? 'ट्रांसपोर्टर:' : 'Transporter:'} trans1@example.com {isHindi ? 'या' : 'or'} +919922334455 / 555555</p>
            <p>{isHindi ? 'प्रोसेसर:' : 'Processor:'} proc1@example.com {isHindi ? 'या' : 'or'} +919911223344 / 444444</p>
            <p>{isHindi ? 'लैब:' : 'Lab:'} lab1@example.com {isHindi ? 'या' : 'or'} +919900112233 / 333333</p>
            <p>{isHindi ? 'निर्माता:' : 'Manufacturer:'} mfg1@example.com {isHindi ? 'या' : 'or'} +919933445566 / 666666</p>
            <p>{isHindi ? 'नियामक:' : 'Regulator:'} regulator@example.com {isHindi ? 'या' : 'or'} +911123456789 / 777777</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Main AuthPage with Suspense
export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
