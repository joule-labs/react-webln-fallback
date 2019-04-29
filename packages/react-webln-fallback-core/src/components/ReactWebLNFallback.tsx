import React from 'react';
import i18next from 'i18next';
import { WebLNProvider } from 'webln';
import { RejectionError } from 'webln/lib/errors';
import FallbackWebLNProvider, { FallbackMethodHandler } from '../utils/provider';
import { WebLNMethod, MethodComponentProps } from '../types';
import { i18n, i18nInit } from '../i18n';

export const allMethods = [
  WebLNMethod.makeInvoice,
  WebLNMethod.sendPayment,
  WebLNMethod.signMessage,
  WebLNMethod.verifyMessage,
];

export interface ReactWebLNFallbackProps {
  supportedMethods: WebLNMethod[];
  methodComponents: { [key in WebLNMethod]?: React.ComponentType<MethodComponentProps> };
  i18nLng?: string;
  overrideWebLN?: boolean;
}

type Props = ReactWebLNFallbackProps;

interface State {
  activePrompt: Partial<MethodComponentProps> | null;
  paymentPreimage: string | undefined;
  isProvidingWebLN: boolean;
  i18nLng?: string;
  t: typeof i18next.t;
}

interface WindowWithWebLN extends Window {
  webln: WebLNProvider;
  _webln: WebLNProvider;
}

const weblnWindow = window as WindowWithWebLN;

let closePromptHandler: (() => void) | undefined;
export function closePrompt() {
  closePromptHandler && closePromptHandler();
}

let paymentCompleteHandler: ((preimage: string) => void) | undefined;
export function paymentComplete(preimage: string) {
  paymentCompleteHandler && paymentCompleteHandler(preimage);
}

export class ReactWebLNFallback extends React.PureComponent<Props, State> {
  state: State = {
    activePrompt: null,
    paymentPreimage: undefined,
    isProvidingWebLN: false,
    i18nLng: this.props.i18nLng,
    t: (k: any) => k,
  };

  constructor(props: Props) {
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

    // Set language if there is one
    if (props.i18nLng) {
      i18n.changeLanguage(props.i18nLng);
    }
  }

  async componentDidMount() {
    // Setup handlers for this component
    closePromptHandler = this.closePrompt;
    paymentCompleteHandler = this.paymentComplete;

    // Initialize i18n and get translate function
    const t = await i18nInit();
    this.setState({ t });
  }

  componentWillUnmount() {
    closePromptHandler = undefined;
    paymentCompleteHandler = undefined;
    clearTimeout(this.paymentCompleteCloseTimeout);
  }

  componentDidUpdate(prevProps: Props) {
    const { i18nLng } = this.props;
    if (i18nLng && i18nLng !== prevProps.i18nLng) {
      i18n.changeLanguage(i18nLng);
      this.setState({
        t: i18n.t,
        i18nLng,
      });
    }
  }

  render() {
    const { methodComponents } = this.props;
    const { activePrompt, isProvidingWebLN, t, i18nLng, paymentPreimage } = this.state;

    // Don't render anything if user has their own WebLN client, or we have
    // no active prompt
    if (!isProvidingWebLN || !activePrompt) {
      return null;
    }

    // Don't render anything if we don't have a component for this method
    const MethodComponent = methodComponents[activePrompt.method as WebLNMethod];
    if (!MethodComponent) {
      return null;
    }

    return (
      <MethodComponent
        {...activePrompt as MethodComponentProps}
        t={t}
        i18nLng={i18nLng}
        paymentPreimage={paymentPreimage}
      />
    );
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
        return reject(new RejectionError(i18n.t('react-webln-fallback.common.busy')));
      }

      const activePrompt = {
        method,
        args,
        onApprove: (res: any) => {
          resolve(res);
          this.closePrompt();
        },
        onReject: (msg: any) => {
          reject(new RejectionError(msg));
          this.closePrompt();
        },
      };
      this.setState({
        activePrompt,
        paymentPreimage: undefined,
      });
    });
  };

  private closePrompt = () => {
    this.setState({
      activePrompt: null,
      paymentPreimage: undefined,
    });
  };

  private paymentCompleteCloseTimeout: any;
  private paymentComplete = (preimage: string) => {
    this.setState({ paymentPreimage: preimage });
  };
}