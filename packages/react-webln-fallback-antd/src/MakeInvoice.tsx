import React from 'react';
import { Modal, Input, Divider } from 'antd';
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
      <Modal
        title="Provide an Invoice"
        onOk={this.handleApprove}
        onCancel={this.handleReject}
        okText="Submit invoice"
        okButtonDisabled={!paymentRequest}
        maskClosable={false}
        visible
      >
        <MakeInvoiceInstructions args={invoiceReqs} />
        <Input.TextArea
          rows={5}
          value={paymentRequest}
          onChange={this.handleChange}
          placeholder="lnbc5m1pw22r79pp5ghj74332mwfycdzafl0x2f..."
        />
        <Divider />
        <CLIHelp method={WebLNMethod.makeInvoice} args={args} />
      </Modal>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ paymentRequest: ev.target.value });
  };

  private handleApprove = () => {
    this.props.onApprove({ paymentRequest: '' } as RequestInvoiceResponse);
  };

  private handleReject = () => {
    this.props.onReject('Payment closed before sending');
  };
}
