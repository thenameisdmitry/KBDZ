import React from 'react';

export default function Term({ name, children }) {
  if (!children) return null;

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');

  const highlightText = (text) =>
    text.split(regex).map((part, i) =>
      regex.test(part)
        ? <mark key={i} className="term-highlight">{part}</mark>
        : part
    );

  const processNode = (node) => {
    if (typeof node === 'string') return highlightText(node);
    if (React.isValidElement(node)) {
      return React.cloneElement(node, {
        children: React.Children.map(node.props.children, processNode)
      });
    }
    return node;
  };

  return <>{React.Children.map(children, processNode)}</>;
}