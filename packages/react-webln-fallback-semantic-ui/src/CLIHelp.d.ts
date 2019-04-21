import React from 'react';
import { WebLNMethod, NodeType, MethodComponentProps } from 'react-webln-fallback-core';
interface Props {
    method: WebLNMethod;
    args: any;
    t: MethodComponentProps['t'];
}
interface State {
    nodeType: NodeType;
}
export default class CLIHelp extends React.PureComponent<Props, State> {
    state: State;
    render(): JSX.Element;
    private handleTypeChange;
    private renderCommandInput;
}
export {};
