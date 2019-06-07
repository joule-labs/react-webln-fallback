import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Button } from 'reactstrap';
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
      <Modal onClosed={this.handleReject} backdrop="static" isOpen>
        <ModalHeader toggle={this.handleReject}>
          {t('react-webln-fallback.sign.title')}
        </ModalHeader>
        <ModalBody>
          <p>{t('react-webln-fallback.sign.instructions')}</p>
          <CLIHelp method={WebLNMethod.signMessage} args={args} t={t} />
          <Input
            type="textarea"
            placeholder={t('react-webln-fallback.sign.placeholder')}
            value={signature}
            rows={5}
            style={{ marginTop: '10px' }}
            onChange={this.handleChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.handleReject}>
            {t('react-webln-fallback.common.cancel')}
          </Button>
          <Button color="primary" onClick={this.handleApprove} disabled={!signature}>
            {t('react-webln-fallback.common.submit')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
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
