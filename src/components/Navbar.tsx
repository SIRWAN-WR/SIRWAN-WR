import React, { useState } from 'react';
import { Calendar, Home, User, BookOpen, Menu, X, CheckCircle2 } from 'lucide-react';
import { ClientType } from '../types';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  activeTab: 'home' | 'about' | 'portfolio' | 'booking';
  setActiveTab: (tab: 'home' | 'about' | 'portfolio' | 'booking') => void;
  activeClientType: ClientType;
  setActiveClientType: (type: ClientType) => void;
  onOpenMyBookings: () => void;
  bookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeClientType,
  setActiveClientType,
  onOpenMyBookings,
  bookingsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainTabs = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'about', label: 'عن الكاتب', icon: User },
    { id: 'portfolio', label: 'إصدارات سابقة', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-slate-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo matching exact Sirwan typography */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 group text-right focus:outline-none"
          >
            <div className="p-2.5 rounded-2xl bg-slate-950 text-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <BrandLogo variant="light" size="sm" showSubtitle={true} />
            </div>
          </button>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as 'home' | 'about' | 'portfolio' | 'booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: CTAs */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Book Appointment Main Button */}
            <button
              onClick={() => {
                setActiveTab('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>طلب موعد</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-950 text-amber-400 font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>طلب موعد</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 block px-1">القائمة الرئيسية:</span>
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as 'home' | 'about' | 'portfolio' | 'booking');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-sm font-bold text-right transition-all ${
                    isActive
                      ? 'bg-slate-950 text-white border-slate-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {bookingsCount > 0 && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyBookings();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>استعراض المواعيد المحجوزة ({bookingsCount})</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
