import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
      <Modal onHide={this.handleReject} backdrop="static" show>
        <Modal.Header closeButton>
          <Modal.Title>{t('react-webln-fallback.send.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row noGutters={true}>
              <Col xs={12} sm={5}>
                <div style={{
                  padding: 10,
                  marginRight: 20,
                  marginBottom: 10,
                  borderRadius: 4,
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}>
                  <QRCode
                    value={paymentRequest.toUpperCase()}
                    style={{ display: 'block', width: '100%', height: 'auto' }}
                  />
                </div>
              </Col>
              <Col xs={12} sm={7}>
                <Form.Control
                  value={paymentRequest}
                  as="textarea"
                  rows={4}
                  readOnly
                  style={{ marginBottom: 10 }}
                />
                <Button href={`lightning:${paymentRequest}`} variant="primary" block>
                  {t('react-webln-fallback.send.open')}
                </Button>
              </Col>
            </Row>
            <div className="mt-1">
              <Row>
                <Col xs={12}>
                  <CLIHelp method={WebLNMethod.sendPayment} args={args} t={t} />
                </Col>
              </Row>
            </div>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleReject}>
            {t('react-webln-fallback.common.cancel')}
          </Button>
          <Button variant="primary" onClick={this.handleApprove}>
            {t('react-webln-fallback.common.submit')}
          </Button>
        </Modal.Footer>
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
