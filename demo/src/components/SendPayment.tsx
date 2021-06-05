import React from "react";
import { Form, Button, Input, message, Checkbox } from "antd";
import { requestProvider } from "webln";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

interface Props {
  paymentComplete(preimage: string): void;
}

interface State {
  paymentRequest: string;
  callPaymentComplete: boolean;
}

export default class SendPayment extends React.PureComponent<Props, State> {
  state: State = {
    paymentRequest: "",
    callPaymentComplete: true,
  };

  render() {
    const { paymentRequest, callPaymentComplete } = this.state;

    return (
      <Form onSubmitCapture={this.handleSubmit} layout="vertical">
        <Form.Item label="Payment Request (Bolt-11)">
          <Input.TextArea
            onChange={this.handlePaymentRequestChange}
            value={paymentRequest}
            rows={5}
          />
        </Form.Item>
        <Checkbox checked={callPaymentComplete} onChange={this.handleCheckboxChange}>
          Automatically call <code>paymentComplete</code> after 3s
        </Checkbox>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          disabled={!paymentRequest}
          block
        >
          Call <code>webln.sendPayment</code>
        </Button>
      </Form>
    );
  }

  private handlePaymentRequestChange = (
    ev: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({ paymentRequest: ev.target.value });
  };

  private handleCheckboxChange = (ev: CheckboxChangeEvent) => {
    this.setState({ callPaymentComplete: ev.target.checked });
  };

  private handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      const webln = await requestProvider();
      if (this.state.callPaymentComplete) {
        setTimeout(() => this.props.paymentComplete('123'), 3000);
      }
      await webln.sendPayment(this.state.paymentRequest);
      message.success("Payment succeeded!");
    } catch (err) {
      message.error(err.message, 3);
    }
  };
}
