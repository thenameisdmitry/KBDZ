import React, { useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function LightboxImage({ src, alt, style }) {
  const [open, setOpen] = useState(false);
  const resolvedSrc = useBaseUrl(src);

  return (
    <>
      <img
        src={resolvedSrc}
        alt={alt}
        onClick={() => setOpen(true)}
        style={{
          width: '100%',
          maxWidth: '500px',
          cursor: 'zoom-in',
          borderRadius: '8px',
          border: '1px solid rgba(131,131,131,0.2)',
          ...style
        }}
      />

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
          }}
        >
          <img
            src={resolvedSrc}
            alt={alt}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: '8px',
            }}
          />
        </div>
      )}
    </>
  );
}