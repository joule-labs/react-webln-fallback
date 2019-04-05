import React from 'react';
import i18next from 'i18next';
import { WebLNProvider } from 'webln';
import { RejectionError } from 'webln/lib/errors';
import FallbackWebLNProvider, { FallbackMethodHandler } from '../utils/provider';
import { WebLNMethod, MethodComponentProps } from '../types';

export const allMethods = [
  WebLNMethod.makeInvoice,
  WebLNMethod.sendPayment,
  WebLNMethod.signMessage,
  WebLNMethod.verifyMessage,
];

export interface ReactWebLNFallbackProps {
  supportedMethods: WebLNMethod[];
  methodComponents: { [key in WebLNMethod]?: React.ComponentType<MethodComponentProps> };
  i18next?: i18next.i18n;
  i18nextLng?: string;
  i18nextResource?: i18next.Resource;
  overrideWebLN?: boolean;
}

interface State {
  isProvidingWebLN: boolean;
  activePrompt: MethodComponentProps | null;
}

interface WindowWithWebLN extends Window {
  webln: WebLNProvider;
  _webln: WebLNProvider;
}

const weblnWindow = window as WindowWithWebLN;

export class ReactWebLNFallback extends React.PureComponent<ReactWebLNFallbackProps, State> {
  state: State = {
    isProvidingWebLN: false,
    activePrompt: null,
  };

  constructor(props: ReactWebLNFallbackProps) {
    super(props);

    // Don't let them pass a supportedMethod without a corresponding component
    const methodsWithComponents = Object.keys(props.methodComponents);
    const missingMethods = props.supportedMethods.filter(m => !methodsWithComponents.includes(m));
    if (missingMethods.length) {
      throw new Error(`Missing components for the following supported WebLN methods: ${missingMethods.join(', ')}`);
    }

    // Attach our own WebLN if client is missing one or we're forcing it
    // TODO: Replace with an official WebLN function for detecting instead
    // of this ad-hoc methodology.
    if (!weblnWindow.webln || props.overrideWebLN) {
      this.state.isProvidingWebLN = true;
      this.attachWebLNToWindow();
    }
  }

  render() {
    const { methodComponents } = this.props;
    const { activePrompt, isProvidingWebLN } = this.state;

    // Don't render anything if user has their own WebLN client, or we have
    // no active prompt
    if (!isProvidingWebLN || !activePrompt) {
      return null;
    }

    // Don't render anything if we don't have a component for this method
    const MethodComponent = methodComponents[activePrompt.method];
    if (!MethodComponent) {
      return null;
    }
    return <MethodComponent {...activePrompt} />;
  }

  private attachWebLNToWindow() {
    weblnWindow._webln = weblnWindow.webln;
    weblnWindow.webln = new FallbackWebLNProvider(
      this.props.supportedMethods,
      this.handleWebLNMethod,
    );
  }

  private handleWebLNMethod: FallbackMethodHandler = ({ method, args }: any) => {
    return new Promise<any>((resolve, reject) => {
      if (this.state.activePrompt) {
        return reject(new RejectionError('Currently busy with another prompt'));
      }

      const activePrompt = {
        method,
        args,
        onApprove: (res: any) => {
          resolve(res);
          this.setState({ activePrompt: null });
        },
        onReject: (msg: any) => {
          reject(new RejectionError(msg));
          this.setState({ activePrompt: null });
        },
      };
      this.setState({ activePrompt });
    });
  };
}