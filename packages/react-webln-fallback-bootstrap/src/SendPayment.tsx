import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback-core';
import { WebLNProvider, SendPaymentResponse } from 'webln';
import QRCode from 'qrcode.react';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps;

export default class SendPayment extends React.PureComponent<Props> {
  render() {
    const { args, t, paymentPreimage } = this.props;
    const [paymentRequest] = args as Parameters<WebLNProvider['sendPayment']>;

    let content;
    let onHide;
    let noEasyClose;
    if (paymentPreimage) {
      onHide = this.handleApprove;
      const iconStyle = {
        fontSize: '4rem',
        width: '5rem',
        height: '5rem',
        lineHeight: '5rem',
        margin: '0 auto',
        borderRadius: '100%',
        color: '#FFF',
      };
      content = (
        <>
          <Modal.Header>
            <Modal.Title>{t('react-webln-fallback.send.title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <div className="bg-success mb-3" style={iconStyle}>
                ✓
              </div>
              <h4 className="mb-3">{t('react-webln-fallback.send.success')}</h4>
              <Button variant="primary" size="lg" onClick={this.handleApprove}>
                {t('react-webln-fallback.common.continue')}
              </Button>
            </div>
          </Modal.Body>
        </>
      );
    } else {
      onHide = this.handleReject;
      noEasyClose = true;
      content = (
        <>
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
              <div className="mt-3 mb-4" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)'}} />
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
          </Modal.Footer>
        </>
      )
    }

    return (
      <Modal onHide={onHide} backdrop={noEasyClose ? 'static' : true} show>
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
