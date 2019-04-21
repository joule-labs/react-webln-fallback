import React from 'react';
import { MethodComponentProps } from 'react-webln-fallback-core';
declare type Props = MethodComponentProps;
interface State {
    paymentRequest: string;
}
export default class MakeInvoice extends React.PureComponent<Props, State> {
    state: State;
    render(): JSX.Element;
    private handleChange;
    private handleApprove;
    private handleReject;
}
export {};
