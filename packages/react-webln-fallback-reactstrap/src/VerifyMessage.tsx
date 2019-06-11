import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Button } from 'reactstrap';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback-core';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps;

export default class VerifyMessage extends React.PureComponent<Props> {
  render() {
    const { args, t } = this.props;

    return (
      <Modal onHide={this.handleApprove} backdrop="static" isOpen>
        <ModalHeader toggle={this.handleApprove}>
          {t('react-webln-fallback.verify.title')}
        </ModalHeader>
        <ModalBody>
          <p>{t('react-webln-fallback.verify.instructions')}</p>
          <CLIHelp method={WebLNMethod.verifyMessage} args={args} t={t} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleApprove}>
            {t('react-webln-fallback.common.ok')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  private handleApprove = () => {
    this.props.onApprove(null);
  };
}
