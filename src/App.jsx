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
              <span className="hero-badge-pill">{t('home.heroBadge')}</span>
              <h1 className="hero-title">
                {isRTL ? (
                  <>
                    {t('home.heroTitle')}
                  </>
                ) : (
                  <>
                    {t('home.heroTitle').split(' ').slice(0, -3).join(' ')} <br />
                    <span className="text-glow italic" style={{ color: 'var(--text-main)' }}>{t('home.heroTitle').split(' ').slice(-3).join(' ')}</span>
                  </>
                )}
              </h1>
              <p className="hero-description">
                {t('home.heroDescription')}
              </p>

              <div className="hero-cta-group">
                <Link to="/first-aid" className="btn btn-premium">
                  {t('common.emergencyFirstAid')} {isRTL ? <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} /> : <ChevronRight size={20} />}
                </Link>
                <Link to="/checker" className="btn btn-outline-primary">
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
                {/* Main Circle Images */}
                <motion.div 
                  className="image-circle circle-1"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img src={homeImg1} alt="Care" />
                </motion.div>
                <motion.div 
                  className="image-circle circle-2"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <img src={homeImg2} alt="Support" />
                </motion.div>
                <motion.div 
                  className="image-circle circle-3"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <img src={homeImg3} alt="Clinical" />
                </motion.div>
                <motion.div 
                  className="image-circle circle-4"
                  animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <img src={homeImg4} alt="Activity" />
                </motion.div>
                
                {/* Decorative Small Bubbles */}
                <div className="mini-bubble bubble-1"></div>
                <div className="mini-bubble bubble-2"></div>
                <div className="mini-bubble bubble-3"></div>
                <div className="mini-bubble bubble-4"></div>
                <div className="mini-bubble bubble-5"></div>
                <div className="mini-bubble bubble-6"></div>
                <div className="mini-bubble bubble-7"></div>
                <div className="mini-bubble bubble-8"></div>
                <div className="mini-bubble bubble-9"></div>
                <div className="mini-bubble bubble-10"></div>
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
        
        .full-screen-section { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 6rem 0; box-sizing: border-box; position: relative; }
        .bg-unified { background: linear-gradient(135deg, #f8fafc 0%, rgba(157, 141, 241, 0.15) 100%); }
        .bg-glass-blur { background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(20px); }
        .text-glow { text-shadow: 0 0 15px rgba(238, 190, 241, 0.5); }

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
        .hero-flex-wrapper { display: flex; flex-direction: row; align-items: flex-start; justify-content: space-between; gap: clamp(2.5rem, 5vw, 5.5rem); width: 100%; min-height: calc(100vh - 80px); padding-top: 0.5rem; }
        .hero-ar.hero-flex-wrapper { gap: clamp(3rem, 6vw, 6rem); }
        .hero-text-side { flex: 1; z-index: 10; text-align: start; padding-inline: 0; max-width: 36rem; }
        .hero-image-rtl { margin-top: 0.75rem; }
        .hero-badge-pill {
          display: inline-flex; align-items: center; padding: 6px 16px; margin-bottom: 1.25rem;
          background: rgba(126, 34, 206, 0.1); color: var(--primary); border-radius: 30px; font-weight: 800;
          font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid rgba(126, 34, 206, 0.2);
        }
        .hero-image-side { flex: 1.15; display: flex; justify-content: center; align-items: flex-start; z-index: 5; position: relative; margin-top: 0.5rem; }
        
        .hero-circles-container { position: relative; width: 100%; height: 500px; display: flex; justify-content: center; align-items: center; }
        .image-circle { position: absolute; border-radius: 50%; overflow: hidden; border: 4px solid white; box-shadow: 0 20px 40px rgba(0,0,0,0.1); background: white; }
        .image-circle img { width: 100%; height: 100%; object-fit: cover; }
        
        .image-circle.circle-1 { width: 320px; height: 320px; z-index: 3; top: -20px; left: 0px; }
        .image-circle.circle-2 { width: 350px; height: 350px; z-index: 2; top: 40px; right: -80px; }
        .image-circle.circle-3 { width: 220px; height: 220px; z-index: 4; bottom: -40px; left: 60px; }
        .image-circle.circle-4 { width: 160px; height: 160px; z-index: 5; top: 180px; left: -100px; }
        
        .mini-bubble { position: absolute; border-radius: 50%; opacity: 0.6; filter: blur(1px); animation: pulse-mini 4s infinite ease-in-out; }
        @keyframes pulse-mini { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.3); opacity: 0.7; } }
        .bubble-1 { width: 40px; height: 40px; top: -30px; left: 160px; background: var(--primary); }
        .bubble-2 { width: 30px; height: 30px; top: -20px; right: 20px; background: var(--secondary); }
        .bubble-3 { width: 50px; height: 50px; bottom: 80px; left: -80px; background: var(--accent); }
        .bubble-4 { width: 25px; height: 25px; top: 320px; right: -40px; animation-delay: 1s; background: var(--primary-dark); }
        .bubble-5 { width: 35px; height: 35px; bottom: -60px; right: 80px; animation-delay: 2s; background: var(--secondary-dark); }
        .bubble-6 { width: 45px; height: 45px; top: 80px; left: -40px; animation-delay: 0.5s; background: var(--secondary); }
        .bubble-7 { width: 20px; height: 20px; top: 120px; right: 100px; animation-delay: 1.5s; background: var(--primary); }
        .bubble-8 { width: 35px; height: 35px; bottom: -15%; right: 25%; animation-delay: 0.8s; background: var(--accent); }
        .bubble-9 { width: 18px; height: 18px; top: 45%; right: -25%; animation-delay: 2.5s; background: var(--primary-dark); }
        .bubble-10 { width: 28px; height: 28px; top: 15%; left: -15%; animation-delay: 1.2s; background: var(--secondary-dark); }


        .btn-outline-primary { border: 2px solid var(--text-main); color: var(--text-main) !important; background: transparent; text-decoration: none !important; padding: 14px 28px; border-radius: 24px; font-weight: 700; transition: all 0.3s; }
        .btn-outline-primary:hover { background: var(--text-main); color: white !important; transform: translateY(-3px); }

        .hero-title { font-size: 4rem; font-weight: 900; line-height: 1.1; margin-bottom: 2rem; color: #0a2540 !important; text-decoration: none !important; font-family: 'Plus Jakarta Sans', 'Tajawal', system-ui, sans-serif; }
        [dir="rtl"] .hero-title { font-size: clamp(2.2rem, 5.5vw, 3.2rem); line-height: 1.35; }
        .hero-cta-group { display: flex; gap: 1.5rem; align-items: center; }
        .hero-description { font-size: 1.2rem; line-height: 1.7; color: var(--text-muted); max-width: 600px; margin-bottom: 3rem; }

        .btn-outline-white { border: 2px solid white; color: white !important; background: transparent; text-decoration: none !important; }
        .btn-outline-white:hover { background: white; color: var(--primary) !important; }
        .hero-cta-group a { text-decoration: none !important; }

        /* Brain Flow svg */
        .brain-flow-overlay { position: absolute; inset: -300px -600px; pointer-events: none; z-index: 3; mix-blend-mode: overlay; opacity: 0.6; }
        .brain-flow-svg { width: 100%; height: 100%; overflow: visible; }
        .flow-line { fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 200, 1000; animation: smoothFlow 7s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .flow-left { stroke: url(#waveGradient); }
        .flow-right { stroke: url(#waveGradientColor); }
        @keyframes smoothFlow { 0% { stroke-dashoffset: 1000; } 100% { stroke-dashoffset: 0; } }

        /* Intro Epilepsy Layout */
        .intro-epilepsy-layout { display: grid; grid-template-columns: 1.2fr 1fr; grid-template-areas: "text image" "stats image"; gap: 2rem 5rem; align-items: center; }
        .intro-text { grid-area: text; }
        .intro-image { grid-area: image; }
        .intro-text h2 { font-size: 3rem; margin-bottom: 1.5rem; }
        .intro-text p { font-size: 1.15rem; color: var(--text-muted); margin-bottom: 1.5rem; }
        .intro-image img { width: 100%; height: 500px; object-fit: cover; border-radius: 24px; }
        
        .stats-grid { grid-area: stats; display: flex; gap: 3rem; margin-top: 0 !important; }
        .stat-item h3 { font-size: 2.5rem; color: var(--primary); margin-bottom: 0.2rem; }
        .stat-item span { font-weight: 700; color: var(--text-muted); font-size: 0.9rem; }

        /* Types Grid (Premium) */
        .types-full-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
        .type-card-premium { cursor: pointer; position: relative; overflow: hidden; border-radius: 24px; padding: 0 !important; }
        .type-card-img { position: relative; height: 320px; width: 100%; background: #f8fafc; }
        .type-card-img img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .type-card-premium:hover .type-card-img img { transform: scale(1.05); }
        .type-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; align-items: flex-end; justify-content: center; padding: 2rem; opacity: 0; transition: opacity 0.3s; }
        .type-card-premium:hover .type-card-overlay { opacity: 1; }
        .view-details { color: white; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid white; padding-bottom: 4px; }
        .type-card-info { padding: 1.5rem; text-align: center; background: white; border-top: 1px solid var(--border); }
        .type-card-info h3 { font-size: 1.25rem; margin: 0; color: var(--text-main); }
        
        .type-card-premium { border: 2px solid white !important; box-shadow: 0 10px 40px rgba(157, 141, 241, 0.3) !important; position: relative; z-index: 1; }
        .type-card-premium::before { content: ''; position: absolute; inset: -4px; background: linear-gradient(135deg, var(--primary), #3b82f6); border-radius: 26px; z-index: -1; opacity: 0.2; }
        
        .intro-image { border: 8px solid white !important; box-shadow: 0 20px 50px rgba(157, 141, 241, 0.4) !important; position: relative; }
        .hero-img-container { 
          border: 4px solid rgba(255,255,255,0.3); 
          border-radius: 30px; 
          padding: 10px; 
          background: rgba(255,255,255,0.05); 
          box-shadow: 0 0 60px rgba(238, 190, 241, 0.2);
        }

        /* Empathy Section Overlay */
        .empathy-section-wrapper { position: relative; margin-top: -8rem; z-index: 100; padding: 0 2rem; }
        .empathy-section { padding: 4rem !important; text-align: center; max-width: 900px; margin: 0 auto; border: 2px solid rgba(126, 34, 206, 0.1) !important; }
        
        .highlight-section-box {
          padding: 4rem 3rem !important;
          max-width: 900px;
          margin: 0 auto;
          background: rgba(169, 204, 227, 0.2) !important; /* Calm soft blue */
          border: 1px solid rgba(169, 204, 227, 0.5) !important;
          border-radius: 32px !important;
          box-shadow: 0 10px 40px rgba(169, 204, 227, 0.15) !important;
        }
        .highlight-section-box h2 {
          font-size: 2.8rem;
          color: var(--text-main);
          margin-bottom: 1.5rem;
        }
        [dir="rtl"] .highlight-section-box p {
          font-size: 1.3rem; 
          line-height: 2.1 !important;
          color: var(--text-main);
          opacity: 0.9;
        }
        .empathy-lead { font-size: 1.4rem; font-weight: 500; line-height: 1.6; max-width: 900px; margin: 1.5rem auto 0; color: var(--text-main); }
        .empathy-icon { color: #f43f5e; margin-bottom: 1rem; }

        /* Services Grid Sync */
        .centered-header { max-width: 800px; margin: 0 auto 4rem; text-align: center; }
        .centered-header h2 { text-align: center; width: 100%; margin: 0 auto 1.5rem; }
        .centered-header p { text-align: center; margin: 0 auto; }
        .services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; width: 100%; }
        .service-card { padding: 2.5rem 1.5rem !important; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .service-icon { color: var(--primary); margin-bottom: 2rem; display: flex; justify-content: center; width: 100%; }
        .service-card h3 { font-size: 1.5rem; margin-bottom: 1rem; }
        .service-card p { max-width: 280px; }

        /* CTA Section - Gradient Border Card */
        .cta-border-card-wrapper { display: flex; justify-content: center; width: 100%; padding: 4rem 1.5rem; }
        .cta-glass-card { 
          padding: 5rem 3rem; 
          background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
          border: none !important; 
          color: white;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 20px 50px rgba(126, 34, 206, 0.25) !important;
          border-radius: 30px;
          text-align: center;
        }
        .cta-glass-card h2 { color: white !important; font-size: 2.8rem; margin-bottom: 1.5rem; font-weight: 800; }
        .cta-glass-card p { color: rgba(255, 255, 255, 0.95) !important; font-size: 1.2rem; margin-bottom: 2.5rem; line-height: 1.6; }
        .cta-buttons { display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .cta-buttons .btn { margin: 0 !important; }
        .btn-white-solid { background: white; color: var(--primary); font-weight: 800; border: none; padding: 14px 28px; border-radius: 30px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
        .btn-white-solid:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .btn-outline-white { border: 2px solid white; color: white !important; background: transparent; padding: 14px 28px; border-radius: 30px; font-weight: 700; display: inline-flex; align-items: center; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-white-dark { position: relative; background: white !important; color: var(--text-main) !important; border: none; padding: 14px 28px; border-radius: 30px; font-weight: 800; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); text-decoration: none; margin: 0; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s, color 0.3s; z-index: 1; overflow: hidden; }
        .btn-white-dark::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, var(--primary), var(--secondary)); opacity: 0; z-index: -1; transition: opacity 0.4s ease; border-radius: 30px; }
        .btn-white-dark:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.2) !important; color: white !important; }
        .btn-white-dark:hover::before { opacity: 1; }
        .btn-outline-white:hover { background: white !important; color: var(--primary) !important; transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }

        @media (max-width: 1000px) {
          .intro-epilepsy-layout { grid-template-columns: 1fr; grid-template-areas: "text" "image" "stats"; gap: 2rem; }
          .modal-body-layout { grid-template-columns: 1fr; gap: 2rem; }
          .types-full-grid, .services-grid { grid-template-columns: 1fr; padding: 0 1rem; }
          .type-card-img { height: 220px; }
          .modal-content { 
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            border-radius: 32px 32px 0 0;
            max-height: 85vh;
            padding: 1.5rem !important;
            margin: 0;
          }
          .modal-image { min-height: unset; height: auto; }
          .modal-image img { height: auto; max-height: 250px; object-fit: contain; }
          .modal-info { padding: 2rem 1rem; }
          
          .modern-hero { background: #1e1b4b; padding-top: 0; }
          .hero-flex-wrapper { flex-direction: column; text-align: center; justify-content: stretch; height: 85vh; padding-top: 1rem; padding-bottom: 4rem; position: relative; gap: 0; }
          .hero-text-side { padding-inline-end: 0; margin-bottom: 0; z-index: 10; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; text-align: center !important; }
          .hero-title { font-size: 2.6rem; color: #ffffff !important; font-weight: 900; margin-top: 0; margin-bottom: auto; line-height: 1.1; }
          .hero-description { color: #f8fafc !important; font-size: 1.05rem; font-weight: 500; margin-bottom: 2rem; max-width: 90%; }
          .hero-cta-group { flex-direction: column; gap: 1rem; width: 100%; align-items: center; }
          .hero-cta-group > * { width: 100%; max-width: 320px; display: flex; justify-content: center; box-sizing: border-box; }
          .hero-image-side { position: absolute; inset: 0; z-index: 0; opacity: 0.4; display: block; overflow: hidden; pointer-events: none; width: 100%; height: 100%; }
          .hero-img-container { padding: 0; border: none; background: transparent; box-shadow: none; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding-top: 1rem; }
          .hero-main-img { width: 100%; height: 100%; max-width: 100vw; object-fit: contain; object-position: center center; opacity: 1; transform: scale(1.1); }
          .hero-badge-pill { margin-bottom: 1rem; font-size: 0.75rem; }
          
          .full-screen-section { padding: 4rem 0; min-height: auto; }
          .intro-text h2 { font-size: 2rem; }
          .intro-image img { height: 300px; }
          .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%; text-align: center; justify-content: center; margin-top: 1.5rem !important; }
          .stat-item h3 { font-size: 1.5rem; }
          .stat-item span { font-size: 0.75rem; line-height: 1.2; display: block; }
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
