import React from 'react';
import { Form, Button, Input, Row, Col, message } from 'antd';
import { requestProvider } from 'webln';

interface State {
  message: string;
  signature: string;
}

export default class SignMessage extends React.PureComponent<{}, State> {
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
                placeholder="Signature will show up here"
                disabled
                value={signature}
                rows={5}
              />
            </Form.Item>
          </Col>
        </Row>
        <Button size="large" type="primary" htmlType="submit" disabled={!message} block>
          Call <code>webln.signMessage</code>
        </Button>
      </Form>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ message: ev.target.value });
  };

  private handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      const webln = await requestProvider();
      const res = await webln.signMessage(this.state.message);
      this.setState(res);
      message.success('Signature succeeded!');
    } catch(err) {
      message.error(err.message, 3);
    }
  };
}
