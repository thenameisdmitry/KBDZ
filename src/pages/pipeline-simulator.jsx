import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import PipelineSimulator from "../components/PipelineSimulator";
import styles from "./pipeline-simulator.module.css";

export default function PipelineSimulatorPage() {
  return (
    <Layout
      title="Pipeline Simulator"
      description="Interactive companion to Data Hub: a documented Snowflake + dbt + Airflow + Metabase pipeline with per-node docs, schema contracts, and commented source."
    >
      {/* Fonts are loaded only on this page — JetBrains Mono and Inter
          are the simulator's own typefaces, not the site's. */}
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap"
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.intro}>
          <h1 className={styles.pageTitle}>Pipeline Simulator</h1>
          <p className={styles.lead}>
            An interactive companion to <strong>DZ Data Hub</strong> — a fictional
            but internally consistent data platform. Press <em>Run</em> to watch five
            billing events travel from the raw landing table to a governed business
            metric, or click any node to read its documentation: a consumer-facing
            overview, a schema contract, and the commented source itself.
          </p>
          <p className={styles.leadSecondary}>
            What this artifact demonstrates and why it is built this way is covered
            in the accompanying{" "}
            <Link to="/docs/portfolio/dz-pipeline-simulator">portfolio write-up</Link>.
          </p>
        </header>

        {/* The simulator keeps its own Darcula (IDE-style) theme by design.
            The frame below marks it as an embedded tool within the site. */}
        <div className={styles.frame}>
          <div className={styles.frameBar}>
            <span className={styles.frameLabel}>Interactive artifact</span>
            <span className={styles.frameMeta}>
              Snowflake · dbt · Airflow · Metabase — runs entirely in your browser
            </span>
          </div>
          <PipelineSimulator />
        </div>
      </main>
    </Layout>
  );
}
