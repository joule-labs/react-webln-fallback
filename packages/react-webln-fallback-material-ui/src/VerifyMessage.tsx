import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps;

export default class VerifyMessage extends React.PureComponent<Props> {
  render() {
    const { args } = this.props;

    return (
      <Dialog open disableBackdropClick onClose={this.handleApprove}>
        <DialogTitle>Verify message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Run the following command to verify the integrity of the signed message
          </DialogContentText>
          <div style={{ marginBottom: 10 }} />
          <CLIHelp method={WebLNMethod.verifyMessage} args={args} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleApprove} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private handleApprove = () => {
    this.props.onApprove(null);
  };
}
