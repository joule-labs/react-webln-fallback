import React from 'react';
import { Modal, Input, Divider } from 'antd';
import { MethodComponentProps, WebLNMethod, parseSignatureFromInput } from 'react-webln-fallback';
import { WebLNProvider, SignMessageResponse } from 'webln';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps;

interface State {
  signature: string;
}

export default class SignMessage extends React.PureComponent<Props, State> {
  state: State = {
    signature: '',
  };

  render() {
    const { args } = this.props;
    const { signature } = this.state;

    console.log(!signature);
    return (
      <Modal
        title="Sign Message"
        onOk={this.handleApprove}
        onCancel={this.handleReject}
        okButtonDisabled={!signature}
        maskClosable={false}
        visible
      >
        <p>Run the following command, then paste the signature below</p>
        <CLIHelp method={WebLNMethod.signMessage} args={args} />
        <Input.TextArea
          placeholder="Paste signature here"
          value={signature}
          rows={5}
          style={{ marginTop: '10px' }}
          onChange={this.handleChange}
        />
      </Modal>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ signature: ev.target.value });
  };

  private handleApprove = () => {
    const [message] = this.props.args as Parameters<WebLNProvider['signMessage']>;
    const signature = parseSignatureFromInput(this.state.signature);
    this.props.onApprove({ message, signature } as SignMessageResponse);
  };

  private handleReject = () => {
    this.props.onReject('Closed before signing');
  };
}
