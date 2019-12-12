import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Button } from 'reactstrap';
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
      <Modal onClosed={this.handleReject} backdrop="static" isOpen>
        <ModalHeader toggle={this.handleReject}>
          {t('react-webln-fallback.invoice.title')}
        </ModalHeader>
        <ModalBody>
          <MakeInvoiceInstructions args={invoiceReqs} t={t} />
          <Input
            type="textarea"
            rows={5}
            value={paymentRequest}
            onChange={this.handleChange}
            placeholder="lnbc5m1pw22r79pp5ghj74332mwfycdzafl0x2f..."
          />
          <div className="mt-2">
            <CLIHelp method={WebLNMethod.makeInvoice} args={args} t={t} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.handleReject}>
            {t('react-webln-fallback.common.cancel')}
          </Button>
          <Button color="primary" onClick={this.handleApprove} disabled={!paymentRequest}>
            {t('react-webln-fallback.common.submit')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ paymentRequest: ev.target.value });
  };

  private handleApprove = () => {
    this.props.onApprove({ paymentRequest: this.state.paymentRequest } as RequestInvoiceResponse);
  };

  private handleReject = () => {
    this.props.onReject(this.props.t('react-webln-fallback.invoice.reject'));
  };
}
