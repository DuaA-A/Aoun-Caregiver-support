import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { TeamMemberCard } from './TeamMemberCard';
import '../../styles/about.css';

const About = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Get team members from translations
    // We cast to array if it's not already, though t returns the array from json
    const members = t('about.team', { returnObjects: true }) || [];
    const values = t('about.values', { returnObjects: true }) || [];

    return (
        <div className="about-page container" dir={isRTL ? 'rtl' : 'ltr'}>

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="about-header-wrapper animate-fade-in">
                <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    <span className="about-subtitle">{t('about.subtitle')}</span>
                    <h1 className="about-title">{t('about.title')}</h1>
                    <p className="about-desc">{t('about.desc')}</p>
                </div>
            </div>

            {/* ── MTI College Section ─────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '6rem' }}
            >
                <div style={{ position: 'relative', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                        style={{
                            position: 'absolute', borderRadius: '50%', width: '220px', height: '220px',
                            background: 'radial-gradient(circle, transparent 38%, rgba(93, 173, 226, 0.4) 46%, transparent 75%)',
                            animation: 'logo-aura 2.8s ease-in-out infinite',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute', borderRadius: '50%', width: '190px', height: '190px',
                            background: 'radial-gradient(circle, transparent 38%, rgba(169, 204, 227, 0.5) 47%, transparent 80%)',
                            animation: 'logo-aura 2.8s ease-in-out infinite 0.5s',
                        }}
                    />
                    <div
                        style={{
                            position: 'relative', zIndex: 10, width: '160px', height: '160px', borderRadius: '50%',
                            overflow: 'hidden', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 0 3px rgba(93, 173, 226, 0.6), 0 0 24px rgba(93, 173, 226, 0.2)',
                            animation: 'border-glow 2.8s ease-in-out infinite', padding: '20px'
                        }}
                    >
                        <img src="/team/mti_logo.jpeg" alt={t('about.mti')} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                    </div>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{t('about.mti')}</h3>
                <p style={{ maxWidth: '500px', color: 'var(--text-muted)' }}>{t('about.project')}</p>
            </motion.div>

            {/* ── Team Grid ──────────────────────────────────────────────── */}
            <div className="team-grid-about">
                {Array.isArray(members) && members.map((member, i) => (
                    <TeamMemberCard key={member.id} member={member} index={i} />
                ))}
            </div>

            {/* ── Mission Statement ───────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mission-box"
            >
                <div style={{ position: 'absolute', top: 0, [isRTL ? 'left' : 'right']: 0, width: '300px', height: '300px', background: 'rgba(93, 173, 226, 0.1)', filter: 'blur(100px)', borderRadius: '50%', transform: `translate(${isRTL ? '-30%' : '30%'}, -30%)` }} />

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <span className="mission-label">{t('about.missionLabel')}</span>
                    <h2 className="mission-title">{t('about.missionTitle')}</h2>
                    <div className="mission-divider" />
                    <p className="mission-text">
                        {t('about.missionText1')}
                    </p>
                    <p className="mission-text">
                        {t('about.missionText2')}
                    </p>
                </div>
            </motion.div>

            {/* ── Values ─────────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ marginBottom: '6rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)', fontWeight: 800 }}>{t('about.valuesSubtitle')}</span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{t('about.valuesTitle')}</h2>
                </div>

                <div className="values-grid">
                    {Array.isArray(values) && values.map((value, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="glass-card"
                            style={{ padding: '2.5rem 2rem', textAlign: 'center' }}
                        >
                            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(93, 173, 226, 0.15)', color: 'var(--primary)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                                ✦
                            </div>
                            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>{value.title}</h4>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{value.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>


        </div>
    );
};

export default About;
