import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  ChefHat, 
  LayoutGrid, 
  QrCode, 
  BookOpen, 
  Bell, 
  Layers, 
  Smartphone,
  Sparkles,
  DollarSign,
  Lock,
  LogOut,
  ShieldCheck,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useRestaurant } from '../context/RestaurantContext';
import { ManagerLoginModal } from './Auth/ManagerLoginModal';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAiAdvisor?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAiAdvisor }) => {
  const { 
    activeTableNumber, 
    setActiveTableNumber, 
    tables, 
    orders, 
    serviceCalls,
    playNotificationSound,
    restaurantInfo,
    userRole,
    setUserRole,
    isManagerAuthenticated,
    logoutManager,
    refreshServerState
  } = useRestaurant();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'cooking').length;
  const pendingCallsCount = serviceCalls.filter(c => c.status === 'pending').length;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshServerState();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  // If user is currently in Customer role and not authenticated as manager,
  // we show a streamlined, clean header with only table info and a subtle manager login button.
  if (userRole === 'customer') {
    return (
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Brand & Table */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-stone-900 text-sm sm:text-base tracking-tight truncate max-w-[200px] sm:max-w-none">
                  {restaurantInfo.name}
                </span>
                <span className="px-2 py-0.5 text-3xs font-extrabold uppercase rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Bàn {activeTableNumber}
                </span>
              </div>
              <p className="text-2xs text-stone-500 hidden sm:block truncate max-w-sm">
                {restaurantInfo.brandSlogan}
              </p>
            </div>
          </div>

          {/* Quick Actions for Customer: AI Advisor & Manager Switch */}
          <div className="flex items-center gap-2">
            {onOpenAiAdvisor && (
              <button
                onClick={onOpenAiAdvisor}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gợi ý AI</span>
              </button>
            )}

            {/* Manager Login Button */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              title="Đăng nhập quản lý"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-600 hover:text-stone-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span>Quản lý</span>
            </button>
          </div>
        </div>

        <ManagerLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={() => {
            setActiveTab('tables');
          }}
        />
      </header>
    );
  }

  // Manager View Header (Full Admin & All Tabs)
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner Bar for Manager */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center shadow-sm shadow-orange-500/20">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 text-base sm:text-lg tracking-tight">
                {restaurantInfo.name}
              </span>
              <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quản Lý Toàn Quyền</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden md:block">
              Toàn bộ hệ thống: Sơ đồ bàn, Bếp, Sổ quỹ Thu-Chi, Thực đơn & Mã QR
            </p>
          </div>
        </div>

        {/* Action Controls: Table Selector, Sound Test, AI Advisor, Role Switch */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Quick Table Switcher for Preview */}
          <div className="flex items-center bg-stone-100 rounded-lg p-1 border border-stone-200 text-xs">
            <span className="text-stone-500 px-2 font-medium hidden lg:inline">Bàn xem:</span>
            <select
              value={activeTableNumber}
              onChange={(e) => setActiveTableNumber(e.target.value)}
              className="bg-white font-semibold text-stone-800 rounded px-2 py-1 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs cursor-pointer shadow-2xs"
            >
              {tables.map(t => (
                <option key={t.id} value={t.number}>
                  {t.name} ({t.zone})
                </option>
              ))}
            </select>
          </div>

          {/* AI Advisor Button */}
          {onOpenAiAdvisor && (
            <button
              onClick={onOpenAiAdvisor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gợi ý AI</span>
            </button>
          )}

          {/* Manual sync refresh */}
          <button
            onClick={handleManualRefresh}
            title="Đồng bộ lại dữ liệu tức thì"
            className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors border border-stone-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
          </button>

          {/* Sound test button */}
          <button
            onClick={() => playNotificationSound('bell')}
            title="Thử chuông gọi bàn"
            className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors border border-stone-200 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          {/* Switch to Customer Mode / Logout Manager */}
          <button
            onClick={() => {
              logoutManager();
              setActiveTab('customer');
            }}
            title="Thoát quyền Quản lý về Giao diện Khách"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-300 hover:border-rose-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chế độ Khách</span>
          </button>
        </div>
      </div>

      {/* Navigation Mode Tabs (All Manager Tabs) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 overflow-x-auto scrollbar-none border-t border-stone-100">
        <nav className="flex space-x-1 sm:space-x-2 py-1.5 min-w-max">
          {/* Tab: Tables & POS */}
          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
              activeTab === 'tables'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>🏢 Sơ đồ Bàn & POS</span>
            {pendingCallsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            )}
          </button>

          {/* Tab: Kitchen KDS */}
          <button
            onClick={() => setActiveTab('kitchen')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
              activeTab === 'kitchen'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>🍳 Màn hình Bếp (KDS)</span>
            {pendingOrdersCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-2xs font-black ${
                activeTab === 'kitchen' ? 'bg-white text-amber-600' : 'bg-red-500 text-white'
              }`}>
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* Tab: Cashflow (Thu - Chi) - NEW */}
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'cashflow'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 font-bold'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>💰 Quản Lý Thu - Chi</span>
          </button>

          {/* Tab: Menu Admin */}
          <button
            onClick={() => setActiveTab('menu_manage')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'menu_manage'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📋 Quản Lý Món Ăn</span>
          </button>

          {/* Tab: QR Studio */}
          <button
            onClick={() => setActiveTab('qr_studio')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'qr_studio'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>🖨️ In Mã QR Từng Bàn</span>
          </button>

          {/* Tab: Customer Preview */}
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'customer'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>📱 Xem Giao Diện Khách (Bàn {activeTableNumber})</span>
          </button>

          {/* Tab: Guide */}
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📚 Hướng Dẫn Kỹ Thuật (A-Z)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
