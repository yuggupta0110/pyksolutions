import React, { useState } from 'react';

const SKILL_CATEGORIES = {
  sap: {
    label: 'SAP Integration',
    skills: [
      { name: 'SAP CPI / Integration Suite', level: 'Expert' },
      { name: 'SAP BTP', level: 'Expert' },
      { name: 'SAP S/4HANA', level: 'Senior' },
      { name: 'SuccessFactors', level: 'Senior' },
      { name: 'SAP Commerce Cloud', level: 'Senior' },
      { name: 'SAP Marketing Cloud', level: 'Senior' },
      { name: 'SAP API Management', level: 'Senior' },
      { name: 'SAP Cloud Connector', level: 'Expert' }
    ]
  },
  azure: {
    label: 'Azure & DevOps',
    skills: [
      { name: 'Azure Web Apps', level: 'Senior' },
      { name: 'Azure SQL', level: 'Senior' },
      { name: 'App Registrations / OAuth2', level: 'Expert' },
      { name: 'GitHub Actions CI/CD', level: 'Senior' },
      { name: 'Azure Storage (Blobs/Queues)', level: 'Senior' }
    ]
  },
  ai: {
    label: 'AI & Automation',
    skills: [
      { name: 'Copilot Studio', level: 'Senior' },
      { name: 'AI Agent Workflows', level: 'Senior' },
      { name: 'Model Context Protocol (MCP)', level: 'Senior' },
      { name: 'Power Automate Integrations', level: 'Senior' }
    ]
  }
};

const INTEGRATION_PROJECTS = [
  // Core ERP & BTP
  {
    category: 'core',
    title: 'Sinch ↔ SAP S/4HANA SMS Core',
    desc: 'Designed and built secure SMS notification routing pipelines utilizing SAP CPI to trigger SMS alerts directly from S/4HANA operations.',
    systems: ['SAP CPI', 'SAP S/4HANA', 'Sinch API', 'OAuth2']
  },
  {
    category: 'core',
    title: 'SAP Cloud for Customer ↔ SAP S/4HANA',
    desc: 'Delivered end-to-end integration mapping sales/service contracts and activating communication setups.',
    systems: ['SAP C4C', 'SAP S/4HANA', 'Communication Arrangements']
  },
  {
    category: 'core',
    title: 'SAP C4C ↔ SAP ECC Data Synchronization',
    desc: 'Mapped and synchronized sales operations, service transactions, and customer profile details.',
    systems: ['SAP C4C', 'SAP ECC', 'SAP CPI', 'IDoc']
  },
  {
    category: 'core',
    title: 'Certificate-to-User Mapping on SAP BTP',
    desc: 'Developed and configured client-certificate authentication mapper on SAP BTP platform between sender/receiver systems.',
    systems: ['SAP BTP', 'Certificates', 'Secure Auth']
  },
  {
    category: 'core',
    title: 'S/4HANA SOA Manager Setup',
    desc: 'Configured SOA Manager services in S/4HANA and activated inbound/outbound communication setups for SAP C4C.',
    systems: ['S/4HANA', 'SOA Manager', 'SOAP Services']
  },



  // HR & Finance
  {
    category: 'hr',
    title: 'SuccessFactors EC ↔ Third-Party HR',
    desc: 'Delivered SuccessFactors Employee Central synchronization pipelines targeting multiple third-party HR systems.',
    systems: ['SuccessFactors', 'Employee Central', 'SAP CPI', 'HR APIs']
  },
  {
    category: 'hr',
    title: 'BambooHR & Expensify ↔ S/4HANA',
    desc: 'Built custom integration interfaces linking BambooHR and Expensify expense reports to SAP S/4HANA on-premise ERP.',
    systems: ['BambooHR', 'Expensify', 'SAP S/4HANA', 'API Mapping']
  },
  {
    category: 'hr',
    title: 'Nintex ↔ SuccessFactors Orchestration',
    desc: 'Implemented custom workflow routing linking Nintex automation forms with SuccessFactors HR platforms.',
    systems: ['Nintex', 'SuccessFactors', 'Process Automation']
  },
  {
    category: 'hr',
    title: 'MOC ↔ S/4HANA Operational Sync',
    desc: 'Built custom interfaces connecting Management of Change (MOC) platforms with SAP S/4HANA backend.',
    systems: ['MOC System', 'SAP S/4HANA', 'SAP CPI']
  },
  {
    category: 'hr',
    title: 'SQL Server ↔ S/4HANA JDBC Link',
    desc: 'Configured and mapped JDBC transaction pipes connecting Microsoft SQL Server with S/4HANA using SAP CPI.',
    systems: ['Microsoft SQL Server', 'SAP CPI', 'JDBC', 'SAP S/4HANA']
  },

  // Marketing & Commerce
  {
    category: 'marketing',
    title: 'Google Campaign ↔ SAP Marketing Cloud',
    desc: 'Created custom tracking sync pipelines mapping Google Campaign conversions and interactions directly to SAP Marketing Cloud.',
    systems: ['Google Campaign', 'SAP CPI', 'SAP Marketing Cloud']
  },
  {
    category: 'marketing',
    title: 'SAP Subscription Billing ↔ S/4HANA',
    desc: 'Deployed standard subscription billing triggers, replicating invoices and customer billing files to S/4HANA Sales Billing modules.',
    systems: ['Subscription Billing', 'S/4HANA', 'Sales Billing']
  },
  {
    category: 'marketing',
    title: 'SAP Commerce Cloud ↔ PowerClerk',
    desc: 'Connected customer storefront interactions in SAP Commerce Cloud with PowerClerk billing and processing services.',
    systems: ['Commerce Cloud', 'PowerClerk', 'SAP CPI']
  },
  {
    category: 'marketing',
    title: 'Commerce Cloud ↔ C4C Replication',
    desc: 'Built custom B2C Customer replication pipelines syncing storefront accounts from SAP Commerce to Cloud for Customer.',
    systems: ['SAP Commerce', 'SAP C4C', 'Customer Replication']
  },
  {
    category: 'marketing',
    title: 'SAP C4C Lead & Opportunity Email Flows',
    desc: 'Designed custom transactional email routers mapping inbound/outbound leads to C4C Sales Opportunities.',
    systems: ['SAP C4C', 'Email Router', 'Lead Management']
  },

  // AI & Modern
  {
    category: 'ai',
    title: 'Microsoft Copilot Studio AI Agents',
    desc: 'Built AI-powered Copilot agents for business process automation, designing custom conversation topics and backend Power Automate flows.',
    systems: ['Copilot Studio', 'Power Automate', 'REST APIs', 'Adaptive Cards']
  },
  {
    category: 'ai',
    title: 'Model Context Protocol (MCP) Server Hub',
    desc: 'Designed and integrated MCP servers to expose corporate database endpoints and integration tools directly to large language model agents.',
    systems: ['MCP Server', 'Node.js', 'AI Workflows', 'REST APIs']
  }
];

const PROJECT_CATEGORIES = {
  all: 'All Solutions',
  core: 'ERP & BTP',
  hr: 'HR & Finance',
  marketing: 'Marketing & Commerce',
  ai: 'AI & Modern'
};

export default function BentoGrid() {
  const [activeCategory, setActiveCategory] = useState('sap');
  const [activeProjectTab, setActiveProjectTab] = useState('all');
  const [hoveredProject, setHoveredProject] = useState(null);

  return (
    <div className="bento-grid" id="about">
      {/* 1. Profile / Professional Summary Card (col-7) */}
      <div className="col-7 double-bezel-wrapper scroll-reveal">
        <div className="double-bezel-inner" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}>
                👨‍💻
              </div>
              <div>
                <h3 className="card-title" style={{ marginBottom: '4px' }}>Professional Summary</h3>
                <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>Senior Integration Architect</p>
              </div>
            </div>
            <p className="card-desc" style={{ fontSize: '15px', marginBottom: '20px' }}>
              Results-driven SAP & Cloud Integration Consultant with <strong>8+ years of experience</strong> across enterprise integration, cloud application development, and AI-powered automation. 
            </p>
            <p className="card-desc" style={{ fontSize: '15px' }}>
              Specializes in building secure, scalable pipelines linking SAP BTP, SuccessFactors, S/4HANA, Microsoft Azure, and custom AI Agents. Expert in mapping scripts (Groovy/XSLT), OAuth2/OIDC security, and Model Context Protocol (MCP) server architectures.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>8+</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Years Experience</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--secondary)', fontFamily: 'var(--font-heading)' }}>30+</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise Integrations</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>3x</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cloud Certified</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Certifications Card (col-5) */}
      <div className="col-5 double-bezel-wrapper scroll-reveal">
        <div className="double-bezel-inner">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
            Credentials &amp; Certs
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Cert 1 */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontSize: '20px' }}>🎗️</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>SAP Integration Associate</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>SAP Certified Integration Suite Specialist</div>
              </div>
            </div>



            {/* Cert 3 */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontSize: '20px' }}>☁️</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>AWS Cloud Practitioner</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Amazon Web Services Infrastructure</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Skill Matrix Card (col-12) */}
      <div className="col-12 double-bezel-wrapper scroll-reveal" id="skills">
        <div className="double-bezel-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
              Core Skill Matrix
            </h3>
            
            {/* Tabs */}
            <div className="skill-category-tabs">
              {Object.keys(SKILL_CATEGORIES).map((key) => (
                <button
                  key={key}
                  className={`skill-tab ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  {SKILL_CATEGORIES[key].label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Skills Grid */}
          <div className="skill-grid">
            {SKILL_CATEGORIES[activeCategory].skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-name" style={{ marginBottom: '4px' }}>{skill.name}</div>
                <div style={{ fontSize: '9px', color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
                  {skill.level}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* 5. Key Integrations & Case Studies (col-12) */}
      <div className="col-12 double-bezel-wrapper scroll-reveal" id="projects">
        <div className="double-bezel-inner" style={{ padding: '36px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px', textAlign: 'left' }}>
            <div>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Complete Integration Portfolio
              </h3>
              <p className="card-desc" style={{ fontSize: '14px' }}>
                Browse all integration solutions delivered by PYK Solutions, filtered by system architecture.
              </p>
            </div>
            
            {/* Project Category Tabs */}
            <div className="skill-category-tabs">
              {Object.keys(PROJECT_CATEGORIES).map((key) => (
                <button
                  key={key}
                  className={`skill-tab ${activeProjectTab === key ? 'active' : ''}`}
                  onClick={() => setActiveProjectTab(key)}
                >
                  {PROJECT_CATEGORIES[key]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' }}>
            {(activeProjectTab === 'all' 
              ? INTEGRATION_PROJECTS 
              : INTEGRATION_PROJECTS.filter(p => p.category === activeProjectTab)
            ).map((proj, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#ffffff',
                  border: hoveredProject === idx ? '1px solid rgba(0, 100, 210, 0.3)' : '1px solid var(--border-light)',
                  borderRadius: '16px',
                  padding: '20px',
                  transition: 'all 300ms var(--ease-out)',
                  boxShadow: hoveredProject === idx ? '0 4px 20px rgba(0, 100, 210, 0.06)' : 'none',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={() => setHoveredProject(idx)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: hoveredProject === idx ? 'var(--primary)' : 'var(--text-primary)', transition: 'color 300ms', lineHeight: '1.4' }}>
                      {proj.title}
                    </h4>
                    <span style={{ fontSize: '14px', flexShrink: 0 }}>🔗</span>
                  </div>
                  <p className="card-desc" style={{ fontSize: '12px', marginBottom: '16px', minHeight: '64px', lineHeight: '1.5' }}>
                    {proj.desc}
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
                  {proj.systems.map((sys, sIdx) => (
                    <span 
                      key={sIdx}
                      style={{
                        fontSize: '9px',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        background: sys === 'SAP CPI' || sys === 'SAP BTP' ? 'rgba(0, 100, 210, 0.08)' : '#f1f5f9',
                        border: sys === 'SAP CPI' || sys === 'SAP BTP' ? '1px solid rgba(0, 100, 210, 0.18)' : '1px solid var(--border-light)',
                        color: sys === 'SAP CPI' || sys === 'SAP BTP' ? 'var(--primary)' : 'var(--text-secondary)'
                      }}
                    >
                      {sys}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
