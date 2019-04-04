import React from 'react';
import { Modal, Input, Divider } from 'antd';
import { MethodComponentProps } from 'react-webln-fallback';
import { WebLNProvider, RequestInvoiceResponse, RequestInvoiceArgs } from 'webln';
import CLIHelp from './CLIHelp';
import { Command } from './util/cli';

function isInvoiceArgsObject(args: any): args is RequestInvoiceArgs {
  return !(args instanceof String || args instanceof Number);
}

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
        {this.renderInstructions()}
        <Input.TextArea
          rows={5}
          value={paymentRequest}
          onChange={this.handleChange}
          placeholder="lnbc5m1pw22r79pp5ghj74332mwfycdzafl0x2f..."
        />
        <Divider />
        <CLIHelp command={Command.INVOICE} args={args} />
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

  // Renders a simple string for fixed amount invoices, or a bullet list for
  // invoices with complex requirements (min, max, memo)
  private renderInstructions = () => {
    const [invoiceReqs] = this.props.args as Parameters<WebLNProvider['makeInvoice']>;
    let fixedAmount: string = '';
    let requirements: React.ReactNode[] = [];

    if (isInvoiceArgsObject(invoiceReqs)) {
      if (invoiceReqs.minimumAmount) {
        requirements.push(<>A minimum of <strong>{invoiceReqs.minimumAmount} satoshis</strong></>);
      }
      if (invoiceReqs.maximumAmount) {
        requirements.push(<>A maximum of <strong>{invoiceReqs.maximumAmount} satoshis</strong></>);
      }
      if (invoiceReqs.defaultMemo) {
        requirements.push(<>A memo of <strong>"{invoiceReqs.defaultMemo}"</strong></>);
      }

      if (invoiceReqs.amount) {
        if (!requirements.length) {
          fixedAmount = invoiceReqs.amount.toString();
        } else {
          requirements.unshift(`An amount of ${invoiceReqs.amount} satoshis`);
        }
      }
    }
    else {
      fixedAmount = invoiceReqs.toString();
    }

    if (requirements.length) {
      return (
        <>
          <p>Please provide an invoice that meets the following requirements:</p>
          <ul>{requirements.map((r, idx) => <li key={idx}>{r}</li>)}</ul>
        </>
      )
    }
    else {
      return <>Please provide an invoice for <strong>{fixedAmount} satoshis</strong>:</>
    }
  };

  private getError = () => {
    
  };
}
