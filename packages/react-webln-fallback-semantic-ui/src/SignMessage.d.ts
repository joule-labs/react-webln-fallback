import React from 'react';
import { MethodComponentProps } from 'react-webln-fallback-core';
declare type Props = MethodComponentProps;
interface State {
    signature: string;
}
export default class SignMessage extends React.PureComponent<Props, State> {
    state: State;
    render(): JSX.Element;
    private handleChange;
    private handleApprove;
    private handleReject;
}
export {};
