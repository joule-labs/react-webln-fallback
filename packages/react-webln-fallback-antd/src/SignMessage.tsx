import React from 'react';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import { MethodComponentProps, WebLNMethod, parseSignatureFromInput } from 'react-webln-fallback-core';
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
    const { args, t } = this.props;
    const { signature } = this.state;

    return (
      <Modal
        title={t('react-webln-fallback.sign.title')}
        okText={t('react-webln-fallback.common.submit')}
        cancelText={t('react-webln-fallback.common.cancel')}
        onOk={this.handleApprove}
        onCancel={this.handleReject}
        okButtonProps={{ disabled: !signature }}
        maskClosable={false}
        visible
      >
        <p>{t('react-webln-fallback.sign.instructions')}</p>
        <CLIHelp method={WebLNMethod.signMessage} args={args} t={t} />
        <Input.TextArea
          placeholder={t('react-webln-fallback.sign.placeholder')}
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
    this.props.onReject(this.props.t('react-webln-fallback.sign.reject'));
  };
}
