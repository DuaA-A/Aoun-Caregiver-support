import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Coffee, Smile, Moon, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const BehaviorLog = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [log, setLog] = useState({
    confusion: 2,
    appetite: 3,
    mood: 'stable',
    sleep: 8
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert(isRTL ? 'تم حفظ السجل بنجاح!' : 'Log saved successfully!');
    }, 1000);
  };

  return (
    <div className="behavior-log-card glass-card p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 mb-6">
        <Brain className="text-accent" size={24} />
        <h3 className="text-lg font-bold">Daily Behavior Log</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="log-input-group">
          <label className="flex items-center gap-2 mb-2 text-sm font-semibold">
            <Brain size={16} className="text-purple-500" />
            Confusion Level (1-5)
          </label>
          <input 
            type="range" min="1" max="5" 
            value={log.confusion} 
            onChange={(e) => setLog({...log, confusion: e.target.value})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Clear</span>
            <span>Confused</span>
          </div>
        </div>

        <div className="log-input-group">
          <label className="flex items-center gap-2 mb-2 text-sm font-semibold">
            <Coffee size={16} className="text-orange-500" />
            Appetite (1-5)
          </label>
          <input 
            type="range" min="1" max="5" 
            value={log.appetite} 
            onChange={(e) => setLog({...log, appetite: e.target.value})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Poor</span>
            <span>Great</span>
          </div>
        </div>

        <div className="log-input-group">
          <label className="flex items-center gap-2 mb-2 text-sm font-semibold">
            <Smile size={16} className="text-green-500" />
            General Mood
          </label>
          <select 
            value={log.mood} 
            onChange={(e) => setLog({...log, mood: e.target.value})}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="calm">Calm</option>
            <option value="stable">Stable</option>
            <option value="agitated">Agitated</option>
            <option value="anxious">Anxious</option>
          </select>
        </div>

        <div className="log-input-group">
          <label className="flex items-center gap-2 mb-2 text-sm font-semibold">
            <Moon size={16} className="text-blue-500" />
            Sleep (Hours)
          </label>
          <input 
            type="number" 
            value={log.sleep} 
            onChange={(e) => setLog({...log, sleep: e.target.value})}
            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saving}
        className="btn btn-premium w-full flex items-center justify-center gap-2"
      >
        {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
        {isRTL ? 'حفظ سجل اليوم' : 'Save Today\'s Log'}
      </button>

      <style>{`
        .behavior-log-card {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 24px;
        }
        .text-accent { color: var(--accent); }
        .accent-purple-500 { accent-color: #a855f7; }
        .accent-orange-500 { accent-color: #f97316; }
      `}</style>
    </div>
  );
};

export default BehaviorLog;
