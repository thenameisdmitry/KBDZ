import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './blog.module.css';

// ─── Post data ────────────────────────────────────────────────────────────────
// Update this array manually when you add a new post.
// href must match: /articles/YOUR_SLUG

const POSTS = [
  {
    slug: 'three-pillars-of-doc',
    href: '/articles/three-pillars-of-doc',
    image: '/img/blog/three-pillars-of-doc.png',
    title: 'Integrity, Actionability, and Beauty: The Three Pillars of Great Documentation',
    excerpt:
      'After a decade of building documentation frameworks and leading writers in fintech, I keep returning to the same three principles. They are what separates documentation people trust from documentation people tolerate.',
    tags: ['Technical Writing', 'Product Thinking'],
    date: 'June 5, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'ai-and-tech-writing',
    href: '/articles/ai-and-tech-writing',
    image: '/img/blog/ai-and-tech-writing.png',
    title: 'AI and Technical Writing: Why only competent writers can use AI effectively',
    excerpt:
      'Few technologies have changed the industry as fast as AI, and technical writers were among the first expected to adapt, experiment, and rebuild established workflows. This article looks at where AI adds real value to technical writing, and where human expertise is still the deciding factor.',
    tags: ['AI', 'Automation', 'Technical Writing'],
    date: 'June 4, 2026',
    readTime: '4 min read',
  },
  {
    slug: 'how-to-lead-tech-writers',
    href: '/articles/how-to-lead-tech-writers',
    image: '/img/blog/how-to-lead-tech-writers.png',
    title: 'Being an Effective Team Lead: Becoming a Force Multiplier',
    excerpt:
      'When I was promoted to Team Lead, I faced the question every first-time manager faces: how do you balance management with your own workload and still build a team that ships accurate documentation on time? This is the story of how I became a force multiplier instead of a bottleneck.',
    tags: ['Leadership', 'Knowledge Management'],
    date: 'June 3, 2026',
    readTime: '3 min read',
  },
];

// ─── Tag pill ─────────────────────────────────────────────────────────────────
function TagPill({ label }: { label: string }) {
  return (
    <span className={styles.tag}>{label}</span>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────
function PostCard({ post }: { post: typeof POSTS[0] }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardMeta}>

      {/* IMG IN THE CARD*/}  
      {post.image && (
        <Link to={post.href}>
          <img src={useBaseUrl(post.image)} alt="" className={styles.cardImage} />
        </Link>
      )}
        <div className={styles.cardTags}>
          {post.tags.map(t => <TagPill key={t} label={t} />)}
        </div>
        <span className={styles.cardDate}>{post.date} · {post.readTime}</span>
      </div>

      <Link to={post.href} className={styles.cardTitleLink}>
        <h2 className={styles.cardTitle}>{post.title}</h2>
      </Link>

      <p className={styles.cardExcerpt}>{post.excerpt}</p>

      <div className={styles.cardFooter}>
        <div className={styles.cardAuthor}>
          <img
            src="https://avatars.githubusercontent.com/u/101871433?v=4"
            alt="Dmitrii Zhukov"
            className={styles.cardAvatar}
          />
          <span className={styles.cardAuthorName}>Dmitrii Zhukov</span>
        </div>
        <Link to={post.href} className={styles.cardReadMore}>
          Read more <span className={styles.cardArrow}>→</span>
        </Link>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  return (
    <Layout
      title="Dmitrii Blog"
      description="Thoughts on technical writing, knowledge management, API documentation, and AI-powered workflows."
    >
      {/* ── Banner ── */}
      <header className={styles.banner}>
        <div className={styles.bannerGrid} aria-hidden="true" />
        <div className={styles.bannerInner}>
          <p className={styles.bannerEyebrow}>Blog</p>
          <h1 className={styles.bannerTitle}>Stories by DZ</h1>
          <p className={styles.bannerSubtitle}>
            Thoughts on technical writing, knowledge management, API documentation,
            developer experience, leadership, and AI-powered documentation workflows.
          </p>
        </div>
      </header>

      {/* ── Post list ── */}
      <main className={styles.main}>
        <div className={styles.list}>
          {POSTS.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
