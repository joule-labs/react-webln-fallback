import React from 'react';
import { Modal, TextArea, Button, Grid, Divider, Form, Card } from 'semantic-ui-react';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback-core';
import { WebLNProvider, SendPaymentResponse } from 'webln';
import DefaultQRCode, { QRCodeProps } from 'qrcode.react';
import CLIHelp from './CLIHelp';

// Add SVG types to QRCode since it passes them through
const QRCode = DefaultQRCode as React.ComponentClass<QRCodeProps & React.HTMLProps<SVGElement>>;

type Props = MethodComponentProps;

export default class SendPayment extends React.PureComponent<Props> {
  render() {
    const { args, t } = this.props;
    const [paymentRequest] = args as Parameters<WebLNProvider['sendPayment']>;

    return (
      <Modal open size="tiny" closeOnDimmerClick={false} onClose={this.handleReject}>
        <Modal.Header>{t('react-webln-fallback.send.title')}</Modal.Header>
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
                {t('react-webln-fallback.send.open')}
              </Button>
            </Grid.Column>
          </Grid>
          <Divider section />
          <CLIHelp method={WebLNMethod.sendPayment} args={args} t={t} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleReject}>
            {t('react-webln-fallback.common.cancel')}
          </Button>
          <Button onClick={this.handleApprove} primary>
            {t('react-webln-fallback.common.submit')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private handleApprove = () => {
    this.props.onApprove({ preimage: '' } as SendPaymentResponse);
  };

  private handleReject = () => {
    this.props.onReject(this.props.t('react-webln-fallback.send.reject'));
  };
}
