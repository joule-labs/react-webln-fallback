import React from 'react';
import { Modal, Input, Divider } from 'antd';
import { MethodComponentProps } from 'react-webln-fallback';
import { WebLNProvider, SignMessageResponse } from 'webln';
import CLIHelp from './CLIHelp';
import { Command } from './util/cli';

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
        <CLIHelp command={Command.SIGN} args={args} />
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
    let { signature } = this.state;

    // If they pasted the whole JSON blob or quotes, decode and reassing
    try {
      const json = JSON.parse(signature);
      if (json.signature) {
        signature = json.signature;
      }
      if (typeof json === 'string') {
        signature = json;
      }
    }
    catch (_) {
      // no-op
    }

    this.props.onApprove({ message, signature } as SignMessageResponse);
  };

  private handleReject = () => {
    this.props.onReject('Closed before signing');
  };
}
