import React, { useState, useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { CustomerApp } from './components/Customer/CustomerApp';
import { KitchenKDS } from './components/Kitchen/KitchenKDS';
import { TableMapPOS } from './components/POS/TableMapPOS';
import { QRGenerator } from './components/QRStudio/QRGenerator';
import { MenuAdmin } from './components/MenuAdmin/MenuAdmin';
import { TechGuide } from './components/Guide/TechGuide';
import { CashflowManagement } from './components/Cashflow/CashflowManagement';
import { AiMenuAssistant } from './components/Customer/AiMenuAssistant';

function MainContent() {
  const { setActiveTableNumber, userRole, isManagerAuthenticated } = useRestaurant();
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return userRole === 'manager' ? 'tables' : 'customer';
  });
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Read URL query and hash parameters (?table=XX & mode=customer or #table=XX)
  useEffect(() => {
    const parseUrlParams = () => {
      try {
        let tableParam: string | null = null;
        let modeParam: string | null = null;

        // 1. Check search params (?table=05)
        if (window.location.search) {
          const params = new URLSearchParams(window.location.search);
          tableParam = params.get('table');
          modeParam = params.get('mode');
        }

        // 2. Fallback to hash params (#table=05 or #/?table=05) for iOS Safari / WebClips
        if (!tableParam && window.location.hash) {
          const hashString = window.location.hash.replace(/^#[/?]*/, '?');
          const hashParams = new URLSearchParams(hashString);
          tableParam = hashParams.get('table');
          if (!modeParam) modeParam = hashParams.get('mode');
        }

        if (tableParam) {
          setActiveTableNumber(tableParam);
          setActiveTab('customer');
        } else if (modeParam === 'customer') {
          setActiveTab('customer');
        }
      } catch (err) {
        console.error('Error parsing URL params:', err);
      }
    };

    parseUrlParams();
    window.addEventListener('popstate', parseUrlParams);
    window.addEventListener('hashchange', parseUrlParams);
    return () => {
      window.removeEventListener('popstate', parseUrlParams);
      window.removeEventListener('hashchange', parseUrlParams);
    };
  }, [setActiveTableNumber]);

  // If user role switches from manager to customer, force active tab to customer
  useEffect(() => {
    if (userRole === 'customer') {
      setActiveTab('customer');
    }
  }, [userRole]);

  const handleSimulateScan = (tableNumber: string) => {
    setActiveTableNumber(tableNumber);
    setActiveTab('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAdvisor={() => setIsAiModalOpen(true)}
      />

      <main className="flex-1">
        {/* Customer Only View */}
        {userRole === 'customer' ? (
          <CustomerApp />
        ) : (
          /* Manager View - With Full Navigation */
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
            {activeTab === 'customer' && <CustomerApp />}
            {activeTab === 'tables' && <TableMapPOS />}
            {activeTab === 'kitchen' && <KitchenKDS />}
            {activeTab === 'cashflow' && <CashflowManagement />}
            {activeTab === 'menu_manage' && <MenuAdmin />}
            {activeTab === 'qr_studio' && <QRGenerator onSimulateScan={handleSimulateScan} />}
            {activeTab === 'guide' && <TechGuide />}
          </div>
        )}
      </main>

      {/* Global AI Sommelier / Menu Advisor Modal */}
      <AiMenuAssistant
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <MainContent />
    </RestaurantProvider>
  );
}
