import React from 'react';
import { X, Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import { BookingData } from '../types';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingData[];
  onNewBookingTrigger: () => void;
  onClearAllBookings?: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onNewBookingTrigger,
  onClearAllBookings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn font-['Cairo'] text-slate-900">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900">
              <CheckCircle2 className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-['Tajawal']">
                سجل المواعيد والاستشارات المحجوزة
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                استعرض تفاصيل وحالة طلبات المواعيد الخاصة بك.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookings.length > 0 && onClearAllBookings && (
              <button
                onClick={() => {
                  if (confirm('هل أنت تأكد من رغبتك في مسح وحذف جميع المواعيد المحجوزة؟')) {
                    onClearAllBookings();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="حذف جميع المواعيد"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح الكل</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <div key={b.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-mono font-bold text-slate-900 text-xs bg-white px-2 py-0.5 rounded border border-slate-200">{b.id}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    مؤكد وبانتظار الجلسة
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-medium">
                  <div>
                    <span className="text-[10px] text-slate-500 block">نوع الجلسة:</span>
                    <span className="font-bold text-slate-900">{b.consultationTitle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">الموعد المحدد:</span>
                    <span className="font-bold text-amber-800">{b.date} ({b.timeSlot})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">العميل:</span>
                    <span className="font-bold text-slate-900">{b.clientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">التواصل:</span>
                    <span className="font-bold text-slate-800">{b.clientPhone}</span>
                  </div>
                </div>

                {b.projectBrief && (
                  <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 font-medium">
                    <span className="text-[10px] text-slate-500 block mb-1">تفاصيل الطلب المكتوب:</span>
                    <p className="line-clamp-2">{b.projectBrief}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-3">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">لا توجد مواعيد محجوزة حالياً</p>
              <button
                onClick={() => {
                  onClose();
                  onNewBookingTrigger();
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 shadow-sm"
              >
                طلب حجز موعد جديد
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
