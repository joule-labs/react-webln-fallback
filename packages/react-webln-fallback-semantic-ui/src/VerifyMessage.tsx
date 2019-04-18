import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps;

export default class VerifyMessage extends React.PureComponent<Props> {
  render() {
    const { args } = this.props;

    return (
      <Modal open size="small" closeOnDimmerClick={false} onClose={this.handleApprove}>
        <Modal.Header>Verify message</Modal.Header>
        <Modal.Content>
          <p>
            Run the following command to verify the integrity of the signed message
          </p>
          <CLIHelp method={WebLNMethod.verifyMessage} args={args} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleApprove} primary>
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private handleApprove = () => {
    this.props.onApprove(null);
  };
}
