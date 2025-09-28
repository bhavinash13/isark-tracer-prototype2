'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const isAuthPage = pathname === '/auth';

  if (isAuthPage) {
    return null; // Don't show navigation on auth page
  }

  const getDashboardLink = (role: string) => {
    const dashboardMap: { [key: string]: string } = {
      farmer: '/farmers',
      lab: '/lab-tester',
      processor: '/processor',
      regulator: '/regulator',
      transporter: '/transporter',
      manufacturer: '/manufacturer',
    };
    return dashboardMap[role] || '/';
  };

  return null;
}