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
  onApprove(res: any): void;
  onReject(msg: string): void;
}