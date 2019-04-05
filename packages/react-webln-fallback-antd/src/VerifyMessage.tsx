import React from 'react';
import { Modal } from 'antd';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback';
import CLIHelp from './CLIHelp';

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
        <CLIHelp method={WebLNMethod.verifyMessage} args={args} />
      </Modal>
    );
  }

  private handleApprove = () => {
    this.props.onApprove(null);
  };
}
