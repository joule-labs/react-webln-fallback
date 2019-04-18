import React from 'react';
import { Modal, TextArea, Button, Grid, Divider, Form, Card } from 'semantic-ui-react';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback';
import { WebLNProvider, SendPaymentResponse } from 'webln';
import DefaultQRCode, { QRCodeProps } from 'qrcode.react';
import CLIHelp from './CLIHelp';

// Add SVG types to QRCode since it passes them through
const QRCode = DefaultQRCode as React.ComponentClass<QRCodeProps & React.HTMLProps<SVGElement>>;

type Props = MethodComponentProps;

export default class SendPayment extends React.PureComponent<Props> {
  render() {
    const { args } = this.props;
    const [paymentRequest] = args as Parameters<WebLNProvider['sendPayment']>;

    return (
      <Modal open size="small" closeOnDimmerClick={false} onClose={this.handleReject}>
        <Modal.Header>Send payment</Modal.Header>
        <Modal.Content>
          <Grid stackable>
            <Grid.Column width={5}>
              <Card>
                <Card.Content>
                  <QRCode
                    value={paymentRequest.toUpperCase()}
                    style={{ display: 'block', width: '100%', height: 'auto' }}
                  />
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={11}>
              <div style={{ paddingTop: 7 }} />
              <Form as="div">
                <TextArea
                  label="Payment request"
                  value={paymentRequest}
                  variant="outlined"
                  rows={5}
                  disabled
                  fluid
                />
              </Form>
              <div style={{ marginTop: 10 }} />
              <Button
                href={`lightning:${paymentRequest}`}
                variant="contained"
                size="large"
                fluid
                primary
              >
                Open in Wallet
              </Button>
            </Grid.Column>
          </Grid>
          <Divider section />
          <CLIHelp method={WebLNMethod.sendPayment} args={args} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleReject}>
            Cancel
          </Button>
          <Button onClick={this.handleApprove} primary>
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private handleApprove = () => {
    this.props.onApprove({ preimage: '' } as SendPaymentResponse);
  };

  private handleReject = () => {
    this.props.onReject('Payment closed before sending');
  };
}
