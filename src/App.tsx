import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SalesPage } from './components/SalesPage';
import { PurchasesPage } from './components/PurchasesPage';
import { StockPage } from './components/StockPage';
import { UsersPage } from './components/UsersPage';
import { SettingsPage } from './components/SettingsPage';
import { LoginPage } from './components/LoginPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(() => {
    const stored = localStorage.getItem('ck_user');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (u: any) => setUser(u);

  const handleLogout = () => {
    localStorage.removeItem('ck_user');
    setUser(null);
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':  return <Dashboard />;
      case 'sales':      return <SalesPage currentUser={user} />;
      case 'purchases':  return <PurchasesPage currentUser={user} />;
      case 'stock':      return <StockPage currentUser={user} />;
      case 'users':      return <UsersPage />;
      case 'settings':   return <SettingsPage currentUser={user} />;
      default:           return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
