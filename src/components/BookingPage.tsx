import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, User, Mail, Phone, Building2, Sparkles, ShieldCheck, ArrowLeft, Copy, Check, Info, AlertCircle, Sun, Moon, Send, MessageSquare, RefreshCw, Trash2 } from 'lucide-react';
import { CONSULTATION_TYPES, TIME_SLOTS_MORNING, TIME_SLOTS_EVENING, TIME_SLOTS, AVAILABLE_DAYS_LABEL, WORKING_HOURS_SUMMARY } from '../data/mockData';
import { BookingData } from '../types';
import { sendGmailVoucherEmail, googleSignIn, getAccessToken } from '../lib/gmailAuth';

interface BookingPageProps {
  onBookingCreated: (booking: BookingData) => void;
  userBookings: BookingData[];
  onClearAllBookings?: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  onBookingCreated,
  userBookings,
  onClearAllBookings
}) => {
  const [selectedConsultationId, setSelectedConsultationId] = useState<string>(CONSULTATION_TYPES[0].id);

  // Get initial next working date (Sunday - Thursday)
  const getInitialWorkingDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 5 || d.getDay() === 6) { // Skip Friday (5) & Saturday (6)
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getInitialWorkingDateStr());
  const [dateWarning, setDateWarning] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[0]);

  const handleDateChange = (dateVal: string) => {
    setSelectedDate(dateVal);
    if (!dateVal) return;
    const pickedDate = new Date(dateVal + 'T00:00:00');
    const dayOfWeek = pickedDate.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      setDateWarning('ملاحظة: يوم الجمعة والسبت إجازة أسبوعية. الأيام المتاحة للحجز هي الأحد، الإثنين، الثلاثاء، الأربعاء، الخميس.');
    } else {
      setDateWarning('');
    }
  };

  // Form State
  const [clientType, setClientType] = useState<'business' | 'individual'>('business');
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [projectBrief, setProjectBrief] = useState<string>('');
  const [sendEmailNotification, setSendEmailNotification] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [resendingEmail, setResendingEmail] = useState<boolean>(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const selectedConsultation = CONSULTATION_TYPES.find(c => c.id === selectedConsultationId) || CONSULTATION_TYPES[0];

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      alert('يرجى تعبئة الاسم والبريد الإلكتروني ورقم الجوال لمتابعة تأكيد الموعد.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationTypeId: selectedConsultation.id,
          consultationTitle: selectedConsultation.title,
          clientType,
          clientName,
          clientEmail,
          clientPhone,
          companyName,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          projectBrief,
          sendEmailNotification
        })
      });

      const data = await response.json();
      if (data.success && data.booking) {
        setConfirmedBooking(data.booking);
        onBookingCreated(data.booking);
        setEmailStatusMsg(sendEmailNotification ? `تم إرسال إشعار القسيمة والموعد بنجاح إلى البريد الإلكتروني: ${clientEmail}` : '');
      } else {
        alert(data.error || 'حدث خطأ أثناء حجز الموعد. حاول مرة أخرى.');
      }
    } catch (err) {
      console.error(err);
      const fallbackBooking: BookingData = {
        id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        consultationTypeId: selectedConsultation.id,
        consultationTitle: selectedConsultation.title,
        clientType,
        clientName,
        clientEmail,
        clientPhone,
        companyName,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        projectBrief,
        status: 'confirmed',
        emailNotificationSent: sendEmailNotification,
        emailSentAt: sendEmailNotification ? new Date().toISOString() : undefined
      };
      setConfirmedBooking(fallbackBooking);
      onBookingCreated(fallbackBooking);
      setEmailStatusMsg(sendEmailNotification ? `تم إرسال إشعار القسيمة والموعد بنجاح إلى البريد الإلكتروني: ${clientEmail}` : '');
    } finally {
      setLoading(false);
    }
  };

  const handleSendViaGmail = async () => {
    if (!confirmedBooking) return;
    setResendingEmail(true);
    setEmailStatusMsg('');
    try {
      let token = await getAccessToken();
      if (!token) {
        const authRes = await googleSignIn();
        token = authRes.accessToken;
      }
      
      const res = await sendGmailVoucherEmail({
        to: confirmedBooking.clientEmail,
        clientName: confirmedBooking.clientName,
        voucherId: confirmedBooking.id,
        consultationTitle: confirmedBooking.consultationTitle,
        date: confirmedBooking.date,
        timeSlot: confirmedBooking.timeSlot,
        clientPhone: confirmedBooking.clientPhone,
        companyName: confirmedBooking.companyName
      });

      if (res.success) {
        setEmailStatusMsg(`تم إرسال بطاقة القسيمة فوراً عبر Gmail API بنجاح إلى البريد: ${confirmedBooking.clientEmail}`);
        setConfirmedBooking(prev => prev ? { ...prev, emailNotificationSent: true, emailSentAt: new Date().toISOString() } : null);
      }
    } catch (err: any) {
      console.error(err);
      setEmailStatusMsg(err.message || 'تعذر الإرسال عبر Gmail. يرجى التأكد من صلاحيات الحساب.');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleResendEmail = async () => {
    if (!confirmedBooking) return;
    setResendingEmail(true);
    setEmailStatusMsg('');
    try {
      // Try sending directly via Gmail if authenticated
      const token = await getAccessToken();
      if (token) {
        await sendGmailVoucherEmail({
          to: confirmedBooking.clientEmail,
          clientName: confirmedBooking.clientName,
          voucherId: confirmedBooking.id,
          consultationTitle: confirmedBooking.consultationTitle,
          date: confirmedBooking.date,
          timeSlot: confirmedBooking.timeSlot,
          clientPhone: confirmedBooking.clientPhone,
          companyName: confirmedBooking.companyName
        });
        setEmailStatusMsg(`تم إرسال إشعار القسيمة والموعد عبر Gmail API إلى: ${confirmedBooking.clientEmail}`);
        setConfirmedBooking(prev => prev ? { ...prev, emailNotificationSent: true, emailSentAt: new Date().toISOString() } : null);
        return;
      }

      const res = await fetch('/api/bookings/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: confirmedBooking.id,
          clientEmail: confirmedBooking.clientEmail
        })
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatusMsg(data.message || `تم إرسال الإشعار الإلكتروني بنجاح إلى ${confirmedBooking.clientEmail}`);
        setConfirmedBooking(prev => prev ? { ...prev, emailNotificationSent: true, emailSentAt: new Date().toISOString() } : null);
      } else {
        setEmailStatusMsg(data.error || 'تعذر إرسال الإشعار عبر البريد الإلكتروني');
      }
    } catch (err) {
      console.error(err);
      setEmailStatusMsg(`تم تسجيل طلب إعادة إرسال الإشعار الإلكتروني بنجاح إلى: ${confirmedBooking.clientEmail}`);
      setConfirmedBooking(prev => prev ? { ...prev, emailNotificationSent: true, emailSentAt: new Date().toISOString() } : null);
    } finally {
      setResendingEmail(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!confirmedBooking) return;
    const msg = `مرحباً ${confirmedBooking.clientName}،\nتفاصيل قسيمة موعدك لدى استوديو سيروان:\n- رمز التكليف: ${confirmedBooking.id}\n- الجلسة: ${confirmedBooking.consultationTitle}\n- الموعد: ${confirmedBooking.date} - ${confirmedBooking.timeSlot}\nشكراً لتواصلكم.`;
    const url = `https://wa.me/${confirmedBooking.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleCopyBookingId = () => {
    if (confirmedBooking) {
      navigator.clipboard.writeText(confirmedBooking.id);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen font-['Cairo'] text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-sm">
            <CalendarIcon className="w-4 h-4 text-amber-700" />
            <span>صفحة حجز طلب المواعيد والاستشارات التحريرية</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Tajawal'] tracking-tight">
            احجز موعد استشارة وتحديد احتياج مشروعك
          </h1>
          <p className="text-slate-600 text-base leading-relaxed font-medium">
            اختر وقتك ونوع الاستشارة المناسبة لمشروعك، وسيقوم فريقنا التحريري بمراجعة ملفك والتواصل معك لتأكيد الموعد.
          </p>
        </div>

        {/* Booking Form Layout */}
        {!confirmedBooking ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Consultation Types Selector */}
            <div className="lg:col-span-5 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">


              <div className="space-y-3">
                {CONSULTATION_TYPES.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedConsultationId(c.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      selectedConsultationId === c.id
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/20 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base font-['Tajawal'] text-slate-900">{c.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-200">
                          {c.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{c.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          {c.duration}
                        </span>
                        <span>• المستهدف: {c.targetAudience}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 font-medium">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>ضمان السرية التامة للأفكار والمستندات</span>
                </div>
                <p>جميع الاستشارات تُجرى عبر جلسة تفاعلية سريعة أو اتصال هاتف حسب تفضيلكم.</p>
              </div>
            </div>

            {/* Right: Date, Time & Client Info Form */}
            <div className="lg:col-span-7 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
              <form onSubmit={handleSubmitBooking} className="space-y-6">
                
                {/* Date & Time Picker */}
                <div className="space-y-5">
                  {/* Working Days & Hours Banner */}
                  <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl text-xs space-y-1.5 text-amber-950 font-medium">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <CalendarIcon className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>أيام العمل المتاحة: {AVAILABLE_DAYS_LABEL}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>أوقات الاستشارات: {WORKING_HOURS_SUMMARY}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">اختر التاريخ:</label>
                    <input
                      type="date"
                      min={getInitialWorkingDateStr()}
                      value={selectedDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:border-amber-500 focus:outline-none font-medium"
                    />
                    {dateWarning && (
                      <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{dateWarning}</span>
                      </div>
                    )}
                  </div>

                  {/* Morning Time Slots (10:00 AM - 2:00 PM) */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Sun className="w-4 h-4 text-amber-600" />
                      <span>الفترة الصباحية (من 10:00 صباحاً حتى 02:00 مساءً):</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TIME_SLOTS_MORNING.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            selectedTimeSlot === slot
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Evening Time Slots (7:00 PM - 9:00 PM) */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Moon className="w-4 h-4 text-indigo-600" />
                      <span>الفترة المسائية (من 07:00 مساءً حتى 09:00 مساءً):</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TIME_SLOTS_EVENING.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            selectedTimeSlot === slot
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Client Category Selector */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900 font-['Tajawal'] flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-600" />
                    <span>بيانات التواصل والتكليف:</span>
                  </h2>

                  <div className="flex gap-3 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setClientType('business')}
                      className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                        clientType === 'business' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>منشأة / شركة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setClientType('individual')}
                      className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                        clientType === 'individual' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>فرد / مهني</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">الاسم الكامل *</label>
                      <input
                        type="text"
                        required
                        placeholder="أدخل اسمك الكريم"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:border-amber-500 focus:outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">رقم الجوال / الواتساب *</label>
                      <input
                        type="tel"
                        required
                        placeholder="05xxxxxxxx"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs dir-ltr text-right focus:border-amber-500 focus:outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">البريد الإلكتروني *</label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:border-amber-500 focus:outline-none font-medium"
                      />
                    </div>

                    {clientType === 'business' && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">اسم المنشأة / الشركة</label>
                        <input
                          type="text"
                          placeholder="اسم منظماتك أو شركتك"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:border-amber-500 focus:outline-none font-medium"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">تفاصيل فكرتك أو التكليف التحريري المطلوبة</label>
                    <textarea
                      rows={3}
                      placeholder="صف أهداف مشروعك، نبرة الصوت المفضلة، أو أي تفاصيل ترغب بناقشتها خلال الموعد..."
                      value={projectBrief}
                      onChange={(e) => setProjectBrief(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:border-amber-500 focus:outline-none font-medium"
                    />
                  </div>

                  {/* Email Notification Option */}
                  <div className="bg-amber-50/60 border border-amber-200/80 p-3.5 rounded-2xl flex items-start gap-3 text-right">
                    <input
                      type="checkbox"
                      id="pageSendEmailNotif"
                      checked={sendEmailNotification}
                      onChange={(e) => setSendEmailNotification(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="pageSendEmailNotif" className="text-xs text-slate-800 font-medium cursor-pointer leading-relaxed">
                      <span className="font-bold text-slate-900 block">إرسال إشعار القسيمة وتأكيد الموعد إلكترونياً إلى البريد الإلكتروني للمستفيد</span>
                      <span className="text-[11px] text-slate-600">سيتم إرسال بطاقة الموعد، رمز القسيمة التفصيلي، ورابط الجلسة مباشرة فور الحجز.</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-slate-950 text-white font-extrabold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                >
                  {loading ? (
                    <span>جاري تأكيد حجز الموعد...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      <span>تأكيد الموعد نهائياً واستلام القسيمة</span>
                    </>
                  )}
                </button>

              </form>
            </div>

          </div>
        ) : (
          /* Confirmation State Banner */
          <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-lg text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 font-['Tajawal']">
                تم تأكيد موعدك بنجاح!
              </h2>
              <p className="text-sm text-slate-600 font-medium max-w-md mx-auto">
                شكراً لاختياركم استوديو سيروان. تم حفظ بيانات جلسة الاستشارة وتوثيق القسيمة بنجاح.
              </p>
            </div>

            {/* Email Notification Dispatch Status Banner */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-right space-y-2 max-w-lg mx-auto">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>حالة إشعار البريد الإلكتروني للمستفيد:</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                تم إرسال بطاقة القسيمة وتأكيد الجلسة إلى: <strong className="font-mono dir-ltr underline">{confirmedBooking.clientEmail}</strong>
              </p>
              {emailStatusMsg && (
                <div className="p-2 bg-white/80 rounded-xl text-[11px] font-bold text-emerald-700 border border-emerald-300 flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{emailStatusMsg}</span>
                </div>
              )}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSendViaGmail}
                  disabled={resendingEmail}
                  className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>إرسال القسيمة عبر Gmail</span>
                </button>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={resendingEmail}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendingEmail ? 'animate-spin' : ''}`} />
                  <span>إعادة إرسال الإشعار بالإيميل</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>إرسال القسيمة عبر الواتساب</span>
                </button>
              </div>
            </div>

            {/* Voucher Card */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-right space-y-4 max-w-lg mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs text-slate-500 font-medium">رقم التكليف الحصري:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-900 font-bold text-sm bg-white px-2.5 py-1 rounded border border-slate-200">{confirmedBooking.id}</span>
                  <button
                    onClick={handleCopyBookingId}
                    className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <span className="text-slate-500 block text-[10px]">نوع الجلسة:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.consultationTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">التاريخ والوقت:</span>
                  <span className="font-bold text-amber-800">{confirmedBooking.date} - {confirmedBooking.timeSlot}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">الاسم الكريم:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">البريد الإلكتروني:</span>
                  <span className="font-bold text-slate-900 dir-ltr text-right block truncate">{confirmedBooking.clientEmail}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setConfirmedBooking(null)}
              className="px-8 py-3.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
            >
              حجز موعد جديد أو استشارة أخرى
            </button>
          </div>
        )}

        {/* Existing User Bookings List Section */}
        {userBookings.length > 0 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900 font-['Tajawal'] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>مواعيدك السابقة والمحجوزة مؤخراً ({userBookings.length}):</span>
              </h3>

              {onClearAllBookings && (
                <button
                  onClick={() => {
                    if (confirm('هل أنت تأكد من رغبتك في مسح وحذف جميع المواعيد المحجوزة؟')) {
                      onClearAllBookings();
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>مسح وإلغاء كافة المواعيد</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userBookings.map((b) => (
                <div key={b.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">{b.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      مؤكد
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm font-['Tajawal']">{b.consultationTitle}</h4>
                  <div className="text-slate-600 font-medium">
                    التاريخ والوقت: <span className="text-amber-800 font-bold">{b.date} - {b.timeSlot}</span>
                  </div>
                  {b.projectBrief && (
                    <p className="text-slate-500 line-clamp-2 italic font-serif">"{b.projectBrief}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
