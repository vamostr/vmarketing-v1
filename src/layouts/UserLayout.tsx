import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Mail, 
  BarChart2, 
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  Menu,
  X,
  Users,
  CreditCard
} from 'lucide-react';

export const UserLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard,
      description: 'Genel bakış ve özet bilgiler'
    },
    { 
      name: 'WhatsApp', 
      href: '/whatsapp', 
      icon: MessageCircle,
      description: 'WhatsApp mesajlaşma ve kampanyaları'
    },
    { 
      name: 'E-posta', 
      href: '/email', 
      icon: Mail,
      description: 'E-posta pazarlama kampanyaları'
    },
    { 
      name: 'Kişiler', 
      href: '/contacts', 
      icon: Users,
      description: 'Kişi ve grup yönetimi'
    },
    { 
      name: 'Analitik', 
      href: '/analytics', 
      icon: BarChart2,
      description: 'Performans ve analiz raporları'
    },
    { 
      name: 'Ayarlar', 
      href: '/settings', 
      icon: Settings,
      description: 'Hesap ve uygulama ayarları'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'Yeni WhatsApp API Güncellemesi',
      description: 'WhatsApp Business API\'da yeni özellikler kullanıma sunuldu.',
      time: '5 dakika önce',
      unread: true,
    },
    {
      id: 2,
      title: 'Kampanya Başarıyla Tamamlandı',
      description: 'Son e-posta kampanyanız %85 açılma oranıyla tamamlandı.',
      time: '1 saat önce',
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Menü */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="https://vamos.ist/wp-content/uploads/2024/01/siyah@2x.png"
                  alt="vMarketing"
                />
              </div>

              {/* Mobil menü butonu */}
              <button
                type="button"
                className="lg:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Arama */}
            <div className="hidden lg:flex flex-1 px-2 lg:ml-6 lg:justify-center">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Ara</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Kampanya, mesaj veya kişi ara..."
                    type="search"
                  />
                </div>
              </div>
            </div>

            {/* Sağ Menü */}
            <div className="flex items-center lg:ml-4">
              {/* Abonelik Durumu */}
              <div className="hidden lg:flex items-center mr-4">
                <Link
                  to="/subscription"
                  className={`inline-flex items-center px-3 py-1 rounded-full border ${
                    user?.subscription.plan === 'free'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : user?.subscription.plan === 'pro'
                      ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                      : 'bg-purple-50 text-purple-800 border-purple-200'
                  }`}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    {user?.subscription.plan === 'free' ? 'Ücretsiz Plan' :
                     user?.subscription.plan === 'pro' ? 'Pro' : 'Kurumsal'}
                  </span>
                </Link>
              </div>

              {/* Bildirimler */}
              <div className="relative">
                <button
                  type="button"
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <span className="sr-only">Bildirimler</span>
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                </button>

                {/* Bildirim Dropdown */}
                {isNotificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="menu">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900">Bildirimler</h3>
                      </div>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                          <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                        </div>
                      ))}
                      <div className="px-4 py-2 border-t border-gray-100">
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                          Tüm bildirimleri gör
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profil Dropdown */}
              <div className="relative ml-4">
                <button
                  type="button"
                  className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {user?.name}
                      </span>
                    </span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="menu">
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Profil Ayarları
                      </Link>
                      <Link
                        to="/subscription"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Abonelik Planları
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Ana İçerik */}
      <div className="flex">
        {/* Yan Menü */}
        <div className={`
          lg:block lg:w-64 lg:flex-shrink-0 bg-white border-r border-gray-200
          ${isMobileMenuOpen ? 'block fixed inset-y-0 left-0 w-64 z-50' : 'hidden'}
        `}>
          <nav className="h-full flex flex-col">
            <div className="flex-1 space-y-1 p-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg
                      transition-colors duration-150 ease-in-out
                      ${isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <div>
                      <div>{item.name}</div>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Çıkış Yap Butonu */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Çıkış Yap
              </button>
            </div>
          </nav>
        </div>

        {/* İçerik Alanı */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};