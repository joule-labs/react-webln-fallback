import React from 'react';
import Modal from 'antd/lib/modal';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Result from 'antd/lib/result';
import Divider from 'antd/lib/divider';
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
    let footer;
    let onCancel;
    let noEasyClose;
    if (paymentPreimage) {
      footer = null;
      onCancel = this.handleApprove;
      content = (
        <div style={{ textAlign: 'center' }}>
          <Result
            status="success"
            title={t('react-webln-fallback.send.success')}
            extra={[
              <Button
                key="continue"
                type="primary"
                size="large"
                onClick={this.handleApprove}
              >
                {t('react-webln-fallback.common.continue')}
              </Button>
            ]}
          />
        </div>
      );
    } else {
      onCancel = this.handleReject;
      noEasyClose = true;
      content = (
        <>
          <Row gutter={20} align="middle" justify="center">
            <Col xs={24} sm={9}>
              <div style={{
                padding: 10,
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
            <Col xs={24} sm={15}>
              <Input.TextArea
                value={paymentRequest}
                rows={5}
                style={{ marginBottom: '10px' }}
                readOnly
              />
              <Button href={`lightning:${paymentRequest}`} type="primary" block>
                {t('react-webln-fallback.send.open')}
              </Button>
            </Col>
          </Row>
          <Divider>{t('react-webln-fallback.common.or')}</Divider>
          <CLIHelp method={WebLNMethod.sendPayment} args={args} t={t} />
        </>
      );
    }

    return (
      <Modal
        title={t('react-webln-fallback.send.title')}
        cancelText={t('react-webln-fallback.common.cancel')}
        onCancel={onCancel}
        okButtonProps={{ style: { display: 'none' } }}
        footer={footer}
        maskClosable={!noEasyClose}
        visible
      >
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
