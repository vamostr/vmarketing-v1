import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  Users,
  CreditCard,
  Settings,
  LogOut,
  User,
  LayoutDashboard,
  Building2,
  DollarSign,
  Activity,
  Database,
  Bell,
  Shield
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Kullanıcılar', href: '/admin/users', icon: Users },
    { name: 'Yetkililer', href: '/admin/permissions', icon: Shield },
    { name: 'Ekipler & Firmalar', href: '/admin/organizations', icon: Building2 },
    { name: 'Abonelikler', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'Gelir Ortaklığı', href: '/admin/affiliates', icon: DollarSign },
    { name: 'Sistem Durumu', href: '/admin/system-status', icon: Activity },
    { name: 'Toplu İşlemler', href: '/admin/bulk-operations', icon: Database },
    { name: 'Duyurular', href: '/admin/announcements', icon: Bell },
    { name: 'Ayarlar', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="https://vamos.ist/wp-content/uploads/2024/01/siyah@2x.png"
                  alt="vMarketing Admin"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="relative">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <User className="h-5 w-5" />
                    <span>{user?.name} (Admin)</span>
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="ml-4 flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-4 py-2 text-sm font-medium rounded-md
                      ${location.pathname === item.href
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};