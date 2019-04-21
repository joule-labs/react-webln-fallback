import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback-core';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps;

export default class VerifyMessage extends React.PureComponent<Props> {
  render() {
    const { args, t } = this.props;

    return (
      <Modal onHide={this.handleApprove} backdrop="static" show>
        <Modal.Header closeButton>
          <Modal.Title>Verify message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('react-webln-fallback.verify.instructions')}</p>
          <CLIHelp method={WebLNMethod.verifyMessage} args={args} t={t} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.handleApprove}>
          {t('react-webln-fallback.common.ok')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  private handleApprove = () => {
    this.props.onApprove(null);
  };
}
