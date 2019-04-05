import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps;

export default class VerifyMessage extends React.PureComponent<Props> {
  render() {
    const { args } = this.props;

    return (
      <Modal
        onHide={this.handleApprove}
        backdrop="static"
        show
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Run the following command to verify the integrity of the signed message</p>
          <CLIHelp method={WebLNMethod.verifyMessage} args={args} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.handleApprove}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  private handleApprove = () => {
    this.props.onApprove(null);
  };
}
