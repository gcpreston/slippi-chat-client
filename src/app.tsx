import React from 'react';
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');

if (domNode) {
  const root = createRoot(domNode);
  root.render(<h1>Hello from React</h1>);
}
