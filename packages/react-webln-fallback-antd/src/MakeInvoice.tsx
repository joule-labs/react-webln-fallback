import React from 'react';
import { Modal, Input, Divider } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import { MethodComponentProps, MakeInvoiceInstructions, WebLNMethod } from 'react-webln-fallback-core';
import { WebLNProvider, RequestInvoiceResponse } from 'webln';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps & WithTranslation;

interface State {
  paymentRequest: string;
}

class MakeInvoice extends React.PureComponent<Props, State> {
  state: State = {
    paymentRequest: '',
  };

  render() {
    const { args, t, i18n } = this.props;
    const { paymentRequest } = this.state;
    const [invoiceReqs] = args as Parameters<WebLNProvider['makeInvoice']>;

    console.log({ t, i18n });

    return (
      <Modal
        title={t('react-webln-fallback.invoice.title')}
        okText={t('react-webln-fallback.common.submit')}
        cancelText={t('react-webln-fallback.common.cancel')}
        onOk={this.handleApprove}
        onCancel={this.handleReject}
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
    this.props.onReject(this.props.t('react-webln-fallback.invoice.reject'));
  };
}

export default withTranslation()(MakeInvoice);
