import React from 'react';
import { Form, Button, Input, Row, Col, message } from 'antd';
import { requestProvider } from 'webln';

interface State {
  message: string;
  signature: string;
}

export default class VerifyMessage extends React.PureComponent<{}, State> {
  state: State = {
    message: '',
    signature: '',
  };

  render() {
    const { message, signature } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} layout="vertical">
        <Row gutter={20}>
          <Col xs={24} sm={12}>
            <Form.Item label="Message">
              <Input.TextArea
                name="message"
                placeholder="Enter a message"
                onChange={this.handleChange}
                value={message}
                rows={5}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Signature">
              <Input.TextArea
                name="signature"
                placeholder="Signature will show up here"
                onChange={this.handleChange}
                value={signature}
                rows={5}
              />
            </Form.Item>
          </Col>
        </Row>
        <Button size="large" type="primary" htmlType="submit" disabled={!message} block>
          Call <code>webln.verifyMessage</code>
        </Button>
      </Form>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ [ev.target.name]: ev.target.value } as any);
  };

  private handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      const webln = await requestProvider();
      await webln.verifyMessage(this.state.signature, this.state.message);
    } catch(err) {
      message.error(err.message, 3);
    }
  };
}
