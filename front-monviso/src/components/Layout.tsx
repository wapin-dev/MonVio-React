import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, CreditCardIcon, PieChartIcon, TagIcon, HistoryIcon, UserIcon, SettingsIcon, MenuIcon, XIcon, LogOutIcon, ChevronRightIcon, BellIcon, SearchIcon, TrendingUpIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const Layout = ({
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('/');
  const [hoveredTab, setHoveredTab] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  // Update active tab based on location
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navigationItems = [{
    name: 'Tableau de bord',
    icon: <HomeIcon size={20} />,
    path: '/',
    color: 'from-blue-400 to-blue-600',
    textColor: 'text-blue-400'
  }, {
    name: 'Transactions',
    icon: <CreditCardIcon size={20} />,
    path: '/transactions',
    color: 'from-green-400 to-green-600',
    textColor: 'text-green-400'
  }, {
    name: 'Budget',
    icon: <PieChartIcon size={20} />,
    path: '/budget',
    color: 'from-purple-400 to-purple-600',
    textColor: 'text-purple-400'
  }, {
    name: 'Catégories',
    icon: <TagIcon size={20} />,
    path: '/categories',
    color: 'from-amber-400 to-amber-600',
    textColor: 'text-amber-400'
  }, {
    name: 'Historique',
    icon: <HistoryIcon size={20} />,
    path: '/history',
    color: 'from-cyan-400 to-cyan-600',
    textColor: 'text-cyan-400'
  }, {
    name: 'Préréglages',
    icon: <SettingsIcon size={20} />,
    path: '/presets',
    color: 'from-rose-400 to-rose-600',
    textColor: 'text-rose-400'
  }, {
    name: 'Profil',
    icon: <UserIcon size={20} />,
    path: '/profile',
    color: 'from-indigo-400 to-indigo-600',
    textColor: 'text-indigo-400'
  }];
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleLogout = () => {
    logout();
  };
  return <div className="flex h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r border-gray-800/50 backdrop-blur-md shadow-2xl transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Logo area */}
          <div className="flex items-center justify-between px-4 py-6">
            <div className="flex items-center group cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg shadow-blue-500/30 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="text-white font-bold text-lg relative z-10">
                    M
                  </span>
                </div>
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-400 to-purple-600 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>
              </div>
              <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                monviso
              </span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden rounded-full p-1.5 text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors">
              <XIcon size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex-1 space-y-2 px-3 py-4">
            {navigationItems.map(item => {
            const isActive = activeTab === item.path;
            const isHovered = hoveredTab === item.path;
            return <Link key={item.name} to={item.path} className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`} onMouseEnter={() => setHoveredTab(item.path)} onMouseLeave={() => setHoveredTab(null)}>
                  {/* Background effects */}
                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl z-0"></div>}
                  {/* Hover/active indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full transition-all duration-300 ${isActive ? `bg-gradient-to-b ${item.color} h-full` : isHovered ? `bg-gradient-to-b ${item.color} h-1/2 opacity-70` : 'h-0 opacity-0'}`}></div>
                  {/* Icon with animated background */}
                  <div className="relative mr-3 flex-shrink-0">
                    <div className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${isActive || isHovered ? 'opacity-20' : 'opacity-0'} bg-gradient-to-r ${item.color}`}></div>
                    <span className={`relative z-10 ${isActive ? item.textColor : 'text-gray-400 group-hover:' + item.textColor}`}>
                      {item.icon}
                    </span>
                  </div>
                  {/* Text */}
                  <span className="relative z-10">{item.name}</span>
                  {/* Arrow indicator */}
                  <ChevronRightIcon size={16} className={`ml-auto relative z-10 transform transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'} ${isActive ? item.textColor : 'text-gray-400'}`} />
                </Link>;
          })}
          </nav>

          {/* Stats card */}
          <div className="mx-3 my-2">
            <div className="rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/70 backdrop-blur-md border border-gray-700/30 p-4 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-colors duration-300"></div>
              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                <TrendingUpIcon size={14} className="mr-1.5 text-blue-400" />
                Aperçu du mois
              </h4>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">Dépenses</p>
                  <p className="text-sm font-medium text-white">2 145,30 €</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Reste</p>
                  <p className="text-sm font-medium text-green-400">254,70 €</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-gray-700/50 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{
                width: '80%'
              }}></div>
              </div>
            </div>
          </div>

          {/* User and logout */}
          <div className="border-t border-gray-800/50 p-4">
            <div className="flex items-center mb-4 p-2 rounded-xl hover:bg-gray-800/30 transition-colors cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-700/20">
                <UserIcon size={16} className="text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-100">
                  {user?.name || 'Utilisateur'}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email || 'utilisateur@example.com'}
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-gray-300 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-all group">
              <div className="relative mr-3">
                <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-20 bg-red-500 transition-opacity duration-300"></div>
                <LogOutIcon size={18} className="text-gray-400 group-hover:text-red-400 relative z-10 transition-colors" />
              </div>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className={`bg-gray-900/50 backdrop-blur-md border-b border-gray-800/50 shadow-lg transition-all duration-300 ${scrolled ? 'shadow-black/20' : 'shadow-black/10'} z-10`}>
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden">
                <MenuIcon size={24} />
              </button>
              {/* Search bar */}
              <div className="hidden md:block ml-4">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon size={16} className="text-gray-400" />
                  </div>
                  <input type="text" placeholder="Rechercher..." className="w-64 rounded-xl border-0 bg-gray-800/50 backdrop-blur-md pl-10 pr-4 py-1.5 text-sm text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 shadow-inner shadow-black/10" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification bell */}
              <button className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50 transition-colors">
                <BellIcon size={20} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              {/* User profile */}
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-100">
                    {user?.name || 'Utilisateur'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {user?.email || 'utilisateur@example.com'}
                  </span>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-700/20 cursor-pointer hover:shadow-blue-700/40 transition-shadow">
                  <UserIcon size={16} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 to-blue-900 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>;
};
export default Layout;