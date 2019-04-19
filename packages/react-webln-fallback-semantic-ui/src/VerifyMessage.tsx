import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback-core';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps & WithTranslation;

class VerifyMessage extends React.PureComponent<Props> {
  render() {
    const { args, t } = this.props;

    return (
      <Modal open size="small" closeOnDimmerClick={false} onClose={this.handleApprove}>
        <Modal.Header>Verify message</Modal.Header>
        <Modal.Content>
          <p>
            {t('react-webln-fallback.verify.instructions')}
          </p>
          <CLIHelp method={WebLNMethod.verifyMessage} args={args} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleApprove} primary>
          {t('react-webln-fallback.common.ok')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private handleApprove = () => {
    this.props.onApprove(null);
  };
}

export default withTranslation()(VerifyMessage);
