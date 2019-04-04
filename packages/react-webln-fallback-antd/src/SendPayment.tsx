import React from 'react';
import { Modal, Row, Col, Input, Button, Icon, Divider } from 'antd';
import { MethodComponentProps } from 'react-webln-fallback';
import { WebLNProvider, SendPaymentResponse } from 'webln';
import DefaultQRCode, { QRCodeProps } from 'qrcode.react';
import CLIHelp from './CLIHelp';
import { Command } from './util/cli';

// Add SVG types to QRCode since it passes them through
const QRCode = DefaultQRCode as React.ComponentClass<QRCodeProps & React.HTMLProps<SVGElement>>;

type Props = MethodComponentProps;

export default class SendPayment extends React.PureComponent<Props> {
  render() {
    const { args } = this.props;
    const [paymentRequest] = args as Parameters<WebLNProvider['sendPayment']>;

    return (
      <Modal
        title="Send Payment"
        onOk={this.handleApprove}
        onCancel={this.handleReject}
        maskClosable={false}
        visible
      >
        <Row type="flex" gutter={20} align="middle" justify="center">
          <Col xs={24} sm={9}>
            <div style={{ padding: '10px', borderRadius: 4, border: '1px solid rgba(0, 0, 0, 0.1)' }}>
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
              <Icon type="thunderbolt" theme="filled" /> Open in Wallet
            </Button>
          </Col>
        </Row>
        <Divider>or</Divider>
        <CLIHelp command={Command.SEND} args={args} />
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
