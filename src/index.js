import React from 'react';
import { createRoot } from 'react-dom/client';
import { BookApp } from './bookApp';

const container = document.getElementById('index');
const root = createRoot(container);
root.render(<BookApp/>);
