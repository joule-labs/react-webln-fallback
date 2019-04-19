import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { withTranslation, WithTranslation } from 'react-i18next';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback-core';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps & WithTranslation;

class VerifyMessage extends React.PureComponent<Props> {
  render() {
    const { args, t } = this.props;

    return (
      <Modal onHide={this.handleApprove} backdrop="static" show>
        <Modal.Header closeButton>
          <Modal.Title>Verify message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('react-webln-fallback.verify.instructions')}</p>
          <CLIHelp method={WebLNMethod.verifyMessage} args={args} />
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

export default withTranslation()(VerifyMessage);
