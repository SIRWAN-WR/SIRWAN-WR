import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutWriter } from './components/AboutWriter';
import { PortfolioSection } from './components/PortfolioSection';
import { BookingModal } from './components/BookingModal';
import { BookingPage } from './components/BookingPage';
import { TestimonialsSection } from './components/TestimonialsSection';
import { MyBookingsModal } from './components/MyBookingsModal';
import { Footer } from './components/Footer';
import { ClientType, BookingData } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'portfolio' | 'booking'>('home');
  const [activeClientType, setActiveClientType] = useState<ClientType>('all');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<string>('');
  
  const [userBookings, setUserBookings] = useState<BookingData[]>(() => {
    try {
      const saved = localStorage.getItem('sirwan_user_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sirwan_user_bookings', JSON.stringify(userBookings));
    } catch (e) {
      console.error('Failed saving bookings locally', e);
    }
  }, [userBookings]);

  const handleOpenBookingModal = (serviceTitle?: string) => {
    if (serviceTitle) {
      setPreselectedService(serviceTitle);
    } else {
      setPreselectedService('');
    }
    setIsBookingModalOpen(true);
  };

  const handleBookingCreated = (newBooking: BookingData) => {
    setUserBookings(prev => [newBooking, ...prev]);
  };

  const handleClearAllBookings = async () => {
    try {
      await fetch('/api/bookings', { method: 'DELETE' });
    } catch (e) {
      console.error('Failed clearing remote bookings', e);
    }
    setUserBookings([]);
    localStorage.removeItem('sirwan_user_bookings');
  };

  const scrollToSection = (id: string) => {
    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Cairo',sans-serif] selection:bg-amber-200 selection:text-amber-900">
      
      {/* Navigation Header Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeClientType={activeClientType}
        setActiveClientType={setActiveClientType}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        bookingsCount={userBookings.length}
      />

      {/* Main View Router */}
      <main>
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              activeClientType={activeClientType}
              setActiveClientType={setActiveClientType}
              onOpenBooking={() => setActiveTab('booking')}
              onScrollToWorkflow={() => scrollToSection('about')}
            />

            {/* Client Testimonials */}
            <TestimonialsSection />
          </>
        )}

        {activeTab === 'portfolio' && (
          <div className="animate-fadeIn">
            <PortfolioSection
              isFullPage={true}
              onSelectServiceForBooking={(serviceTitle) => handleOpenBookingModal(serviceTitle)}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-fadeIn">
            <AboutWriter
              onOpenBooking={() => setActiveTab('booking')}
            />
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="animate-fadeIn">
            <BookingPage
              onBookingCreated={handleBookingCreated}
              userBookings={userBookings}
              onClearAllBookings={handleClearAllBookings}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => setActiveTab('booking')} />

      {/* Quick Appointment Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedServiceTitle={preselectedService}
        onBookingCreated={handleBookingCreated}
      />

      {/* My Bookings History Drawer */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={userBookings}
        onNewBookingTrigger={() => setActiveTab('booking')}
        onClearAllBookings={handleClearAllBookings}
      />

    </div>
  );
}
