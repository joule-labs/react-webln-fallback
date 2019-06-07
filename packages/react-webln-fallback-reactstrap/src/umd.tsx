import React from 'react';
import ReactDOM from 'react-dom';
import WebLNFallback from './index';

export function init(el: HTMLElement, props: React.ComponentProps<typeof WebLNFallback> = {}) {
  ReactDOM.render(<WebLNFallback {...props} />, el);
}

export { closePrompt, paymentComplete } from './index';
