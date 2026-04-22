import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Activity, HeartPulse, Stethoscope, ChevronDown, ChevronUp, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/about.css';

const TypeDetailModal = ({ type, onClose }) => {
  const { t, i18n } = useTranslation();
  if (!type) return null;
  const isRTL = i18n.language === 'ar';

  return (
    <div className="modal-overlay" onClick={onClose} dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="modal-content glass-card"
        onClick={e => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}><X size={24} /></button>
        <div className="modal-body-layout">
          <div className="modal-image">
            <img src={type.image} alt={type.name} />
          </div>
          <div className="modal-info">
            <div className="modal-badge mb-3">{t('aboutAlzheimer.modalBadge')}</div>
            <h2>{type.name}</h2>
            <div className="modal-desc-wrapper">
              <p className="modal-desc">{type.description}</p>
            </div>
            <div className="modal-details-grid mt-6">
              <div className="symptoms-box">
                <h4><Activity size={18} className="icon-purple" /> {t('aboutAlzheimer.indicators')}</h4>
                <ul>
                  {type.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="medical-note-box">
                <div className="note-header">
                  <Info size={18} className="icon-purple" />
                  <strong>{t('aboutAlzheimer.pharmacistNote')}</strong>
                </div>
                <p>{type.note}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AboutAlzheimer = () => {
  const [openSection, setOpenSection] = useState('what');
  const [selectedType, setSelectedType] = useState(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ALZHEIMER_HALLMARKS = [
    { id: 'amyloid', ...t('aboutAlzheimer.details.amyloid', { returnObjects: true }), image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80' },
    { id: 'tau', ...t('aboutAlzheimer.details.tau', { returnObjects: true }), image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80' },
    { id: 'cholinergic', ...t('aboutAlzheimer.details.cholinergic', { returnObjects: true }), image: 'https://images.unsplash.com/photo-1559757117-574196d88a2c?auto=format&fit=crop&w=800&q=80' },
    { id: 'inflammation', ...t('aboutAlzheimer.details.inflammation', { returnObjects: true }), image: 'https://images.unsplash.com/photo-1559757166-057d020e5571?auto=format&fit=crop&w=800&q=80' },
    { id: 'mci', ...t('aboutAlzheimer.details.mci', { returnObjects: true }), image: 'https://images.unsplash.com/photo-1559757117-574196d88a2c?auto=format&fit=crop&w=800&q=80' },
    { id: 'mild', ...t('aboutAlzheimer.details.mild', { returnObjects: true }), image: 'https://images.unsplash.com/photo-1559757114-1f6e80b8529e?auto=format&fit=crop&w=800&q=80' },
    { id: 'moderate', ...t('aboutAlzheimer.details.moderate', { returnObjects: true }), image: 'https://images.unsplash.com/photo-1559757114-1f6e80b8529e?auto=format&fit=crop&w=800&q=80' },
    { id: 'severe', ...t('aboutAlzheimer.details.severe', { returnObjects: true }), image: 'https://images.unsplash.com/photo-1559757114-1f6e80b8529e?auto=format&fit=crop&w=800&q=80' }
  ];

  const sections = [
    { id: 'what', icon: <Brain />, ...t('aboutAlzheimer.sections.what', { returnObjects: true }) },
    { id: 'causes', icon: <Activity />, ...t('aboutAlzheimer.sections.causes', { returnObjects: true }) },
    { id: 'diagnosis', icon: <Stethoscope />, ...t('aboutAlzheimer.sections.diagnosis', { returnObjects: true }) }
  ];

  return (
    <div className="about-alzheimer-page container" dir={isRTL ? 'rtl' : 'ltr'}>
      <TypeDetailModal type={selectedType} onClose={() => setSelectedType(null)} />

      <div className="about-header-wrapper animate-fade-in">
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <span className="about-subtitle">{t('aboutAlzheimer.subtitle')}</span>
            <h1 className="about-title">{t('aboutAlzheimer.title')}</h1>
            <p className="about-desc">{t('aboutAlzheimer.desc')}</p>
        </div>
      </div>

      <div className="educational-content-area custom-margin-top">
        <div className="faq-container">
          {sections.map((section) => (
            <div key={section.id} className="faq-card glass-card">
              <button
                className="faq-button"
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              >
                <div className="faq-title-wrap">
                  <div className={`faq-icon ${openSection === section.id ? 'active' : ''}`}>
                    {section.icon}
                  </div>
                  <h3 className={`faq-title ${openSection === section.id ? 'active' : ''}`}>
                    {section.title}
                  </h3>
                </div>
                {openSection === section.id ? <ChevronUp size={24} className="icon-purple" /> : <ChevronDown size={24} className="icon-muted" />}
              </button>
              
              <AnimatePresence>
                {openSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="faq-content">
                      <div className="faq-divider"></div>
                      <div className="faq-text">
                        {section.content}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <section className="section-spacing bg-unified alzheimer-stages-section">
        <div className="container alzheimer-stages-container">
          <div className="section-header alzheimer-section-header">
            <h2>{t('aboutAlzheimer.classTitle')}</h2>
            <p>{t('aboutAlzheimer.classSubtitle')}</p>
          </div>
          <div className="types-full-grid">
            {ALZHEIMER_HALLMARKS.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.05, y: -10 }}
                className="type-card-premium glass-card"
                onClick={() => setSelectedType(type)}
              >
                <div className="type-card-img">
                  <img src={type.image} alt={type.name} />
                  <div className="type-card-overlay">
                    <span className="view-details">{t('aboutAlzheimer.clickDetails')}</span>
                  </div>
                </div>
                <div className="type-card-info">
                  <h3>{type.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <style>{`
        .custom-margin-top {
          margin-top: -30px;
          position: relative;
          z-index: 10;
        }
        .alzheimer-stages-section { margin-top: 4rem; padding: 4rem 0; border-radius: 24px; background: rgba(146, 168, 209, 0.03); }
        .alzheimer-stages-container { padding: 0 2rem; }
        .alzheimer-section-header { text-align: center; margin-bottom: 3rem; }
        .alzheimer-section-header h2 { font-size: 2.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem; }
        .alzheimer-section-header p { color: var(--text-muted); font-size: 1.1rem; }
        .faq-container { max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
        .faq-card { overflow: hidden; padding: 0; border-radius: 16px; border: 1px solid rgba(146, 168, 209, 0.15) !important; }
        .faq-button { width: 100%; padding: 1.5rem; display: flex; align-items: center; justify-content: space-between; background: none; border: none; cursor: pointer; }
        .faq-title-wrap { display: flex; align-items: center; gap: 1rem; }
        .faq-icon { padding: 0.75rem; border-radius: 50%; background: rgba(0,0,0,0.03); color: var(--text-muted); transition: all 0.3s; }
        .faq-icon.active { background: rgba(146, 168, 209, 0.1); color: var(--primary); }
        .faq-title { font-size: 1.15rem; font-weight: 600; color: var(--text-main); margin: 0; transition: color 0.3s; }
        .faq-title.active { color: var(--primary); }
        .faq-content { padding: 0 1.5rem 1.5rem 1.5rem; }
        .faq-divider { height: 1px; background: rgba(146, 168, 209, 0.1); margin-bottom: 1rem; }
        .faq-text { color: var(--text-secondary); line-height: 1.7; font-size: 1.05rem; white-space: pre-wrap; }
        .icon-purple { color: var(--primary); }
        .icon-muted { color: var(--text-muted); }
        .types-full-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .type-card-premium { cursor: pointer; position: relative; overflow: hidden; border-radius: 20px; padding: 0 !important; border: 1px solid rgba(146, 168, 209, 0.1) !important; background: white; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .type-card-premium:hover { box-shadow: 0 20px 40px rgba(146, 168, 209, 0.12); }
        .type-card-img { position: relative; height: 180px; width: 100%; overflow: hidden; }
        .type-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .type-card-premium:hover .type-card-img img { transform: scale(1.1); }
        .type-card-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(146, 168, 209, 0.2); opacity: 0; transition: opacity 0.3s; }
        .type-card-premium:hover .type-card-overlay { opacity: 1; }
        .view-details { background: white; color: var(--primary); padding: 8px 16px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .type-card-info { padding: 1rem; text-align: center; }
        .type-card-info h3 { margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-main); }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(6px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .modal-content { width: min(1100px, 95vw); max-height: 90vh; overflow-y: auto; background: white; border-radius: 24px; position: relative; }
        .modal-body-layout { display: grid; grid-template-columns: 1fr 1.15fr; min-height: 520px; }
        .modal-image { background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal-image img { width: 100%; max-height: 420px; object-fit: cover; }
        .modal-info { padding: 2rem; }
        .modal-badge { display: inline-block; background: rgba(146, 168, 209, 0.1); color: var(--primary); border-radius: 999px; font-size: 0.75rem; font-weight: 800; padding: 0.45rem 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; }
        .modal-desc { color: var(--text-secondary); line-height: 1.6; }
        .modal-details-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .symptoms-box, .medical-note-box { background: rgba(146, 168, 209, 0.06); border: 1px solid rgba(146, 168, 209, 0.12); border-radius: 14px; padding: 1rem; }
        .symptoms-box ul { padding-inline-start: 1.25rem; margin: 0.5rem 0 0; }
        .medical-note-box p { margin: 0.5rem 0 0; color: var(--text-main); }
        .note-header { display: flex; align-items: center; gap: 0.5rem; }
        .close-btn { position: absolute; top: 1rem; inset-inline-end: 1rem; border: 1px solid var(--border); border-radius: 999px; background: white; width: 40px; height: 40px; display: grid; place-items: center; cursor: pointer; color: var(--text-muted); }
        .close-btn:hover { color: #ef4444; }

        @media (max-width: 1200px) { .types-full-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px) { .types-full-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .types-full-grid { grid-template-columns: 1fr; } .modal-body-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default AboutAlzheimer;
