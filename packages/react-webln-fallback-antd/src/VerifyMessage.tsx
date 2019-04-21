import React from 'react';
import Modal from 'antd/lib/modal';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback-core';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps;

export default class VerifyMessage extends React.PureComponent<Props> {
  render() {
    const { args, t } = this.props;

    return (
      <Modal
        title={t('react-webln-fallback.verify.title')}
        okText={t('react-webln-fallback.common.ok')}
        onOk={this.handleApprove}
        onCancel={this.handleApprove}
        cancelButtonProps={{ style: { display: 'none' } }}
        maskClosable={false}
        visible
      >
        <p>{t('react-webln-fallback.verify.instructions')}</p>
        <CLIHelp method={WebLNMethod.verifyMessage} args={args} t={t} />
      </Modal>
    );
  }

  private handleApprove = () => {
    this.props.onApprove(null);
  };
}
