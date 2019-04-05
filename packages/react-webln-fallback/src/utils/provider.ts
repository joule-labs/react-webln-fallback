// =======================================================================
// WebLN provider fallback class
// =======================================================================

import { WebLNProvider } from 'webln';
import { UnsupportedMethodError } from 'webln/lib/errors';
import { WebLNMethod } from '../types';

// TODO: Better way to type this with less copypaste?
export type FallbackMethodHandler = {
  (data: { method: WebLNMethod.getInfo, args: Parameters<WebLNProvider['getInfo']> }): ReturnType<WebLNProvider['getInfo']>;
  (data: { method: WebLNMethod.sendPayment, args: Parameters<WebLNProvider['sendPayment']> }): ReturnType<WebLNProvider['sendPayment']>;
  (data: { method: WebLNMethod.makeInvoice, args: Parameters<WebLNProvider['makeInvoice']> }): ReturnType<WebLNProvider['makeInvoice']>;
  (data: { method: WebLNMethod.signMessage, args: Parameters<WebLNProvider['signMessage']> }): ReturnType<WebLNProvider['signMessage']>;
  (data: { method: WebLNMethod.verifyMessage, args: Parameters<WebLNProvider['verifyMessage']> }): ReturnType<WebLNProvider['verifyMessage']>;
}

export default class FallbackWebLNProvider implements WebLNProvider {
  private supportedMethods: WebLNMethod[];
  private methodHandler: FallbackMethodHandler;

  constructor(supportedMethods: WebLNMethod[], methodHandler: FallbackMethodHandler) {
    this.supportedMethods = supportedMethods;
    this.methodHandler = methodHandler;
  }

  enable() {
    return Promise.resolve();
  }

  getInfo(...args: Parameters<WebLNProvider['getInfo']>) {
    const method = WebLNMethod.getInfo;
    this.checkSupported(method);
    return this.methodHandler({ method, args });
  }

  sendPayment(...args: Parameters<WebLNProvider['sendPayment']>) {
    const method = WebLNMethod.sendPayment;
    this.checkSupported(method);
    return this.methodHandler({ method, args });
  }

  makeInvoice(...args: Parameters<WebLNProvider['makeInvoice']>) {
    const method = WebLNMethod.makeInvoice;
    this.checkSupported(method);
    return this.methodHandler({ method, args });
  }

  signMessage(...args: Parameters<WebLNProvider['signMessage']>) {
    const method = WebLNMethod.signMessage;
    this.checkSupported(method);
    return this.methodHandler({ method, args });
  }

  verifyMessage(...args: Parameters<WebLNProvider['verifyMessage']>) {
    const method = WebLNMethod.verifyMessage;
    this.checkSupported(method);
    return this.methodHandler({ method, args });
  }

  private checkSupported(method: WebLNMethod) {
    if (!this.supportedMethods.includes(WebLNMethod.verifyMessage)) {
      throw new UnsupportedMethodError('This method is not supported');
    }
  }
}