import React from 'react';
import { Modal, Button, TextArea, Divider, Form } from 'semantic-ui-react';
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
      <Modal open size="small" closeOnDimmerClick={false} onClose={this.handleReject}>
        <Modal.Header>Provide an invoice</Modal.Header>
        <Modal.Content>
          <MakeInvoiceInstructions args={invoiceReqs} />
          <Form as="div">
            <TextArea
              label="Payment request"
              variant="outlined"
              fluid
              rows={5}
              value={paymentRequest}
              onChange={this.handleChange}
              placeholder="lnbc5m1pw22r79pp5ghj74332mwfycdzafl0x2f..."
            />
          </Form>
          <Divider section />
          <CLIHelp method={WebLNMethod.makeInvoice} args={args} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleReject}>
            Cancel
          </Button>
          <Button onClick={this.handleApprove} primary disabled={!paymentRequest}>
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private handleChange = (_: any, data: any) => {
    this.setState({ paymentRequest: data.value });
  };

  private handleApprove = () => {
    this.props.onApprove({ paymentRequest: '' } as RequestInvoiceResponse);
  };

  private handleReject = () => {
    this.props.onReject('Payment closed before sending');
  };
}
