import React, { type ReactNode, useEffect } from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';
import type BlogPostPageType from '@theme/BlogPostPage';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof BlogPostPageType>;

export default function BlogPostPageWrapper(props: Props): ReactNode {

useEffect(() => {
  const insertBtn = () => {
    const header = document.querySelector('.blog-wrapper article > header');
    if (header && !document.querySelector('.blog-back-btn')) {
      const link = document.createElement('a');
      link.href = '/KBDZ/blog';
      link.innerText = '← Back to Blog';
      link.className = 'blog-back-btn';
      header.insertBefore(link, header.firstChild);
    }
  };

  // Try immediately
  insertBtn();

  // Also try after a short delay for client-side navigation
  const timer = setTimeout(insertBtn, 20);

  return () => clearTimeout(timer);
}, []);

  return (
    <>
      <style>{`
        .blog-wrapper aside,
        .blog-wrapper .col--2,
        .blog-wrapper .col--3 {
          display: none !important;
        }
        .blog-wrapper .col--10,
        .blog-wrapper .col--9,
        .blog-wrapper .col--8,
        .blog-wrapper .col--7 {
          max-width: 1000px !important;
          width: 100% !important;
          margin: 0 auto !important;
          padding: 0 24px !important;
          flex: none !important;
        }
        .blog-wrapper .row {
          justify-content: center !important;
        }
        .blog-wrapper h1 {
          font-size: 2rem !important;
          font-weight: 700 !important;
          letter-spacing: -0.02em !important;
          line-height: 1.2 !important;
          text-align: none;
        }
        .blog-wrapper article .markdown {
          text-align: justify;
        }  
        .blog-back-btn {
          display: inline-flex;
          align-items: center;
          font-size: 0.92rem;
          font-weight: 600;
          color: #a78bfa !important;
          text-decoration: none !important;
          margin-bottom: 20px;
          transition: opacity 0.15s ease;
        }
        .blog-back-btn:hover {
          opacity: 0.7;
        }
      `}</style>
      <BlogPostPage {...props} />
    </>
  );
}