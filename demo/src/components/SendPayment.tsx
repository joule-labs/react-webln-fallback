import React from 'react';
import { Form, Button, Input, message } from 'antd';
import { requestProvider } from 'webln';

interface State {
  paymentRequest: string;
}

export default class SendPayment extends React.PureComponent<{}, State> {
  state: State = {
    paymentRequest: '',
  };

  render() {
    const { paymentRequest } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} layout="vertical">
        <Form.Item label="Payment Request (Bolt-11)">
          <Input.TextArea onChange={this.handleChange} value={paymentRequest} rows={5} />
        </Form.Item>
        <Button size="large" type="primary" htmlType="submit" disabled={!paymentRequest} block>
          Call <code>webln.sendPayment</code>
        </Button>
      </Form>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ paymentRequest: ev.target.value });
  };

  private handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      const webln = await requestProvider();
      await webln.sendPayment(this.state.paymentRequest);
      message.success('Payment succeeded!');
    } catch(err) {
      message.error(err.message, 3);
    }
  };
}
