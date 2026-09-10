import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// NAV CARDS

const navCards = [
  {
    label: 'Documentation Portfolio',
    description: 'Knowledge base articles, end-user guides, and release notes from an enterprise fintech platform.',
    href: '/docs/portfolio/portfolio-overview',
    icon: <img src={require('/static/img/homepage/home-1-icon.png').default} alt="" width="45" height="45" />,
  },
  {
    label: 'API Documentation',
    description: 'OpenAPI specification, reference documentation, endpoint guides, and integration examples.',
    href: '/api',
    icon: <img src={require('/static/img/homepage/home-2-icon.png').default} alt="" width="45" height="45" />,
  },
  {
    label: 'Blog',
    description: 'Articles on technical writing practice, documentation tooling, and AI-assisted workflows.',
    href: '/blog',
    icon: <img src={require('/static/img/homepage/home-3-icon.png').default} alt="" width="45" height="45" />,
  },
  {
    label: 'My Expertise',
    description: 'Skills, tools, domain knowledge, and the methods behind my documentation practice.',
    href: '/expertise',
    icon: <img src={require('/static/img/homepage/home-4-icon.png').default} alt="" width="45" height="45" />,
  },
];

// ANIMATED TAGLINE

const tags = [
  'Technical Writing',
  'Documentation Strategy',
  'Knowledge Management',
  'API Documentation',
  'Team Leadership',
  'Product Management',
  'Fintech & Enterprise SaaS',
  'AI Workflow Optimization',
  'Information Architecture',
  'Developer Documentation',
];

function AnimatedTagline() {
  const [index, setIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  useEffect(() => {
    // Readers who ask for reduced motion get the first tag, held still.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % tags.length);
        setVisible(true);
      }, 400);
    }, 2300);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={styles.taglineWord}
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}
    >
      {tags[index]}
    </span>
  );
}

// PARTICLE NETWORK CANVAS - HEADER

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
}

function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // The animation is decorative: skip it entirely for reduced-motion readers.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const PARTICLE_COUNT = 60;
    const CONNECTION_DISTANCE = 200;
    const NODE_COLOR = '131, 131, 131';

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function initParticles() {
      if (!canvas) return;
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1 + Math.random() * 2.5,
      }));
    }

    function draw() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const depthFactor = (a.z + b.z) / 2;
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.35 * (0.4 + depthFactor * 0.6);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${NODE_COLOR}, ${alpha})`;
            ctx.lineWidth = 0.5 + depthFactor * 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        const apparentRadius = p.radius * (0.4 + p.z * 0.9);
        const alpha = 0.2 + p.z * 0.65;

        if (p.z > 0.65) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, apparentRadius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${NODE_COLOR}, ${alpha * 0.12})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, apparentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NODE_COLOR}, ${alpha})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      initParticles();
    });
    resizeObserver.observe(canvas);

    // The banner scrolls away quickly. Pausing the loop once it leaves the
    // viewport keeps a background tab from burning a core on invisible pixels.
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!animRef.current) draw();
        } else {
          cancelAnimationFrame(animRef.current);
          animRef.current = 0;
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.bannerBg}
      aria-hidden="true"
    />
  );
}

// MAIN PAGE

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Home" description={siteConfig.tagline}>

      <header className={styles.banner}>
        <NetworkCanvas />
        <div className={styles.bannerInner}>
          <p className={styles.bannerEyebrow}>Senior Technical Writer | Product Documentation Lead</p>
          <h1 className={styles.bannerTitle}>Dmitrii Zhukov</h1>
          <p className={styles.bannerTagline}>
            <AnimatedTagline />
          </p>
          <a
            className={styles.cvButton}
            href={require('/static/cv/CV Dmitrii Zhukov - Senior Technical Writer.pdf').default}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" style={{marginRight: '8px'}}>
              <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Download CV
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>

          <section className={styles.about}>
            <div className={styles.aboutBlock}>
              <span className={styles.sectionLabel}>About</span>
              <h2 className={styles.aboutHeading}>Professional Summary</h2>
                <p className={styles.aboutText}>

                <b>Senior Technical Writer</b> and <b>Product Documentation Lead</b> with 10 years of
                experience in fintech, asset management, and B2B SaaS.
                I turn complex enterprise systems into clear, user-focused documentation, and I own
                the full lifecycle: information architecture, content strategy, and delivery at the
                scale the product needs.
              </p>
              <p className={styles.aboutText}>
                My focus is <b>building knowledge products from the ground up</b>: public
                documentation portals, internal knowledge bases, API references, developer guides,
                release notes, and training materials.
              </p>
              <p className={styles.aboutText}>
                Beyond writing, I lead technical writing teams, set the standards and workflows
                they run on, and own documentation quality and delivery. I work closely with
                engineering, product, support, and QA to keep documentation aligned with the
                roadmap and with what customers actually need.
                My approach combines <b>docs-as-code practices, AI-assisted workflows, automation,
                and product management experience</b> to raise quality and keep documentation
                maintainable as the product grows.
              </p>
            </div>

            <div className={styles.aboutBlock}>
              <span className={styles.sectionLabel}>Connect with me</span>
              <h2 className={styles.aboutHeading}>Contacts & Links</h2>
              <div className={styles.contactRow}>
                <ul className={styles.contactList}>
                  <li>
                    <a href="https://www.linkedin.com/in/dmitrii-zhukov-71b94222b/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  </li>
                  <li>
                    <a href="https://github.com/thenameisdmitry/" target="_blank" rel="noopener noreferrer">GitHub</a>
                  </li>
                  <li>
                    Personal email: <a href="mailto:storiesbydz@gmail.com">storiesbydz@gmail.com</a>
                  </li>
                  <li>
                    Mobile: <a href="tel:+447442896202">+447442896202</a>
                  </li>
                  <li>
                    Telegram: <a href="https://t.me/moneywrapping" target="_blank" rel="noopener noreferrer">@moneywrapping</a>
                  </li>
                  <li>
                    Based in: Belgrade, Serbia (CET)
                  </li>
                  <li>
                    Available: remote, hybrid, or on-site. Open to relocation.
                  </li>
                </ul>

                <img
                  src={require('/static/img/Ava.png').default}
                  alt="Dmitrii Zhukov"
                  className={styles.avatar}
                />
              </div>
            </div>

          </section>

          <section className={styles.nav}>
            <span className={styles.sectionLabel}>Navigate</span>
            <div className={styles.navCards}>
              {navCards.map((card, i) => (
                <Link
                  key={card.label}
                  to={card.href}
                  className={styles.navCard}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className={styles.navCardIcon}>{card.icon}</div>
                  <div className={styles.navCardBody}>
                    <span className={styles.navCardLabel}>{card.label}</span>
                    <span className={styles.navCardDesc}>{card.description}</span>
                  </div>
                  <svg className={styles.navCardArrow} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              ))}
            </div>

            <div style={{ display: 'flex', width: '100%', marginTop: '24px' }}>
              <img
                src={require('/static/img/homepage/gtu.png').default}
                alt="GTU"
                className={styles.gtu}
              />
            </div>

          </section>

        </div>
      </main>

    </Layout>
  );
}