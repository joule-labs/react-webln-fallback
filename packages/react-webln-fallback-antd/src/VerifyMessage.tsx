import React from 'react';
import { Modal, Input, Divider } from 'antd';
import { MethodComponentProps } from 'react-webln-fallback';
import { WebLNProvider, SignMessageResponse } from 'webln';
import CLIHelp from './CLIHelp';
import { Command } from './util/cli';

type Props = MethodComponentProps;

export default class VerifyMessage extends React.PureComponent<Props> {
  render() {
    const { args } = this.props;

    return (
      <Modal
        title="Sign Message"
        onOk={this.handleApprove}
        onCancel={this.handleApprove}
        maskClosable={false}
        visible
      >
        <p>Run the following command to verify the integrity of the signed message</p>
        <CLIHelp command={Command.VERIFY} args={args} />
      </Modal>
    );
  }

  private handleApprove = () => {
    this.props.onApprove(null);
  };
}
