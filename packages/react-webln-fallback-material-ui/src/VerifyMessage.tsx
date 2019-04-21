import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback-core';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps;

export default class VerifyMessage extends React.PureComponent<Props> {
  render() {
    const { args, t } = this.props;

    return (
      <Dialog open disableBackdropClick onClose={this.handleApprove}>
        <DialogTitle>Verify message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('react-webln-fallback.verify.instructions')}
          </DialogContentText>
          <div style={{ marginBottom: 10 }} />
          <CLIHelp method={WebLNMethod.verifyMessage} args={args} t={t} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleApprove} color="primary">
          {t('react-webln-fallback.common.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private handleApprove = () => {
    this.props.onApprove(null);
  };
}
