import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
      <Modal onHide={this.handleReject} backdrop="static" show>
        <Modal.Header closeButton>
          <Modal.Title>{t('react-webln-fallback.sign.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('react-webln-fallback.sign.instructions')}</p>
          <CLIHelp method={WebLNMethod.signMessage} args={args} t={t} />
          <Form.Control
            as="textarea"
            placeholder={t('react-webln-fallback.sign.placeholder')}
            value={signature}
            rows={5}
            style={{ marginTop: '10px' }}
            onChange={this.handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleReject}>
            {t('react-webln-fallback.common.cancel')}
          </Button>
          <Button variant="primary" onClick={this.handleApprove} disabled={!signature}>
            {t('react-webln-fallback.common.submit')}
          </Button>
        </Modal.Footer>
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
