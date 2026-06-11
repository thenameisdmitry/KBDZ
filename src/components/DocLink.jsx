import React from 'react';

export default function DocLink({ href, children }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = href;
  };

  return (
    <a href={href} onClick={handleClick} style={{ color: 'inherit' }}>
      {children}
    </a>
  );
}