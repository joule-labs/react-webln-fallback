import React from 'react';
import { Modal, TextArea, Button, Grid, Divider, Form, Card, Icon, Header } from 'semantic-ui-react';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback-core';
import { WebLNProvider, SendPaymentResponse } from 'webln';
import DefaultQRCode, { QRCodeProps } from 'qrcode.react';
import CLIHelp from './CLIHelp';

// Add SVG types to QRCode since it passes them through
const QRCode = DefaultQRCode as React.ComponentClass<QRCodeProps & React.HTMLProps<SVGElement>>;

type Props = MethodComponentProps;

export default class SendPayment extends React.PureComponent<Props> {
  render() {
    const { args, t, paymentPreimage } = this.props;
    const [paymentRequest] = args as Parameters<WebLNProvider['sendPayment']>;

    let content;
    let onClose;
    let noEasyClose;
    if (paymentPreimage) {
      onClose = this.handleApprove;
      content = (
        <Modal.Content>
          <div style={{ textAlign: 'center' }}>
            <Header as="h2" icon>
              <Icon name="check circle outline" color="green" />
              {t('react-webln-fallback.send.success')}
            </Header>
            <div>
              <Button primary size="large" onClick={this.handleApprove}>
                {t('react-webln-fallback.common.continue')}
              </Button>
            </div>
          </div>
        </Modal.Content>
      );
    } else {
      onClose = this.handleReject;
      noEasyClose = true;
      content = (
        <>
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
        </>
      );
    }

    return (
      <Modal open size="tiny" closeOnDimmerClick={!noEasyClose} onClose={onClose}>
        <Modal.Header >{t('react-webln-fallback.send.title')}</Modal.Header>
        {content}
      </Modal>
    );
  }

  private handleApprove = () => {
    const { onApprove, paymentPreimage } = this.props;
    onApprove({ preimage: paymentPreimage } as SendPaymentResponse);
  };

  private handleReject = () => {
    const { onReject, t } = this.props;
    onReject(t('react-webln-fallback.send.reject'));
  };
}
