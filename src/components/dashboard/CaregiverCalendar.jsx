import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Clock, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const CaregiverCalendar = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [nextDose, setNextDose] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Simulated next dose countdown
    const target = new Date();
    target.setHours(target.getHours() + 4);
    setNextDose(target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const timer = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="calendar-card glass-card p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 mb-6">
        <CalendarIcon className="text-primary" size={24} />
        <h3 className="text-lg font-bold">Caregiver's Schedule</h3>
      </div>

      <div className="schedule-item mb-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-blue-800">Next Medication Dose</span>
          <span className="badge badge-primary">{nextDose}</span>
        </div>
        <div className="flex items-center gap-2 text-2xl font-black text-blue-900">
          <Clock size={24} />
          {timeLeft}
        </div>
      </div>

      <div className="reminders-list space-y-2">
        <div className="reminder-item flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100">
          <Bell size={16} className="text-amber-500" />
          <span className="text-sm">Morning Walk (10:00 AM)</span>
        </div>
        <div className="reminder-item flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100">
          <Bell size={16} className="text-amber-500" />
          <span className="text-sm">Cognitive Exercise (2:00 PM)</span>
        </div>
      </div>

      <style>{`
        .calendar-card {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 24px;
        }
        .text-primary { color: var(--primary); }
        .bg-blue-50 { background-color: rgba(93, 173, 226, 0.1); }
        .border-blue-100 { border-color: rgba(93, 173, 226, 0.2); }
        .text-blue-800 { color: #2e86c1; }
        .text-blue-900 { color: #21618c; }
        .badge-primary { background: var(--primary); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; }
      `}</style>
    </div>
  );
};

export default CaregiverCalendar;
