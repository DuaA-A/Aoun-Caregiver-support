import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  LogOut,
  Pill,
  Menu,
  X,
  BookOpen,
  Languages,
  CalendarClock,
} from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = ({ onOpenAuth }) => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const isHome = location.pathname === '/';
  const isActive = (path) => location.pathname === path;

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <nav className={`navbar fixed-top ${scrolled || !isHome ? 'navbar-scrolled' : 'navbar-transparent'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container nav-content">
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <img src="/logo.png" alt="Aoun Logo" className="logo-img" />
          <div className="nav-logo-text">
            <span className="logo-main">{isRTL ? 'عون' : 'Aoun'}</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links">
          <div className="nav-dropdown-group">
            <span className="nav-link">
              <BookOpen size={18} /> {t('common.education')}
            </span>
            <div className={`nav-dropdown-content animate-fade-in glass-card ${isRTL ? 'dropdown-rtl' : ''}`}>
              <Link to="/about-alzheimer" className="dropdown-item">{t('common.aboutAlzheimer')}</Link>
              <Link to="/mental-exercises" className="dropdown-item">{t('common.mentalExercises')}</Link>
              <Link to="/first-aid" className="dropdown-item">{t('common.emergencyFirstAid')}</Link>
              <Link to="/myths-facts" className="dropdown-item">{t('common.mythsFacts')}</Link>
              <Link to="/special-warnings" className="dropdown-item">{t('common.specialWarnings')}</Link>
              <Link to="/profile" className="dropdown-item dropdown-item-accent">
                <CalendarClock size={16} style={{ display: 'inline', verticalAlign: 'middle', marginInlineEnd: 6 }} />
                {t('common.drugSchedule')}
              </Link>
            </div>
          </div>
          <Link to="/checker" className={`nav-link ${isActive('/checker') ? 'active' : ''}`}>
            <Pill size={18} /> {t('common.interactionChecker')}
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            {t('common.aboutTeam')}
          </Link>

          <div className="nav-divider"></div>

          <button onClick={toggleLanguage} className="lang-toggle-btn">
            <Languages size={18} />
            <span className="lang-code">{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
          </button>

          <div className="nav-divider"></div>

          {currentUser ? (
            <div className="user-menu">
              <NotificationBell />
              <Link to="/profile" className={`nav-link profile-link ${isActive('/profile') ? 'active' : ''}`}>
                <User size={18} /> {t('common.myDashboard')}
              </Link>
              <button onClick={logout} className="btn-icon" title={t('common.logout')}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-premium-glow btn-sm animated-cta">
              {t('common.signIn')}
            </button>
          )}
        </div>

        <div className="mobile-top-actions">
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </div>

        {/* Dynamic Wave Background for Navbar */}
        <div className="navbar-wave-bg">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              className="mobile-menu-overlay"
              initial={{ x: isRTL ? '-110%' : '110%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-110%' : '110%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 150 }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
            <div className="mobile-menu-header">
              <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
                <img src="/logo.png" alt="Aoun Logo" className="logo-img" />
                <span className="logo-main">{isRTL ? 'عون' : 'Aoun'}</span>
              </Link>
              <button className="mobile-close" onClick={() => setIsOpen(false)}>
                <X size={32} />
              </button>
            </div>

            <div className="mobile-links-container">
              <div className="mobile-nav-group">
                <span className="group-label">{t('common.education')}</span>
                <Link to="/about-alzheimer" onClick={() => setIsOpen(false)}>{t('common.aboutAlzheimer')}</Link>
                <Link to="/mental-exercises" onClick={() => setIsOpen(false)}>{t('common.mentalExercises')}</Link>
                <Link to="/first-aid" onClick={() => setIsOpen(false)}>{t('common.emergencyFirstAid')}</Link>
                <Link to="/myths-facts" onClick={() => setIsOpen(false)}>{t('common.mythsFacts')}</Link>
                <Link to="/special-warnings" onClick={() => setIsOpen(false)}>{t('common.specialWarnings')}</Link>
              </div>
              
              <div className="mobile-nav-group">
                <span className="group-label">Tools</span>
                <Link to="/checker" onClick={() => setIsOpen(false)}>{t('common.interactionChecker')}</Link>
                <Link to="/profile" onClick={() => setIsOpen(false)}>{t('common.drugSchedule')}</Link>
                <Link to="/about" onClick={() => setIsOpen(false)}>{t('common.aboutTeam')}</Link>
              </div>

              <div className="mobile-nav-footer">
                <button onClick={toggleLanguage} className="mobile-lang-pill">
                  <Languages size={20} /> {i18n.language === 'ar' ? 'English' : 'العربية'}
                </button>

                {currentUser ? (
                  <div className="mobile-user-actions">
                    <Link to="/profile" className="mobile-dashboard-btn" onClick={() => setIsOpen(false)}>
                      <User size={20} /> {t('common.myDashboard')}
                    </Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="mobile-logout-link">
                      <LogOut size={20} /> {t('common.logout')}
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-premium btn-block" onClick={() => { onOpenAuth(); setIsOpen(false); }}>
                    {t('common.signIn')}
                  </button>
                )}
              </div>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          height: 60px;
          display: flex;
          align-items: center;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100vw !important;
          max-width: 100vw !important;
        }

        .navbar-transparent {
          background: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .navbar-transparent {
          background: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: none;
        }
        
        .navbar-scrolled {
          background-color: #f0f7ff !important;
          backdrop-filter: blur(15px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
          border-bottom: none !important;
        }

        .navbar-scrolled::after {
          content: "";
          position: absolute;
          bottom: -39px; /* Wave depth */
          left: 0;
          width: 100%;
          height: 40px;
          background-color: transparent;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath fill='%23f0f7ff' d='M0,50 C200,100 400,0 600,50 C800,100 1000,0 1200,50 V0 H0 Z' /%3E%3C/svg%3E");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }


        .navbar-wave-bg {
          position: absolute;
          bottom: -39px;
          left: 0;
          width: 100%;
          height: 40px;
          z-index: 10; /* Above section content */
          pointer-events: none;
          transition: transform 0.4s ease, opacity 0.4s ease;
          opacity: 0;
          transform: translateY(-10px);
        }
        .navbar-scrolled .navbar-wave-bg {
          opacity: ${isOpen ? '0' : '1'};
          transform: translateY(0);
        }
        .navbar-wave-bg svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .navbar-wave-bg .shape-fill {
          fill: #f0f7ff;
          transition: fill 0.4s ease;
        }

        .animated-cta {
          background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent)) !important;
          background-size: 200% 200% !important;
          animation: gradient-move 3s ease infinite !important;
          border: none !important;
          color: #1e3a5f !important; /* Darker text for readability on light gradient */
          font-weight: 800;
          box-shadow: 0 4px 15px rgba(162, 210, 255, 0.4);
        }

        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .nav-link {
          color: #0f172a !important;
          font-weight: 700;
        }
        .navbar-transparent .nav-link {
          color: #0f172a !important;
        }
        .nav-link:hover {
          color: var(--primary) !important;
        }

        .navbar-scrolled::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 0;
          width: 100%;
          height: 15px;
          background: ${isOpen ? 'none' : "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 1200 120\" preserveAspectRatio=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z\" fill=\"%23ffffff\" opacity=\"0.9\"/></svg>') center/cover no-repeat"};
          pointer-events: none;
          z-index: -1;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .nav-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .logo-main {
          font-size: 2.2rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'Plus Jakarta Sans', 'Tajawal', 'Cairo', system-ui, sans-serif;
          transition: all 0.4s ease;
        }
        .navbar-transparent .logo-main {
          filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
        }
        [dir="rtl"] .logo-main { font-size: 2.4rem; letter-spacing: 0.02em; }

        .logo-sub {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .white-text { color: white !important; }
        .logo-img { height: 40px; width: auto; border-radius: 8px; }
        
        .nav-links { display: flex; align-items: center; gap: 2rem; }
        .nav-link {
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }
        .white-link { color: rgba(255, 255, 255, 0.8) !important; }
        .white-link:hover { color: white !important; }

        .nav-link:hover, .nav-link.active { color: var(--primary); }
        
        .nav-divider { width: 1px; height: 24px; background: var(--border); }
        .navbar-transparent .nav-divider { background: rgba(255, 255, 255, 0.2); }
        
        .lang-toggle-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-weight: 700;
          color: var(--text-muted);
          padding: 6px 12px;
          border-radius: 20px;
          transition: all 0.2s;
        }
        .lang-toggle-btn:hover { background: rgba(126, 34, 206, 0.05); color: var(--primary); }
        .lang-code { font-size: 0.8rem; }

        .user-menu { display: flex; align-items: center; gap: 1rem; }
        .btn-icon {
          background: none; border: none; color: var(--text-muted); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
        }
        .btn-icon:hover { color: var(--error); }
        
        .nav-dropdown-group { position: relative; display: flex; align-items: center; }
        .nav-dropdown-group:hover .nav-dropdown-content { display: flex; opacity: 1; pointer-events: auto; }
        .nav-dropdown-content { 
          display: none; flex-direction: column; position: absolute; top: 100%; left: 0; 
          background: white; padding: 0.5rem; border-radius: 12px; min-width: 200px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid var(--border);
          opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 1000;
        }
        .dropdown-rtl { left: auto !important; right: 0 !important; }
        
        .dropdown-item { padding: 10px 16px; color: var(--text-main); text-decoration: none; font-weight: 600; border-radius: 8px; transition: background 0.2s; }
        .dropdown-item:hover { background: rgba(126, 34, 206, 0.05); color: var(--primary); }
        .dropdown-item-accent { border-top: 1px solid var(--border); margin-top: 4px; padding-top: 12px !important; font-weight: 800; }
        
        .mobile-education-links { display: flex; flex-direction: column; gap: 1rem; border-left: 2px solid var(--border); padding-left: 1rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .mobile-menu[dir="rtl"] .mobile-education-links { border-left: none; border-right: 2px solid var(--border); padding-left: 0; padding-right: 1rem; }
        .mobile-education-links strong { color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .mobile-toggle { display: none; background: none; border: none; cursor: pointer; color: var(--text-main); }
        
        .mobile-lang-btn {
          display: flex; align-items: center; gap: 10px; background: rgba(126, 34, 206, 0.05);
          border: 1px solid rgba(126, 34, 206, 0.1); padding: 12px; border-radius: 12px;
          cursor: pointer; font-weight: 600; color: var(--primary);
        }
        
        .mobile-logout-btn { background: none; border: none; padding: 0; font: inherit; color: var(--error) !important; cursor: pointer; text-align: left; }
        .mobile-menu[dir="rtl"] .mobile-logout-btn { text-align: right; }

        .btn-sm { padding: 10px 24px; font-size: 0.9rem; }
        .btn-white { background: white; color: var(--primary); }
        .btn-white:hover { background: #f8f9fa; transform: translateY(-2px); }

        .mobile-top-actions { display: none; align-items: center; gap: 0.5rem; }
        .mobile-bell { display: flex; align-items: center; }
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .mobile-top-actions { display: flex; }
          .mobile-toggle { display: block; }
          .navbar-transparent .mobile-toggle { color: white; }
          
          .mobile-menu-overlay {
            position: fixed;
            top: 0;
            right: 0;
            width: 300px;
            height: auto;
            max-height: 80vh; /* Increased slightly to help fit content */
            background: #ffffff;
            z-index: 2000;
            display: flex;
            flex-direction: column;
            padding: 1.25rem;
            box-shadow: -10px 0 40px rgba(0,0,0,0.1);
            border-bottom-left-radius: 30px;
            border-left: 1px solid rgba(0,0,0,0.05);
            overflow-y: auto; /* Changed to auto to ensure footer is reachable */
            scrollbar-width: none; /* Hide scrollbar for clean look */
          }
          .mobile-menu-overlay::-webkit-scrollbar { display: none; }
          
          [dir="rtl"] .mobile-menu-overlay { right: auto; left: 0; border-left: none; border-right: 1px solid rgba(0,0,0,0.05); border-bottom-left-radius: 0; border-bottom-right-radius: 30px; }

          .mobile-menu-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(10, 37, 64, 0.15);
            backdrop-filter: blur(4px);
            z-index: 1999;
          }

          .mobile-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1.5px solid #f1f5f9;
          }
          .mobile-menu-header .nav-logo .logo-main { font-size: 1.3rem; }

          .mobile-close {
            background: #f8fafc;
            border: none;
            color: #64748b;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-links-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            flex: 1;
          }

          .mobile-nav-group {
            display: flex;
            flex-direction: column;
            gap: 0.1rem;
          }

          .group-label {
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
            font-weight: 800;
            margin-bottom: 0.25rem;
            padding-inline-start: 4px;
          }

          .mobile-nav-group a {
            font-size: 0.9rem;
            font-weight: 700;
            color: #1e293b;
            text-decoration: none;
            padding: 7px 10px;
            border-radius: 10px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .mobile-nav-group a:hover { background: #f1f7ff; color: #3b82f6; }

          .mobile-nav-footer {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1.5px solid #f1f5f9;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .mobile-lang-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 8px;
            border-radius: 12px;
            font-weight: 700;
            color: #1e293b;
            font-size: 0.85rem;
            width: 100%;
            justify-content: center;
            cursor: pointer;
          }

          .mobile-logout-link {
            background: #fff5f5;
            border: 1px solid #fee2e2;
            color: #ef4444;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 0.85rem;
            padding: 8px;
            cursor: pointer;
            border-radius: 12px;
            width: 100%;
          }
          
          .mobile-user-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .mobile-dashboard-btn {
            background: #1e3a5f;
            color: white !important;
            padding: 10px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-weight: 800;
            font-size: 0.9rem;
          }

          @media (max-height: 650px) {
            .mobile-links-container { gap: 0.5rem; }
            .mobile-nav-group a { padding: 5px 8px; font-size: 0.85rem; }
            .mobile-nav-footer { margin-top: 0.5rem; padding-top: 0.5rem; }
          }


      `}</style>
    </>
  );
};

export default Navbar;
