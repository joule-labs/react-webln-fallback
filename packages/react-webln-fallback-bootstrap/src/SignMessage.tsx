import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MethodComponentProps, WebLNMethod, parseSignatureFromInput } from 'react-webln-fallback';
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
    const { args } = this.props;
    const { signature } = this.state;

    return (
      <Modal
        onHide={this.handleReject}
        backdrop="static"
        show
      >
        <Modal.Header closeButton>
          <Modal.Title>Sign message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Run the following command, then paste the signature below</p>
          <CLIHelp method={WebLNMethod.signMessage} args={args} />
          <Form.Control
            as="textarea"
            placeholder="Paste signature here"
            value={signature}
            rows={5}
            style={{ marginTop: '10px' }}
            onChange={this.handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleReject} disabled={!signature}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.handleApprove}>
            Submit
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
    this.props.onReject('Closed before signing');
  };
}
