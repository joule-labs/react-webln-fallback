import i18next from 'i18next';

export enum WebLNMethod {
  getInfo = 'getInfo',
  sendPayment = 'sendPayment',
  makeInvoice = 'makeInvoice',
  signMessage = 'signMessage',
  verifyMessage = 'verifyMessage',
}

export interface MethodComponentProps {
  method: WebLNMethod;
  args: any;
  t: typeof i18next.t;
  i18nLng?: string;
  onApprove(res: any): void;
  onReject(msg: string): void;
}