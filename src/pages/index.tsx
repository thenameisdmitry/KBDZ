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

// KNOWLEDGE GRAPH CANVAS - HEADER
//
// Nodes cluster the way a documentation set does: tightly linked inside a
// product module, sparsely bridged between modules. Every second or so a
// retrieval pulse walks a few hops along those links, which is the visual
// shorthand for what the AI & RAG section of this site is about.

interface GraphNode {
  bx: number;   // cluster-anchored base position
  by: number;
  x: number;
  y: number;
  phase: number;
  drift: number;
  radius: number;
  cluster: number;
}

interface GraphEdge {
  a: number;
  b: number;
  bridge: boolean;
}

interface Pulse {
  path: number[];
  seg: number;
  t: number;
  speed: number;
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

    const NODE_RGB = '131, 131, 131';
    const PULSE_RGB = '204, 68, 255';

    let nodes: GraphNode[] = [];
    let edges: GraphEdge[] = [];
    let neighbours: number[][] = [];
    let pulses: Pulse[] = [];
    let nextPulse = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function buildGraph() {
      if (!canvas) return;
      const {width, height} = canvas;
      nodes = [];
      edges = [];

      // Cluster count scales with width so the graph never looks crowded.
      const clusterCount = Math.max(4, Math.min(7, Math.round(width / 260)));
      const centres = Array.from({length: clusterCount}, (_, i) => ({
        x: width * ((i + 0.5) / clusterCount) + (Math.random() - 0.5) * width * 0.06,
        y: height * (0.3 + Math.random() * 0.4),
      }));

      centres.forEach((c, ci) => {
        const size = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < size; i += 1) {
          const angle = Math.random() * Math.PI * 2;
          const spread = (0.25 + Math.random() * 0.75) * Math.min(width / clusterCount, height) * 0.38;
          const bx = c.x + Math.cos(angle) * spread;
          const by = c.y + Math.sin(angle) * spread * 0.75;
          nodes.push({
            bx, by, x: bx, y: by,
            phase: Math.random() * Math.PI * 2,
            drift: 4 + Math.random() * 7,
            radius: 1.1 + Math.random() * 1.9,
            cluster: ci,
          });
        }
      });

      // Dense links inside a cluster: each node to its two nearest siblings.
      nodes.forEach((n, i) => {
        const siblings = nodes
          .map((m, j) => ({j, d: (m.bx - n.bx) ** 2 + (m.by - n.by) ** 2}))
          .filter((o) => o.j !== i && nodes[o.j].cluster === n.cluster)
          .sort((a, b) => a.d - b.d)
          .slice(0, 2);
        siblings.forEach((sib) => {
          if (!edges.some((e) => (e.a === i && e.b === sib.j) || (e.a === sib.j && e.b === i))) {
            edges.push({a: i, b: sib.j, bridge: false});
          }
        });
      });

      // Sparse bridges between neighbouring clusters.
      for (let c = 0; c < clusterCount - 1; c += 1) {
        const left = nodes.map((n, i) => ({n, i})).filter((o) => o.n.cluster === c);
        const right = nodes.map((n, i) => ({n, i})).filter((o) => o.n.cluster === c + 1);
        if (!left.length || !right.length) continue;
        const a = left[Math.floor(Math.random() * left.length)].i;
        const b = right[Math.floor(Math.random() * right.length)].i;
        edges.push({a, b, bridge: true});
      }

      neighbours = nodes.map(() => [] as number[]);
      edges.forEach((e) => {
        neighbours[e.a].push(e.b);
        neighbours[e.b].push(e.a);
      });
      pulses = [];
    }

    /** A pulse walks 3 to 5 hops, preferring links it has not just used. */
    function spawnPulse() {
      if (nodes.length === 0) return;
      const path = [Math.floor(Math.random() * nodes.length)];
      const hops = 3 + Math.floor(Math.random() * 3);
      for (let h = 0; h < hops; h += 1) {
        const options = neighbours[path[path.length - 1]].filter((n) => !path.includes(n));
        if (!options.length) break;
        path.push(options[Math.floor(Math.random() * options.length)]);
      }
      if (path.length > 1) {
        pulses.push({path, seg: 0, t: 0, speed: 0.018 + Math.random() * 0.012});
      }
    }

    function draw(time: number) {
      if (!canvas || !ctx) return;
      const {width, height} = canvas;
      ctx.clearRect(0, 0, width, height);

      if (!reduced) {
        nodes.forEach((n) => {
          n.x = n.bx + Math.sin(time / 2600 + n.phase) * n.drift;
          n.y = n.by + Math.cos(time / 3100 + n.phase) * n.drift * 0.7;
        });
      }

      // Links
      edges.forEach((e) => {
        const a = nodes[e.a];
        const b = nodes[e.b];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${NODE_RGB}, ${e.bridge ? 0.14 : 0.26})`;
        ctx.lineWidth = e.bridge ? 0.5 : 0.7;
        ctx.stroke();
      });

      // Retrieval pulses
      if (!reduced) {
        if (time > nextPulse) {
          spawnPulse();
          nextPulse = time + 900 + Math.random() * 1400;
        }

        pulses = pulses.filter((p) => {
          p.t += p.speed;
          if (p.t >= 1) {
            p.t = 0;
            p.seg += 1;
          }
          if (p.seg >= p.path.length - 1) return false;

          // Trail: segments already crossed fade behind the head.
          for (let i = 0; i <= p.seg; i += 1) {
            const from = nodes[p.path[i]];
            const to = nodes[p.path[i + 1]];
            if (!from || !to) continue;
            const age = p.seg - i;
            const alpha = Math.max(0, 0.5 - age * 0.16);
            if (alpha <= 0) continue;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = `rgba(${PULSE_RGB}, ${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }

          const from = nodes[p.path[p.seg]];
          const to = nodes[p.path[p.seg + 1]];
          if (from && to) {
            const hx = from.x + (to.x - from.x) * p.t;
            const hy = from.y + (to.y - from.y) * p.t;
            ctx.beginPath();
            ctx.arc(hx, hy, 7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${PULSE_RGB}, 0.10)`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(hx, hy, 2.1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${PULSE_RGB}, 0.85)`;
            ctx.fill();
          }
          return true;
        });
      }

      // Nodes, drawn last so pulses never cover them
      const lit = new Set<number>();
      pulses.forEach((p) => {
        lit.add(p.path[p.seg]);
        lit.add(p.path[p.seg + 1]);
      });

      nodes.forEach((n, i) => {
        const hot = lit.has(i);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * (hot ? 1.7 : 1), 0, Math.PI * 2);
        ctx.fillStyle = hot
          ? `rgba(${PULSE_RGB}, 0.9)`
          : `rgba(${NODE_RGB}, 0.62)`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    buildGraph();

    if (reduced) {
      // One static frame: the structure without the motion.
      draw(0);
      cancelAnimationFrame(animRef.current);
      animRef.current = 0;
    } else {
      animRef.current = requestAnimationFrame(draw);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      buildGraph();
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