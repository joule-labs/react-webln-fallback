import React from 'react';
import { Row, Col, Form, Input, Radio, Button, message } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { requestProvider } from 'webln';
import './MakeInvoice.less';

export interface FormState {
  amount: string;
  defaultAmount: string;
  minimumAmount: string;
  maximumAmount: string;
  defaultMemo: string;
}

interface State {
  form: FormState;
  amountType: string;
  paymentRequest: string;
}

export default class MakeInvoice extends React.PureComponent<{}, State> {
  state: State = {
    form: {
      amount: '',
      defaultAmount: '',
      minimumAmount: '100',
      maximumAmount: '1000',
      defaultMemo: 'React WebLN Fallback is cool',
    },
    amountType: 'dynamic',
    paymentRequest: '',
  };

  render() {
    const { amountType, form, paymentRequest } = this.state;
    
    let amountInputs;
    if (amountType === 'fixed') {
      amountInputs = (
        <Form.Item label="Amount">
          <Input
            name="amount"
            type="number"
            value={form.amount}
            onChange={this.handleInput}
          />
        </Form.Item>
      );
    } else {
      amountInputs = (
        <>
          <Form.Item label="Default">
            <Input
              name="defaultAmount"
              type="number"
              value={form.defaultAmount}
              onChange={this.handleInput}
            />
          </Form.Item>
          <Form.Item label="Min">
            <Input
              name="minimumAmount"
              type="number"
              value={form.minimumAmount}
              onChange={this.handleInput}
            />
          </Form.Item>
          <Form.Item label="Max">
            <Input
              name="maximumAmount"
              type="number"
              value={form.maximumAmount}
              onChange={this.handleInput}
            />
          </Form.Item>
        </>
      );
    }

    return (
      <Row gutter={20}>
        <Col xs={24} sm={12}>
          <Form className="MakeInvoice-form" layout="vertical" onSubmitCapture={this.handleSubmit}>
            <div className="MakeInvoice-form-amounts">
              <div className="MakeInvoice-form-amounts-toggle">
                <Radio.Group
                  value={amountType}
                  onChange={this.handleChangeAmountType}
                >
                  <Radio.Button value="dynamic">Dynamic values</Radio.Button>
                  <Radio.Button value="fixed">Fixed value</Radio.Button>
                </Radio.Group>
              </div>
              {amountInputs}
            </div>
            <Form.Item label="Default memo">
              <Input.TextArea
                name="defaultMemo"
                value={form.defaultMemo}
                onChange={this.handleInput}
              />
            </Form.Item>

            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
            >
              Call <code>webln.makeInvoice</code>
            </Button>
          </Form>
        </Col>
        <Col xs={24} sm={12}>
          <Form layout="vertical" className="MakeInvoice-pr">
            <Form.Item label="Payment Request">
              <Input.TextArea value={paymentRequest} disabled rows={10} />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  }

  private handleInput = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const form = {
      ...this.state.form,
      [ev.target.name]: ev.target.value,
    };
    this.setState({ form });
  };

  private handleChangeAmountType = (ev: RadioChangeEvent) => {
    const { value } = ev.target;
    const form = { ...this.state.form };
    if (value === 'fixed') {
      form.defaultAmount = '';
      form.minimumAmount = '';
      form.maximumAmount = '';
    } else {
      form.amount = '';
    }
    this.setState({
      form,
      amountType: value,
    });
  };

  private handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    this.setState({ paymentRequest: '' });
    try {
      const webln = await requestProvider();
      const res = await webln.makeInvoice(this.state.form);
      this.setState({ paymentRequest: res.paymentRequest });
      message.success('Received invoice!');
    } catch(err) {
      message.error(err.message, 3);
    }
  };
}
