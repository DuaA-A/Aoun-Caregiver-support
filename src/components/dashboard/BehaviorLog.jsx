import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Coffee, Smile, Moon, Save, Loader2, Info } from 'lucide-react';

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
      // Removed alert for better UX
    }, 1500);
  };

  const moodOptions = [
    { value: 'calm', label: isRTL ? 'هادئ' : 'Calm', color: '#10b981' },
    { value: 'stable', label: isRTL ? 'مستقر' : 'Stable', color: '#3b82f6' },
    { value: 'agitated', label: isRTL ? 'منفعل' : 'Agitated', color: '#f59e0b' },
    { value: 'anxious', label: isRTL ? 'قلق' : 'Anxious', color: '#ef4444' },
  ];

  return (
    <div className="log-premium glass-card" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="log-head">
        <div className="log-title">
          <div className="log-ico-box"><Brain size={20} /></div>
          <div>
            <h3>{t('dashboard.behaviorLogTitle')}</h3>
            <p>{t('dashboard.behaviorLogSubtitle')}</p>
          </div>
        </div>
        <div className="log-info-ico"><Info size={18} /></div>
      </header>

      <div className="log-body">
        <div className="log-grid">
          {/* Confusion Slider */}
          <div className="premium-log-input">
            <div className="label-row">
              <span className="log-label">{t('dashboard.confusionLevel')}</span>
              <span className="log-val-badge">{log.confusion}/5</span>
            </div>
            <input 
              type="range" min="1" max="5" 
              value={log.confusion} 
              onChange={(e) => setLog({...log, confusion: e.target.value})}
              className="premium-range purple"
            />
            <div className="range-labels">
              <span>{isRTL ? 'صافي' : 'Clear'}</span>
              <span>{isRTL ? 'مرتبك' : 'Confused'}</span>
            </div>
          </div>

          {/* Appetite Slider */}
          <div className="premium-log-input">
            <div className="label-row">
              <span className="log-label">{t('dashboard.appetite')}</span>
              <span className="log-val-badge">{log.appetite}/5</span>
            </div>
            <input 
              type="range" min="1" max="5" 
              value={log.appetite} 
              onChange={(e) => setLog({...log, appetite: e.target.value})}
              className="premium-range orange"
            />
            <div className="range-labels">
              <span>{isRTL ? 'ضعيفة' : 'Poor'}</span>
              <span>{isRTL ? 'ممتازة' : 'Great'}</span>
            </div>
          </div>

          {/* Mood Selection */}
          <div className="premium-log-input">
            <span className="log-label mb-2">{t('dashboard.generalMood')}</span>
            <div className="mood-chips">
              {moodOptions.map(opt => (
                <button 
                  key={opt.value}
                  className={`mood-chip ${log.mood === opt.value ? 'active' : ''}`}
                  onClick={() => setLog({...log, mood: opt.value})}
                  style={{ '--mood-color': opt.color }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Input */}
          <div className="premium-log-input">
            <span className="log-label mb-2">{t('dashboard.sleepHours')}</span>
            <div className="sleep-input-wrapper">
              <Moon size={18} />
              <input 
                type="number" 
                value={log.sleep} 
                onChange={(e) => setLog({...log, sleep: e.target.value})}
              />
              <span className="unit">{isRTL ? 'ساعة' : 'hrs'}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className={`log-submit-btn ${saving ? 'loading' : ''}`}
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {t('dashboard.saveLog')}
        </button>
      </div>

      <style>{`
        .log-premium { border-radius: 24px; background: white; height: 100%; display: flex; flex-direction: column; }
        .log-head { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
        .log-title { display: flex; gap: 12px; align-items: center; }
        .log-ico-box { width: 40px; height: 40px; border-radius: 12px; background: #fdf2f8; color: #db2777; display: flex; align-items: center; justify-content: center; }
        .log-head h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #1e293b; }
        .log-head p { margin: 2px 0 0; font-size: 0.8rem; color: #94a3b8; font-weight: 600; }
        .log-info-ico { color: #cbd5e1; cursor: help; }

        .log-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .log-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        
        .premium-log-input { display: flex; flex-direction: column; }
        .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .log-label { font-size: 0.85rem; font-weight: 700; color: #475569; }
        .log-val-badge { font-size: 0.7rem; font-weight: 800; background: #f1f5f9; padding: 2px 8px; border-radius: 6px; color: #475569; }
        
        .premium-range {
          width: 100%; height: 6px; border-radius: 10px; appearance: none; background: #f1f5f9; outline: none;
        }
        .premium-range.purple { accent-color: #a855f7; }
        .premium-range.orange { accent-color: #f97316; }
        .range-labels { display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; }

        .mood-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .mood-chip {
          padding: 8px 12px; border-radius: 10px; border: 1px solid #f1f5f9; background: #f8fafc;
          font-size: 0.8rem; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.2s;
        }
        .mood-chip.active {
          background: white; border-color: var(--mood-color); color: var(--mood-color);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .sleep-input-wrapper {
          display: flex; align-items: center; gap: 10px; padding: 0 12px; height: 44px;
          background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; color: #64748b;
        }
        .sleep-input-wrapper input {
          width: 100%; border: none; background: none; font-weight: 800; color: #1e293b; font-size: 1rem;
        }
        .sleep-input-wrapper .unit { font-size: 0.75rem; font-weight: 700; color: #94a3b8; }

        .log-submit-btn {
          width: 100%; height: 50px; border-radius: 16px; background: #1e3a5f; color: white;
          border: none; font-weight: 800; cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 10px; transition: all 0.2s;
        }
        .log-submit-btn:hover { background: #3b82f6; transform: translateY(-2px); }
        .log-submit-btn.loading { opacity: 0.8; cursor: wait; }

        @media (max-width: 600px) {
          .log-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default BehaviorLog;
