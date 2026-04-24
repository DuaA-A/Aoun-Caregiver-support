import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { alzheimerData } from '../../data/alzheimerData';
import '../../styles/about.css';

const AboutAlzheimer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const data = alzheimerData[i18n.language] || alzheimerData['en'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-alzheimer-page container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="about-header-wrapper animate-fade-in">
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <span className="about-subtitle">{t('aboutAlzheimer.subtitle')}</span>
            <h1 className="about-title">{t('aboutAlzheimer.title')}</h1>
            <p className="about-desc">{t('aboutAlzheimer.desc')}</p>
        </div>
      </div>

      <div className="alzheimer-nav-cards">
        {data.map((sectionData) => (
          <div 
            key={sectionData.id} 
            className="alz-nav-card glass-card"
            onClick={() => {
              const element = document.getElementById(`section-${sectionData.id}`);
              if (element) {
                const yOffset = -100;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
              }
            }}
          >
            <h3>{sectionData.title}</h3>
            <p>{sectionData.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="alzheimer-vertical-sections">
        {data.map((sectionData, index) => {
          const isOdd = index % 2 !== 0;
          return (
            <section 
              id={`section-${sectionData.id}`}
              key={sectionData.id} 
              className="vertical-section"
            >
              <div className="vertical-section-container">
                <div className={`vertical-section-body ${isOdd ? 'reverse-layout' : ''}`}>
                  <div className="vertical-section-content">
                    <div className="side-title-wrapper">
                      <h2>{sectionData.title}</h2>
                      <p className="section-subtitle">{sectionData.subtitle}</p>
                    </div>

                    <p className="section-summary-lead">{sectionData.summary}</p>
                    
                    {sectionData.content.map((paragraph, idx) => (
                      <div key={idx} className="content-block">
                        <h3>{paragraph.heading}</h3>
                        <p>{paragraph.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="vertical-section-visuals">
                    {sectionData.coverImage && (
                      <div className="supp-image-card glass-card main-visual">
                        <img src={sectionData.coverImage} alt={sectionData.title} className="main-visual-img" />
                      </div>
                    )}
                    
                    {sectionData.images && sectionData.images.filter(img => img.src !== sectionData.coverImage).length > 0 && (
                      <div className="supplementary-images">
                        {sectionData.images.filter(img => img.src !== sectionData.coverImage).map((img, idx) => (
                          <div key={idx} className="supp-image-card glass-card">
                            <img src={img.src} alt={img.caption} />
                            <p className="supp-caption">{img.caption}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default AboutAlzheimer;
