import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import green from '@material-ui/core/colors/green';
import { MethodComponentProps, WebLNMethod } from 'react-webln-fallback-core';
import { WebLNProvider, SendPaymentResponse } from 'webln';
import DefaultQRCode, { QRCodeProps } from 'qrcode.react';
import CLIHelp from './CLIHelp';

// Add SVG types to QRCode since it passes them through
const QRCode = DefaultQRCode as React.ComponentClass<QRCodeProps & React.HTMLProps<SVGElement>>;

type Props = MethodComponentProps;

export default class SendPayment extends React.PureComponent<Props> {
  render() {
    const { args, t, paymentPreimage } = this.props;
    const [paymentRequest] = args as Parameters<WebLNProvider['sendPayment']>;

    let content;
    let onClose;
    let noEasyClose;
    if (paymentPreimage) {
      onClose = this.handleApprove;
      content = (
        <DialogContent>
          <div style={{ textAlign: 'center' }}>
            <CheckIcon style={{ color: green[400], fontSize: '6rem' }} />
            <Typography variant="h5" style={{ marginTop: 20, marginBottom: 20 }}>
              {t('react-webln-fallback.send.success')}
            </Typography>
            <Button color="primary" size="large" onClick={this.handleApprove}>
              {t('react-webln-fallback.common.continue')}
            </Button>
          </div>
        </DialogContent>
      );
    } else {
      onClose = this.handleReject;
      noEasyClose = true;
      content = (
        <>
          <DialogTitle>{t('react-webln-fallback.send.title')}</DialogTitle>
          <DialogContent>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={5}>
                <Paper elevation={1}>
                  <div style={{ padding: 10 }}>
                    <QRCode
                      value={paymentRequest.toUpperCase()}
                      style={{ display: 'block', width: '100%', height: 'auto' }}
                    />
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={7}>
                <div style={{ paddingTop: 7 }} />
                <TextField
                  label="Payment request"
                  value={paymentRequest}
                  variant="outlined"
                  rows={5}
                  multiline 
                  fullWidth
                  disabled  
                />
                <div style={{ marginTop: 10 }} />
                <Button
                  href={`lightning:${paymentRequest}`}
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  {t('react-webln-fallback.send.open')}
                </Button>
              </Grid>
            </Grid>
            <div style={{ marginTop: 20 }} />
            <CLIHelp method={WebLNMethod.sendPayment} args={args} t={t} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleReject}>
              {t('react-webln-fallback.common.cancel')}
            </Button>
            <Button onClick={this.handleApprove} color="primary">
              {t('react-webln-fallback.common.submit')}
            </Button>
          </DialogActions>
        </>
      );
    }

    return (
      <Dialog open disableBackdropClick={noEasyClose} onClose={onClose}>
        {content}
      </Dialog>
    );
  }

  private handleApprove = () => {
    const { onApprove, paymentPreimage } = this.props;
    onApprove({ preimage: paymentPreimage } as SendPaymentResponse);
  };

  private handleReject = () => {
    const { onReject, t } = this.props;
    onReject(t('react-webln-fallback.send.reject'));
  };
}
