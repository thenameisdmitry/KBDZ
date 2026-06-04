import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            href="/cv/CV Dmitrii Zhukov - Senior Technical Writer.pdf"
            target="_blank"
            rel="noopener noreferrer">
            Download Curriculum Vitae 📄
          </Link>
          {/*
          <Link
            className="button button--secondary button--lg"
            href="/cv/CV Dmitrii Zhukov - Senior Technical Writer.pdf"
            target="_blank"
            rel="noopener noreferrer">
            Portfolio 💼
          </Link>
           */}
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main className="container margin-vert--lg">

  <section style={{marginBottom: '3rem'}}>
    <h2>Overview</h2>

    <p>
      Senior Technical Writer and Documentation Product Manager with 8+ years of experience in fintech, asset management, banking systems, and B2B SaaS.
    </p>

  </section>

  <section style={{marginBottom: '3rem'}}>
    <h2>About this portfolio</h2>

    <p>
      This page contains selected writing samples from my most recent role at Hazeltree. These examples demonstrate my ability to translate complex fintech capabilities into clear, user-focused documentation and show the range of content I can deliver across a documentation program (concepts, procedures, reference, and release support).
    </p>

    <p>
      <strong>What you’ll find here:</strong> Each case includes a short readme describing the target audience, document intent, and other factors that shaped the final document (e.g., product maturity, compliance requirements, or implementation context).
    </p>

    <p>
      <strong>Confidentiality note:</strong> Due to Hazeltree’s strict confidentiality requirements, these samples include limited business and product context. Company- or client-specific details have been removed or generalized while preserving the structure, tone, and level of technical depth.
    </p>
  </section>

  <section>
    <h2>Useful links</h2>

    <ul>
      <li>
        LinkedIn page:{' '}
        <a href="https://linkedin.com/in/dmitrii-zhukov-71b94222b/" target="_blank">
          linkedin.com/in/dmitrii-zhukov-71b94222b
        </a>
      </li>

      <li>
        Personal email:{' '}
        <a href="mailto:storiesbydz@gmail.com">
          storiesbydz@gmail.com
        </a>
      </li>

      <li>
        Phone number: +447442896202
      </li>

      <li>
        Telegram: {' '}
        <a href="https://t.me/moneywrapping" target="_blank" rel="noopener noreferrer">
          @moneywrapping
        </a>
      </li>
    </ul>
  </section>

</main>
    </Layout>
  );
}
