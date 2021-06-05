import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Row,
  Col,
  Input,
  Button,
} from 'reactstrap';
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
          <ModalHeader>{t('react-webln-fallback.send.title')}</ModalHeader>
          <ModalBody>
            <div className="text-center">
              <div className="bg-success mb-3" style={iconStyle}>
                ✓
              </div>
              <h4 className="mb-3">{t('react-webln-fallback.send.success')}</h4>
              <Button color="primary" size="lg" onClick={this.handleApprove}>
                {t('react-webln-fallback.common.continue')}
              </Button>
            </div>
          </ModalBody>
        </>
      );
    } else {
      onHide = this.handleReject;
      noEasyClose = true;
      content = (
        <>
          <ModalHeader toggle={this.handleReject}>
            {t('react-webln-fallback.send.title')}
          </ModalHeader>
          <ModalBody>
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
                  <Input
                    type="textarea"
                    value={paymentRequest}
                    rows={4}
                    readOnly
                    style={{ marginBottom: 10 }}
                  />
                  <a href={`lightning:${paymentRequest}`}>
                    <Button color="primary" block>
                      {t('react-webln-fallback.send.open')}
                    </Button>
                  </a>
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
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleReject}>
              {t('react-webln-fallback.common.cancel')}
            </Button>
          </ModalFooter>
        </>
      )
    }

    return (
      <Modal onClosed={onHide} backdrop={noEasyClose ? 'static' : true} isOpen>
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
