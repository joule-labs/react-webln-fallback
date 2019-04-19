import React from 'react';
import { Modal, Input } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import { MethodComponentProps, WebLNMethod, parseSignatureFromInput } from 'react-webln-fallback-core';
import { WebLNProvider, SignMessageResponse } from 'webln';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps & WithTranslation;

interface State {
  signature: string;
}

class SignMessage extends React.PureComponent<Props, State> {
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
        okButtonDisabled={!signature}
        maskClosable={false}
        visible
      >
        <p>{t('react-webln-fallback.sign.instructions')}</p>
        <CLIHelp method={WebLNMethod.signMessage} args={args} />
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

export default withTranslation()(SignMessage);
