import React, { useState } from 'react';

const STEPS = [
  { label: 'Step 1', anchor: '#step-1-search-space-formation',   left: '2.5%',  width: '17%' },
  { label: 'Step 2', anchor: '#step-2-pair-similarity-calculation', left: '22%', width: '17%' },
  { label: 'Step 3', anchor: '#step-3-best-pair-selection',       left: '41.5%', width: '17%' },
  { label: 'Step 4', anchor: '#step-4-mapping-strength',          left: '61%', width: '17%' },
  { label: 'Step 5', anchor: '#step-5-reconciliation-results',    left: '80.5%', width: '17%' },
];

export default function ClickableSteps({ src, alt }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      width: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid rgba(131,131,131,0.2)',
    }}>
      {/* Base image */}
      <img
        src={src}
        alt={alt || 'Algorithmic Recon steps'}
        style={{
          width: '100%',
          display: 'block',
          borderRadius: '8px',
        }}
      />

      {/* Clickable overlays */}
      {STEPS.map((step, i) => (
        <a
          key={i}
          href={step.anchor}
          title={step.label}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: 'absolute',
            top: '0',
            left: step.left,
            width: step.width,
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: '8px',
            textDecoration: 'none',
            borderRadius: '4px',
            backgroundColor: hovered === i
              ? 'rgba(0, 0, 0, 0.18)'
              : 'transparent',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer',
          }}
        >
          {/* Tooltip label on hover */}
          {hovered === i && (
            <span style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.75)',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              padding: '3px 8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}>
              {step.label} ↓
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
