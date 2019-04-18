import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
      <Dialog open disableBackdropClick onClose={this.handleReject}>
        <DialogTitle>Sign message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Run the following command, then paste the signature below
          </DialogContentText>
          <div style={{ marginBottom: 10 }} />
          <CLIHelp method={WebLNMethod.signMessage} args={args} />
          <div style={{ marginBottom: 20 }} />
          <TextField
            label="Message signature"
            variant="outlined"
            fullWidth
            multiline
            rows={5}
            value={signature}
            onChange={this.handleChange}
            placeholder="Paste signature here"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleReject} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleApprove} color="primary" disabled={!signature}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
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
