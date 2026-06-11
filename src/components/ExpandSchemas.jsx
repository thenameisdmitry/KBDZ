import React, { useState } from 'react';

export default function LightboxImage({ src, alt, style }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <img
  src={src}
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

      {/* Modal */}
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
            src={src}
            alt={alt}
            style={{
              maxWidth: '150vw',
              maxHeight: '150vh',
              borderRadius: '8px',
            }}
          />
        </div>
      )}
    </>
  );
}