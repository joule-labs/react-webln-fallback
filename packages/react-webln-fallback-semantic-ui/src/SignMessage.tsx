import React from 'react';
import { Modal, Button, TextArea, Divider, Form } from 'semantic-ui-react';
import { MethodComponentProps, WebLNMethod, parseSignatureFromInput } from 'react-webln-fallback-core';
import { WebLNProvider, SignMessageResponse } from 'webln';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps;

interface State {
  signature: string;
}

export default class SignMessage extends React.PureComponent<Props, State> {
  state: State = {
    signature: '',
  };

  render() {
    const { args, t } = this.props;
    const { signature } = this.state;

    return (
      <Modal open size="small" closeOnDimmerClick={false} onClose={this.handleReject}>
        <Modal.Header>{t('react-webln-fallback.sign.title')}</Modal.Header>
        <Modal.Content>
          <p>
            {t('react-webln-fallback.sign.instructions')}
          </p>
          <CLIHelp method={WebLNMethod.signMessage} args={args} t={t} />
          <Divider section />
          <Form as="div">
            <TextArea
              label={t('react-webln-fallback.sign.label')}
              rows={5}
              value={signature}
              onChange={this.handleChange}
              placeholder={t('react-webln-fallback.sign.placeholder')}
              fluid
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleReject}>
            {t('react-webln-fallback.common.cancel')}
          </Button>
          <Button onClick={this.handleApprove} primary disabled={!signature}>
            {t('react-webln-fallback.common.submit')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private handleChange = (_: any, data: any) => {
    this.setState({ signature: data.value });
  };

  private handleApprove = () => {
    const [message] = this.props.args as Parameters<WebLNProvider['signMessage']>;
    const signature = parseSignatureFromInput(this.state.signature);
    this.props.onApprove({ message, signature } as SignMessageResponse);
  };

  private handleReject = () => {
    this.props.onReject(this.props.t('react-webln-fallback.sign.reject'));
  };
}
