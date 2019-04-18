import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MethodComponentProps, MakeInvoiceInstructions, WebLNMethod } from 'react-webln-fallback';
import { WebLNProvider, RequestInvoiceResponse } from 'webln';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps;

interface State {
  paymentRequest: string;
}

export default class MakeInvoice extends React.PureComponent<Props, State> {
  state: State = {
    paymentRequest: '',
  };

  render() {
    const { args } = this.props;
    const { paymentRequest } = this.state;
    const [invoiceReqs] = args as Parameters<WebLNProvider['makeInvoice']>;

    return (
      <Dialog open disableBackdropClick onClose={this.handleReject}>
        <DialogTitle>Provide an invoice</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <MakeInvoiceInstructions args={invoiceReqs} />
          </DialogContentText>
          <div style={{ marginTop: 10 }} />
          <TextField
            label="Payment request"
            variant="outlined"
            fullWidth
            multiline
            rows={5}
            value={paymentRequest}
            onChange={this.handleChange}
            placeholder="lnbc5m1pw22r79pp5ghj74332mwfycdzafl0x2f..."
            InputLabelProps={{ shrink: true }}
          />
          <div style={{ margin: '20px 0', borderTop: '1px solid rgba(0, 0, 0, 0.1)' }} />
          <CLIHelp method={WebLNMethod.makeInvoice} args={args} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleReject} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleApprove} color="primary" disabled={!paymentRequest}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ paymentRequest: ev.target.value });
  };

  private handleApprove = () => {
    this.props.onApprove({ paymentRequest: '' } as RequestInvoiceResponse);
  };

  private handleReject = () => {
    this.props.onReject('Payment closed before sending');
  };
}
