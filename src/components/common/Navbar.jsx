import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  User,
  LogOut,
  Activity,
  Pill,
  Menu,
  X,
  CreditCard,
  BookOpen,
  Languages,
  Info
} from 'lucide-react';

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
    <nav className={`navbar fixed-top ${scrolled || !isHome ? 'navbar-scrolled' : 'navbar-transparent'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container nav-content">
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <img src="/logo.png" alt="Sanad Logo" className="logo-img" />
          <div className="nav-logo-text">
            <span className={`logo-main ${!scrolled && isHome ? 'white-text' : ''}`}>Sanad</span>
            <span className={`logo-sub ${!scrolled && isHome ? 'white-text' : ''}`}>سند</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links">
          <div className="nav-dropdown-group">
            <span className={`nav-link ${!scrolled && isHome ? 'white-link' : ''}`}>
              <BookOpen size={18} /> {t('common.education')}
            </span>
            <div className={`nav-dropdown-content animate-fade-in glass-card ${isRTL ? 'dropdown-rtl' : ''}`}>
              <Link to="/about-alzheimer" className="dropdown-item">{t('common.aboutAlzheimer')}</Link>
              <Link to="/first-aid" className="dropdown-item">{t('common.emergencyFirstAid')}</Link>
              <Link to="/myths-facts" className="dropdown-item">{t('common.mythsFacts')}</Link>
              <Link to="/special-warnings" className="dropdown-item">{t('common.specialWarnings')}</Link>
            </div>
          </div>
          <Link to="/checker" className={`nav-link ${isActive('/checker') ? 'active' : ''} ${!scrolled && isHome ? 'white-link' : ''}`}>
            <Pill size={18} /> {t('common.interactionChecker')}
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''} ${!scrolled && isHome ? 'white-link' : ''}`}>
            {t('common.aboutTeam')}
          </Link>

          <div className="nav-divider"></div>

          <button onClick={toggleLanguage} className={`lang-toggle-btn ${!scrolled && isHome ? 'white-link' : ''}`}>
            <Languages size={18} />
            <span className="lang-code">{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
          </button>

          <div className="nav-divider"></div>

          {currentUser ? (
            <div className="user-menu">
              <Link to="/profile" className={`nav-link profile-link ${isActive('/profile') ? 'active' : ''} ${!scrolled && isHome ? 'white-link' : ''}`}>
                <User size={18} /> {t('common.myDashboard')}
              </Link>
              <button onClick={logout} className={`btn-icon ${!scrolled && isHome ? 'white-link' : ''}`} title={t('common.logout')}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className={`btn ${!scrolled && isHome ? 'btn-white' : 'btn-primary'} btn-sm`}>
              {t('common.signIn')}
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className={`mobile-toggle ${!scrolled && isHome ? 'white-link' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="mobile-education-links">
            <strong style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('common.education')}</strong>
            <Link to="/about-alzheimer" onClick={() => setIsOpen(false)}>{t('common.aboutAlzheimer')}</Link>
            <Link to="/first-aid" onClick={() => setIsOpen(false)}>{t('common.emergencyFirstAid')}</Link>
            <Link to="/myths-facts" onClick={() => setIsOpen(false)}>{t('common.mythsFacts')}</Link>
            <Link to="/special-warnings" onClick={() => setIsOpen(false)}>{t('common.specialWarnings')}</Link>
          </div>
          <Link to="/checker" onClick={() => setIsOpen(false)}>{t('common.interactionChecker')}</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>{t('common.aboutTeam')}</Link>
          
          <button onClick={toggleLanguage} className="mobile-lang-btn">
            <Languages size={20} /> {i18n.language === 'ar' ? 'Switch to English' : 'تغيير للغة العربية'}
          </button>

          {currentUser ? (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)}>{t('common.myDashboard')}</Link>
              <button onClick={() => { logout(); setIsOpen(false); }} className="mobile-logout-btn">{t('common.logout')}</button>
            </>
          ) : (
            <button className="btn btn-mobile-signin" onClick={() => { onOpenAuth(); setIsOpen(false); }}>{t('common.signIn')}</button>
          )}
        </div>
      )}

      <style>{`
        .navbar {
          height: 80px;
          width: 100%;
          display: flex;
          align-items: center;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          position: fixed;
          top: 0;
          left: 0;
        }

        .navbar-transparent {
          background: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .navbar-scrolled {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
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
          color: var(--text-main);
        }

        .nav-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .logo-main {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--primary);
        }

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

        .user-menu { display: flex; align-items: center; gap: 1.5rem; }
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

        @media (max-width: 900px) {
          .nav-links { display: none; }
          .mobile-toggle { display: block; }
          .navbar-transparent.mobile-toggle { color: white; }
          .mobile-menu {
            position: absolute; top: 80px; left: 0; right: 0; background: white;
            padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;
            border-bottom: 1px solid var(--border); box-shadow: var(--shadow);
          }
          .mobile-menu a { text-decoration: none; color: var(--text-main); font-weight: 600; }
          
          .btn-mobile-signin {
            background: var(--primary);
            color: white !important;
            border: none;
            border-radius: 30px;
            padding: 14px 28px;
            font-weight: 800;
            box-shadow: 0 8px 25px rgba(157, 141, 241, 0.4);
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
