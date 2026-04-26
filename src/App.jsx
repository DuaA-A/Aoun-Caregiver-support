import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from './components/common/Navbar';
import AuthWindow from './components/auth/AuthWindow';
import InteractionChecker from './components/checker/InteractionChecker';
import UserProfile from './components/profile/UserProfile';
import About from './components/about/About';
import FirstAid from './components/education/FirstAid';
import AboutAlzheimer from './components/education/AboutAlzheimer';
import MythsFacts from './components/education/MythsFacts';
import SpecialWarnings from './components/education/SpecialWarnings';
import { Shield, Activity, Pill, User, ChevronRight, Heart, ClipboardList, ArrowRight, ShieldCheck, FileText, X, Info, Users } from 'lucide-react';
import homeImg1 from '../images/home_img.jpg';
import homeImg2 from '../images/home_img2.webp';
import homeImg3 from '../images/home_img3.jpg';
import homeImg4 from '../images/home_img4.jpg';

const Home = ({ onOpenAuth }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const values = t('about.values', { returnObjects: true });

  return (
    <div className="home-container animate-fade-in">

      {/* Hero Section */}
      <section className="full-screen-section modern-hero">
        {/* Pulsing Background Circles */}
        <div className="pulsing-circle" style={{ width: '300px', height: '300px', top: '10%', left: '5%', background: 'var(--primary)', animationDelay: '0s' }}></div>
        <div className="pulsing-circle" style={{ width: '200px', height: '200px', bottom: '20%', left: '15%', background: 'var(--secondary)', animationDelay: '2s' }}></div>
        <div className="pulsing-circle" style={{ width: '150px', height: '150px', top: '40%', left: '40%', background: 'var(--accent)', animationDelay: '4s' }}></div>

        <div className="hero-content container">
          <div className={`hero-flex-wrapper${isRTL ? ' hero-ar' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <motion.div 
              className="hero-text-side" 
              style={{ textAlign: 'start' }}
              initial={{ x: isRTL ? 150 : -150, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              {/* Badge removed again as per user's earlier request */}
              <h1 className="hero-title">
                {isRTL ? (
                  <span className="text-vibrant-gradient">{t('home.heroTitle')}</span>
                ) : (
                  <>
                    {t('home.heroTitle').split(' ').slice(0, -3).join(' ')} <br />
                    <span className="text-vibrant-gradient italic">{t('home.heroTitle').split(' ').slice(-3).join(' ')}</span>
                  </>
                )}
              </h1>
              <p className="hero-description">
                {t('home.heroDescription')}
              </p>

              <div className="hero-cta-group">
                <Link to="/first-aid" className="btn btn-premium-glow">
                  {t('common.emergencyFirstAid')} {isRTL ? <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} /> : <ChevronRight size={20} />}
                </Link>
                <Link to="/checker" className="btn btn-premium-outline">
                  {t('common.interactionChecker')}
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className={isRTL ? 'hero-image-side hero-image-rtl' : 'hero-image-side'}
              initial={{ x: isRTL ? -150 : 150, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <div className="hero-circles-container">
                {/* Main Circle Images - More Separated and Dynamic */}
                <motion.div 
                  className="image-circle circle-1"
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img src={homeImg1} alt="Care" />
                </motion.div>
                <motion.div 
                  className="image-circle circle-2"
                  animate={{ 
                    y: [0, 20, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <img src={homeImg2} alt="Support" />
                </motion.div>
                <motion.div 
                  className="image-circle circle-3"
                  animate={{ 
                    scale: [1, 1.08, 1],
                    x: [0, 15, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <img src={homeImg3} alt="Clinical" />
                </motion.div>
                <motion.div 
                  className="image-circle circle-4"
                  animate={{ 
                    y: [0, -15, 0],
                    scale: [1, 1.05, 1],
                    x: [0, -10, 0]
                  }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <img src={homeImg4} alt="Activity" />
                </motion.div>
                
                {/* Decorative Small Bubbles */}
                <div className="mini-bubble bubble-1"></div>
                <div className="mini-bubble bubble-2"></div>
                <div className="mini-bubble bubble-3"></div>
                <div className="mini-bubble bubble-4"></div>
                <div className="mini-bubble bubble-5"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Wave Shape */}
        <div className="hero-wave">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>


      {/* 2. Understanding Epilepsy - Intro Link */}
      <section className="section-spacing bg-unified text-center">
        <div className="container">
          <motion.div 
            className="section-header centered-header glass-card highlight-section-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2>{t('home.understandingTitle')}</h2>
            <p>{t('home.understandingDescription')}</p>
            <Link to="/about-alzheimer" className="btn btn-premium mt-8">{t('home.understandingBtn')}</Link>
          </motion.div>
        </div>
      </section>

      {/* 3. Medical Values */}
      <section className="section-spacing bg-unified text-center">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <motion.span 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)', fontWeight: 800 }}>
              {t('about.valuesSubtitle')}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>
              {t('about.valuesTitle')}
            </motion.h2>
          </div>

          <div className="values-grid-home">
            {Array.isArray(values) && values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                className="value-card-gradient glass-card"
                style={{ padding: '2.5rem 2rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.2)', color: 'white', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                  ✦
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>{value.title}</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Support Services */}
      <section className="section-spacing bg-unified text-center">
        <div className="container">
          <motion.div 
            className="section-header centered-header"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2>{t('home.servicesTitle')}</h2>
            <p>{t('home.servicesSubtitle')}</p>
          </motion.div>
          <div className="services-grid mt-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }} 
              className="service-card glass-card"
            >
              <div className="service-icon"><Activity size={40} /></div>
              <h3>{t('home.eduTitle')}</h3>
              <p>{t('home.eduDesc')}</p>
              <Link to="/first-aid" className="btn btn-premium mt-4">{t('common.learnMore')}</Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }} 
              className="service-card glass-card"
            >
              <div className="service-icon"><Pill size={40} /></div>
              <h3>{t('home.checkerTitle')}</h3>
              <p>{t('home.checkerDesc')}</p>
              <Link to="/checker" className="btn btn-premium mt-4">{t('common.checkDrugs')}</Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }} 
              className="service-card glass-card"
            >
              <div className="service-icon"><FileText size={40} /></div>
              <h3>{t('home.archivesTitle')}</h3>
              <p>{t('home.archivesDesc')}</p>
              <Link to="/profile" className="btn btn-premium mt-4">{t('common.viewHistory')}</Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              whileHover={{ y: -10, scale: 1.02 }} 
              className="service-card glass-card"
            >
              <div className="service-icon"><Users size={40} /></div>
              <h3>{t('common.aboutTeam')}</h3>
              <p>{t('about.desc')}</p>
              <Link to="/about" className="btn btn-premium mt-4">{t('common.learnMore')}</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Sign-Up CTA Section */}
      <section className="section-spacing bg-unified text-center">
        <div className="container cta-border-card-wrapper">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="cta-glass-card glass-card"
          >
            <h2>{t('home.ctaTitle')}</h2>
            <p>{t('home.ctaDesc')}</p>
            <div className="cta-buttons mt-8">
              <button className="btn-white-solid" onClick={onOpenAuth}>{t('common.registerNow')}</button>
              <Link to="/about" className="btn-outline-white">{t('common.learnMore')}</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .home-container { display: flex; flex-direction: column; gap: 0rem; padding-bottom: 0rem; position: relative; }
        
        .full-screen-section { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: clamp(4rem, 10vh, 8rem) 0; box-sizing: border-box; position: relative; }
        .bg-unified { background: linear-gradient(135deg, #f8fafc 0%, rgba(157, 141, 241, 0.15) 100%); }
        .bg-glass-blur { background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(20px); }
        .text-vibrant-gradient { 
          background: linear-gradient(135deg, #1e3a5f 0%, #3b82f6 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        /* Active Badge */
        .active-badge { display: inline-flex; align-items: center; padding: 6px 16px; background: rgba(126, 34, 206, 0.1); color: var(--primary); border-radius: 30px; font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid rgba(126, 34, 206, 0.2); }

        /* Modern Hero Styles (Updated) */
        .modern-hero {
          position: relative;
          background: var(--hero-gradient);
          margin-top: -80px;
          padding-top: 80px;
          overflow: hidden;
        }
        .hero-flex-wrapper { 
          display: flex; 
          flex-direction: row; 
          align-items: center; 
          justify-content: space-between; 
          gap: 4rem; 
          width: 100%; 
          min-height: calc(100vh - 80px); 
          padding-top: 0.5rem; 
        }
        .hero-text-side { 
          flex: 1; 
          z-index: 10; 
          text-align: start; 
          padding-inline: 0; 
          max-width: 48%; 
          margin-inline-start: -40px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .hero-badge-pill {
          display: inline-flex; align-items: center; padding: 8px 20px; margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.4); color: var(--text-main); border-radius: 30px; font-weight: 800;
          font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
        }
        .hero-image-side { 
          flex: 1; 
          display: flex; 
          justify-content: flex-end; 
          align-items: center; 
          z-index: 5; 
          position: relative; 
          max-width: 50%;
        }
        
        .hero-circles-container { 
          position: relative; 
          width: 100%; 
          max-width: 720px; 
          height: 620px; 
          margin-inline-end: -20px;
        }
        .image-circle { position: absolute; border-radius: 50%; overflow: hidden; border: 6px solid white; box-shadow: 0 30px 60px rgba(0,0,0,0.12); background: white; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .image-circle:hover { transform: scale(1.05) translateY(-10px); z-index: 10; box-shadow: 0 40px 80px rgba(0,0,0,0.2); }
        .image-circle img { width: 100%; height: 100%; object-fit: cover; }
        
        /* Spread Wide Layout - Fixed to Right Half to Avoid Overlap */
        .image-circle.circle-1 { width: 320px; height: 320px; z-index: 3; top: 0; right: 0; }
        .image-circle.circle-2 { width: 260px; height: 260px; z-index: 2; bottom: 20px; right: 40px; }
        .image-circle.circle-3 { width: 220px; height: 220px; z-index: 4; top: 160px; right: 260px; }
        .image-circle.circle-4 { width: 180px; height: 180px; z-index: 5; top: 20px; right: 340px; }

        /* RTL Circle Flipping */
        [dir="rtl"] .image-circle.circle-1 { right: auto; left: 0; }
        [dir="rtl"] .image-circle.circle-2 { right: auto; left: 40px; }
        [dir="rtl"] .image-circle.circle-3 { right: auto; left: 260px; }
        [dir="rtl"] .image-circle.circle-4 { right: auto; left: 340px; }
        
        .mini-bubble { position: absolute; border-radius: 50%; opacity: 0.6; filter: blur(2px); animation: pulse-mini 5s infinite ease-in-out; }
        @keyframes pulse-mini { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.4); opacity: 0.8; } }
        .bubble-1 { width: 60px; height: 60px; top: -40px; left: 10%; background: var(--primary); }
        .bubble-2 { width: 40px; height: 40px; bottom: 10%; left: -5%; background: var(--secondary); }
        .bubble-3 { width: 30px; height: 30px; top: 40%; right: -5%; background: var(--accent); }
        .bubble-4 { width: 50px; height: 50px; top: -20px; right: 20%; background: var(--primary-dark); }
        .bubble-5 { width: 35px; height: 35px; bottom: -30px; right: 30%; background: var(--secondary-dark); }

        .btn-premium-glow {
          background: var(--text-main);
          color: white !important;
          padding: 16px 36px;
          border-radius: 30px;
          font-weight: 800;
          box-shadow: 0 10px 25px rgba(30, 58, 95, 0.3);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        .btn-premium-glow:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(30, 58, 95, 0.4); background: #2a528a; }
        
        .btn-premium-outline {
          border: 2px solid var(--text-main);
          color: var(--text-main) !important;
          padding: 16px 36px;
          border-radius: 30px;
          font-weight: 800;
          transition: all 0.3s;
          background: transparent;
        }
        .btn-premium-outline:hover { background: var(--text-main); color: white !important; transform: translateY(-3px); }

        .hero-title { font-size: clamp(2.5rem, 6vw, 4.2rem); font-weight: 900; line-height: 1.1; margin-bottom: 2rem; color: #0a2540 !important; }
        .hero-cta-group { display: flex; gap: 1.5rem; align-items: center; margin-top: 1rem; }
        .hero-description { font-size: clamp(1rem, 2vw, 1.25rem); line-height: 1.7; color: var(--text-muted); max-width: 600px; margin-bottom: 3rem; }

        @media (max-width: 1024px) {
          .hero-flex-wrapper { flex-direction: column; text-align: center; padding-top: 4rem; padding-bottom: 6rem; gap: 4rem; height: auto; min-height: 100vh; }
          .hero-text-side { text-align: center !important; display: flex; flex-direction: column; align-items: center; max-width: 100%; }
          .hero-image-side { width: 100%; justify-content: center; }
          .hero-circles-container { height: 450px; max-width: 450px; margin: 0 auto; }
          .image-circle.circle-1 { width: 220px; height: 220px; }
          .image-circle.circle-2 { width: 180px; height: 180px; }
          .image-circle.circle-3 { width: 150px; height: 150px; top: 150px; right: 250px; }
          .image-circle.circle-4 { width: 120px; height: 120px; top: 20px; right: 280px; }
          [dir="rtl"] .image-circle.circle-3 { right: auto; left: 250px; }
          [dir="rtl"] .image-circle.circle-4 { right: auto; left: 280px; }
          .hero-cta-group { flex-direction: column; width: 100%; }
          .hero-cta-group > * { width: 100%; max-width: 350px; }
        }

        @media (max-width: 640px) {
          .hero-circles-container { height: 320px; max-width: 320px; }
          .image-circle.circle-1 { width: 160px; height: 160px; }
          .image-circle.circle-2 { width: 130px; height: 130px; }
          .image-circle.circle-3 { width: 110px; height: 110px; top: 110px; right: 180px; }
          .image-circle.circle-4 { width: 90px; height: 90px; top: 10px; right: 200px; }
          [dir="rtl"] .image-circle.circle-3 { right: auto; left: 180px; }
          [dir="rtl"] .image-circle.circle-4 { right: auto; left: 200px; }
          .hero-title { font-size: 2.2rem; }
          .hero-badge-pill { font-size: 0.7rem; padding: 6px 16px; }
          .section-spacing { padding: 4rem 0; }
          .services-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .values-grid-home { grid-template-columns: 1fr; }
        }
      `}</style>
      </div>
  );
};

const App = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`app-container ${i18n.language === 'ar' ? 'rtl-mode' : ''}`}>
      <AnimatePresence>
        {isAppLoading && (
          <motion.div 
            className="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="splash-logo-container"
            >
              <img src="/logo.png" alt="Aoun Logo" className="splash-logo-img" />
              <h1 className="splash-logo-text">{i18n.language === 'ar' ? 'عون' : 'Aoun'}</h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar onOpenAuth={() => setShowAuth(true)} />

      {showAuth && <AuthWindow onClose={() => setShowAuth(false)} />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home onOpenAuth={() => setShowAuth(true)} />} />
          <Route path="/first-aid" element={<FirstAid />} />
          <Route path="/about-alzheimer" element={<AboutAlzheimer />} />
          <Route path="/myths-facts" element={<MythsFacts />} />
          <Route path="/special-warnings" element={<SpecialWarnings />} />
          <Route path="/checker" element={<InteractionChecker onOpenAuth={() => setShowAuth(true)} />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="footer dark-footer">
        <div className="footer-content">
          <p>{t('footer.copyright')}</p>
          <p className="disclaimer">{t('footer.disclaimer')}</p>
        </div>
      </footer>

      <style>{`
        .app-container { min-height: 100vh; display: flex; flex-direction: column; position: relative; overflow-x: hidden; }
        .main-content { flex: 1; padding-top: 80px; width: 100%; position: relative; z-index: 1; margin-bottom: 0; }
        .dark-footer { margin-top: auto; padding: 3rem 2rem; text-align: center; background: #1c3a4f; color: white; position: relative; z-index: 1; }
        .footer-content { max-width: 800px; margin: 0 auto; }
        .disclaimer { font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); margin-top: 1rem; line-height: 1.6; }
        
        /* RTL Mode Overrides */
        .rtl-mode { font-family: 'Cairo', 'Inter', sans-serif !important; }
        
        /* Splash Screen */
        .splash-screen {
          position: fixed; inset: 0; background: var(--bg-gradient); z-index: 999999; display: flex; align-items: center; justify-content: center;
        }
        .splash-logo-container {
          display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
        }
        .splash-logo-img { width: 120px; height: auto; animation: heartbeat 1.5s infinite ease-in-out; filter: drop-shadow(0 0 30px rgba(157, 141, 241, 0.4)); }
        .splash-logo-text { font-size: 3rem; color: #0a2540; font-weight: 900; letter-spacing: 0.02em; margin: 0; font-family: 'Plus Jakarta Sans', 'Tajawal', sans-serif; }
        .rtl-mode .splash-logo-text { font-size: 3.2rem; }
        .splash-logo-text .safe-text { color: var(--primary); }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        
        /* Animated Values Cards */
        .values-grid-home { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; }
        .value-card-gradient {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 15px 40px rgba(157, 141, 241, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .value-card-gradient:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(157, 141, 241, 0.3);
        }
      `}</style>
    </div>
  );
};

export default App;
