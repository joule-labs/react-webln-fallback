import React from 'react';
import {
  ReactWebLNFallback,
  ReactWebLNFallbackProps,
  WebLNMethod,
  allMethods,
} from 'react-webln-fallback-core';
import MakeInvoice from './MakeInvoice';
import SendPayment from './SendPayment';
import SignMessage from './SignMessage';
import VerifyMessage from './VerifyMessage';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Props = Partial<Omit<ReactWebLNFallbackProps, 'methodComponents'>>;

export default class AntdReactWebLNFallback extends React.PureComponent<Props> {
  render() {
    let { supportedMethods, ...rest } = this.props;
    if (!supportedMethods) {
      supportedMethods = allMethods;
    }

    return (
      <ReactWebLNFallback
        {...rest}
        supportedMethods={supportedMethods}
        methodComponents={{
          [WebLNMethod.makeInvoice]: MakeInvoice,
          [WebLNMethod.sendPayment]: SendPayment,
          [WebLNMethod.signMessage]: SignMessage,
          [WebLNMethod.verifyMessage]: VerifyMessage,
        }}
      />
    )
  }
}