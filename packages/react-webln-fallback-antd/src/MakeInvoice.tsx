import React from 'react';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import Divider from 'antd/lib/divider';
import { MethodComponentProps, MakeInvoiceInstructions, WebLNMethod } from 'react-webln-fallback-core';
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
    const { args, t } = this.props;
    const { paymentRequest } = this.state;
    const [invoiceReqs] = args as Parameters<WebLNProvider['makeInvoice']>;

    return (
      <Modal
        title={t('react-webln-fallback.invoice.title')}
        okText={t('react-webln-fallback.common.submit')}
        cancelText={t('react-webln-fallback.common.cancel')}
        onOk={this.handleApprove}
        onCancel={this.handleReject}
        okButtonProps={{ disabled: !paymentRequest }}
        maskClosable={false}
        visible
      >
        <MakeInvoiceInstructions args={invoiceReqs} t={t} />
        <Input.TextArea
          rows={5}
          value={paymentRequest}
          onChange={this.handleChange}
          placeholder="lnbc5m1pw22r79pp5ghj74332mwfycdzafl0x2f..."
        />
        <Divider />
        <CLIHelp method={WebLNMethod.makeInvoice} args={args} t={t} />
      </Modal>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ paymentRequest: ev.target.value });
  };

  private handleApprove = () => {
    this.props.onApprove({ paymentRequest: this.state.paymentRequest } as RequestInvoiceResponse);
  };

  private handleReject = () => {
    this.props.onReject(this.props.t('react-webln-fallback.invoice.reject'));
  };
}
