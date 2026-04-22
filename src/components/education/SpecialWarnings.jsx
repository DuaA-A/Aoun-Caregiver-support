import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Baby, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import '../../styles/about.css'; // Inheriting global header classes

const SpecialWarnings = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pediatric = t('specialWarnings.pediatric', { returnObjects: true });
  const elderly = t('specialWarnings.elderly', { returnObjects: true });

  return (
    <div className="special-warnings-page container" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Standardized Header ─────────────────────────────────────────────────── */}
      <div className="about-header-wrapper animate-fade-in">
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <span className="about-subtitle">{t('specialWarnings.subtitle')}</span>
            <h1 className="about-title">{t('specialWarnings.title')}</h1>
            <p className="about-desc">{t('specialWarnings.desc')}</p>
        </div>
      </div>

      <div className="warnings-content-area custom-margin-top">
        
        {/* Pediatric Section */}
        <section className="warning-section">
          <div className="section-title-wrap">
            <div className="title-icon pediatric-icon"><Baby size={40} /></div>
            <h2>{pediatric.title}</h2>
            <div className="title-divider pediatric-divider"></div>
          </div>
          
          <div className="warning-cards-grid">
            {pediatric.items.map((item, idx) => (
              <motion.div 
                key={idx}
                className="glass-card warning-card border-pediatric"
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Elderly Section */}
        <section className="warning-section" style={{ marginTop: '5rem' }}>
          <div className="section-title-wrap">
            <div className="title-icon elderly-icon"><UserCircle size={40} /></div>
            <h2>{elderly.title}</h2>
            <div className="title-divider elderly-divider"></div>
          </div>
          
          <div className="warning-cards-grid">
            {elderly.items.map((item, idx) => (
              <motion.div 
                key={idx}
                className="glass-card warning-card border-elderly"
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.1 }}
              >
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      <style>{`
        .custom-margin-top {
          margin-top: 0px; 
          position: relative;
          z-index: 10;
          padding-bottom: 5rem;
        }

        .warning-section {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title-wrap {
          text-align: center;
          margin-bottom: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .pediatric-icon {
          background-color: #dbeafe;
          color: #2563eb;
        }
        .elderly-icon {
          background-color: #fef3c7;
          color: #d97706;
        }

        .section-title-wrap h2 {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 1rem 0;
        }

        .title-divider {
          height: 4px;
          width: 60px;
          border-radius: 2px;
        }
        .pediatric-divider { background-color: #3b82f6; }
        .elderly-divider { background-color: #f59e0b; }

        .warning-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .warning-cards-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .warning-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        .border-pediatric { border-top: 5px solid #3b82f6; }
        .border-elderly { border-top: 5px solid #f59e0b; }

        .warning-card h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 1rem;
          text-align: inherit;
        }
        
        .border-pediatric h3 { color: #1e40af; }
        .border-elderly h3 { color: #92400e; }

        .warning-card p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1.05rem;
          margin: 0;
          text-align: inherit;
        }
      `}</style>
    </div>
  );
};

export default SpecialWarnings;
