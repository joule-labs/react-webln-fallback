import React from 'react';
import { Modal, Button, TextArea, Divider, Form } from 'semantic-ui-react';
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
      <Modal open size="small" closeOnDimmerClick={false} onClose={this.handleReject}>
        <Modal.Header>Sign message</Modal.Header>
        <Modal.Content>
          <p>
            Run the following command, then paste the signature below
          </p>
          <CLIHelp method={WebLNMethod.signMessage} args={args} />
          <Divider section />
          <Form as="div">
            <TextArea
              label="Message signature"
              rows={5}
              value={signature}
              onChange={this.handleChange}
              placeholder="Paste signature here"
              fluid
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleReject}>
            Cancel
          </Button>
          <Button onClick={this.handleApprove} primary disabled={!signature}>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private handleChange = (_: any, data: any) => {
    this.setState({ signature: data.value });
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
