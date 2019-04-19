import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withTranslation, WithTranslation } from 'react-i18next';
import { MethodComponentProps, WebLNMethod, parseSignatureFromInput } from 'react-webln-fallback-core';
import { WebLNProvider, SignMessageResponse } from 'webln';
import CLIHelp from './CLIHelp';

type Props = MethodComponentProps & WithTranslation;

interface State {
  signature: string;
}

class SignMessage extends React.PureComponent<Props, State> {
  state: State = {
    signature: '',
  };

  render() {
    const { args, t } = this.props;
    const { signature } = this.state;

    return (
      <Dialog open disableBackdropClick onClose={this.handleReject}>
        <DialogTitle>{t('react-webln-fallback.sign.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('react-webln-fallback.sign.instructions')}
          </DialogContentText>
          <div style={{ marginBottom: 10 }} />
          <CLIHelp method={WebLNMethod.signMessage} args={args} />
          <div style={{ marginBottom: 20 }} />
          <TextField
            label={t('react-webln-fallback.sign.label')}
            variant="outlined"
            fullWidth
            multiline
            rows={5}
            value={signature}
            onChange={this.handleChange}
            placeholder={t('react-webln-fallback.sign.placeholder')}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleReject}>
            {t('react-webln-fallback.common.cancel')}
          </Button>
          <Button onClick={this.handleApprove} color="primary" disabled={!signature}>
            {t('react-webln-fallback.common.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private handleChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ signature: ev.target.value });
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

export default withTranslation()(SignMessage);
