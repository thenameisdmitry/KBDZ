import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// NAV CARDS

const navCards = [
  {
    label: 'Documentation Portfolio',
    description: 'Knowledge base guides and release notes from enterprise fintech, documentation tooling, and a working RAG retrieval demo.',
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
  'Documentation for AI (RAG)',
  'Content Design for Retrieval',
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

// DOCUMENT CANVAS - HEADER
//
// Columns of faint bars standing in for lines of documentation: headings,
// paragraphs, lists. Every few seconds one line lights up and fades, the way a
// retrieved passage does. The centre is erased so the banner never competes
// with the name sitting on top of it.

interface DocLine {
  x: number;
  y: number;
  w: number;
  h: number;
  alpha: number;
  body: boolean;    // only body lines are eligible for the highlight
  central: boolean; // sits under the title, where the canvas is erased
}

function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const INK = '131, 131, 131';
    const GLOW = '204, 68, 255';
    const LINE_H = 4;
    const LINE_GAP = 9;
    const BLOCK_GAP = 20;
    const HIGHLIGHT_MS = 1700;

    let lines: DocLine[] = [];
    let edgeIndexes: number[] = [];
    let centreIndexes: number[] = [];
    let litIndex = -1;
    let litStart = 0;
    let nextLit = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function buildPage() {
      if (!canvas) return;
      const {width, height} = canvas;
      lines = [];

      const gutter = 44;
      const colTarget = 240;
      const cols = Math.max(2, Math.round((width + gutter) / (colTarget + gutter)));
      const colW = (width - gutter * (cols - 1)) / cols;

      for (let c = 0; c < cols; c += 1) {
        const x0 = c * (colW + gutter);
        let y = 16 + Math.random() * 14;

        while (y < height - LINE_H) {
          const roll = Math.random();

          if (roll < 0.22) {
            // Heading: shorter, heavier, brighter than body text.
            lines.push({
              x: x0,
              y,
              w: colW * (0.38 + Math.random() * 0.3),
              h: LINE_H + 1.5,
              alpha: 0.27,
              body: false,
              central: false,
            });
            y += LINE_H + 1.5 + LINE_GAP + 5;
          } else if (roll < 0.42) {
            // List: indented, with a marker dot.
            const items = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < items && y < height - LINE_H; i += 1) {
              lines.push({x: x0, y, w: 3, h: 3, alpha: 0.2, body: false, central: false});
              lines.push({
                x: x0 + 12,
                y,
                w: colW * (0.45 + Math.random() * 0.4) - 12,
                h: LINE_H,
                alpha: 0.12,
                body: true,
                central: false,
              });
              y += LINE_H + LINE_GAP;
            }
            y += BLOCK_GAP - LINE_GAP;
          } else {
            // Paragraph: full-width lines, the last one short.
            const rows = 2 + Math.floor(Math.random() * 4);
            for (let i = 0; i < rows && y < height - LINE_H; i += 1) {
              const last = i === rows - 1;
              lines.push({
                x: x0,
                y,
                w: colW * (last ? 0.35 + Math.random() * 0.35 : 0.82 + Math.random() * 0.18),
                h: LINE_H,
                alpha: 0.12,
                body: true,
                central: false,
              });
              y += LINE_H + LINE_GAP;
            }
            y += BLOCK_GAP - LINE_GAP;
          }
        }
      }

      // Mark the lines that fall inside the erased area behind the title.
      const cx = width / 2;
      const cy = height / 2;
      const erased = Math.max(width, height) * 0.46 * 0.5;
      lines.forEach((l) => {
        l.central = Math.hypot(l.x + l.w / 2 - cx, l.y + l.h / 2 - cy) < erased;
      });

      edgeIndexes = lines.map((l, i) => (l.body && !l.central ? i : -1)).filter((i) => i >= 0);
      centreIndexes = lines.map((l, i) => (l.body && l.central ? i : -1)).filter((i) => i >= 0);
      litIndex = -1;
      nextLit = 0;
    }

    function draw(time: number) {
      if (!canvas || !ctx) return;
      const {width, height} = canvas;
      ctx.clearRect(0, 0, width, height);

      if (!reduced) {
        if (litIndex === -1 && time > nextLit && (edgeIndexes.length || centreIndexes.length)) {
          const centre = centreIndexes.length > 0 && Math.random() < 0.15;
          const pool = centre || !edgeIndexes.length ? centreIndexes : edgeIndexes;
          litIndex = pool[Math.floor(Math.random() * pool.length)];
          litStart = time;
        }
        if (litIndex !== -1 && time - litStart > HIGHLIGHT_MS) {
          litIndex = -1;
          nextLit = time + 1500 + Math.random() * 1500;
        }
      }

      // Ease the highlight in and out so nothing blinks.
      let litAlpha = 0;
      if (litIndex !== -1) {
        const t = (time - litStart) / HIGHLIGHT_MS;
        litAlpha = Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
      }

      lines.forEach((l, i) => {
        if (i === litIndex && litAlpha > 0) return;
        ctx.fillStyle = `rgba(${INK}, ${l.alpha})`;
        ctx.fillRect(l.x, l.y, l.w, l.h);
      });

      // Clear a soft area behind the title so the text stays the loudest thing.
      const g = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) * 0.46,
      );
      g.addColorStop(0, 'rgba(0,0,0,0.92)');
      g.addColorStop(0.55, 'rgba(0,0,0,0.77)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      // Drawn last so a highlight under the title is not erased with the rest.
      if (litIndex !== -1 && litAlpha > 0) {
        const l = lines[litIndex];
        const dim = l.central ? 0.55 : 1;
        ctx.fillStyle = `rgba(${GLOW}, ${0.07 * litAlpha * dim})`;
        ctx.fillRect(l.x - 5, l.y - 4, l.w + 10, l.h + 8);
        ctx.fillStyle = `rgba(${GLOW}, ${(0.18 + 0.5 * litAlpha) * dim})`;
        ctx.fillRect(l.x, l.y, l.w, l.h);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    buildPage();

    if (reduced) {
      draw(0);
      cancelAnimationFrame(animRef.current);
      animRef.current = 0;
    } else {
      animRef.current = requestAnimationFrame(draw);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      buildPage();
      if (reduced) draw(0);
    });
    resizeObserver.observe(canvas);

    // The banner scrolls away quickly; stop drawing once it is out of view.
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting) {
          if (!animRef.current) animRef.current = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(animRef.current);
          animRef.current = 0;
        }
      },
      {threshold: 0},
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
                the full lifecycle: information architecture, content strategy, and delivery.
              </p>
              <p className={styles.aboutText}>
                My focus is <b>building knowledge products from the ground up</b>: public
                documentation portals, internal knowledge bases, API references, developer guides,
                release notes, and training materials.
              </p>
              <p className={styles.aboutText}>
                Beyond writing, I lead technical writing teams, set the standards and workflows
                they run on, and own quality and delivery. I work closely with engineering,
                product, support, and QA, which is where most documentation problems are caught
                before they ever reach a page.
              </p>
              <p className={styles.aboutText}>
                I work in <b>docs-as-code</b>, automate what repeats, and use AI where it earns
                its place. Documentation also has a second reader now: the
                <b> retrieval system behind an AI support agent</b>. A fact that does not survive
                chunking is a fact the customer never gets, and that is a writing problem before
                it is an engineering one.
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