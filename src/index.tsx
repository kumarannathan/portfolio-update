import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './site/Skeleton.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Mark media as loaded so skeleton sheens (Skeleton.css) can stop. Capture phase, because
// load/error don't bubble. Errors count too: the component swaps in its own placeholder.
const markLoaded = (e: Event) => {
  const t = e.target;
  if (t instanceof HTMLImageElement || t instanceof HTMLVideoElement) t.setAttribute('data-loaded', '');
};
document.addEventListener('load', markLoaded, true);
document.addEventListener('loadeddata', markLoaded, true);
document.addEventListener('error', markLoaded, true);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
