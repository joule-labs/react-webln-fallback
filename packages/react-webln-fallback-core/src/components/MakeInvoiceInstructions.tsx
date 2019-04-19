import React from 'react';
import { WebLNProvider, RequestInvoiceArgs } from 'webln';
import { withTranslation, WithTranslation, Trans } from 'react-i18next';

function isInvoiceArgsObject(args: any): args is RequestInvoiceArgs {
  return !(args instanceof String || args instanceof Number);
}

interface Props {
  args: Parameters<WebLNProvider["makeInvoice"]>[0];
}

// Renders a simple string for fixed amount invoices, or a bullet list for
// invoices with complex requirements (min, max, memo)
class MakeInvoiceInstructionsComponent extends React.Component<Props & WithTranslation> {
  render() {
    const { args, t } = this.props;
    const unit = t('react-webln-fallback.common.unit');
    let fixedAmount: string = '';
    let requirements: React.ReactNode[] = [];

    if (isInvoiceArgsObject(args)) {
      if (args.minimumAmount !== undefined) {
        const amount = args.minimumAmount;
        requirements.push(
          <Trans i18nKey="react-webln-fallback.invoice.minimumAmount">
            A minimum amount of <strong>{{amount: args.minimumAmount}} {{unit}}</strong>
          </Trans>
        );
      }
      if (args.maximumAmount !== undefined) {
        
        requirements.push(
          <Trans i18nKey="react-webln-fallback.invoice.maximumAmount">
            A maximum amount of <strong>{{amount: args.maximumAmount}} {{unit}}</strong>
          </Trans>
        );
      }
      if (args.defaultMemo) {
        requirements.push(
          <Trans i18nKey="react-webln-fallback.invoice.memo">
            A memo of <strong>"{{memo: args.defaultMemo}}"</strong>
          </Trans>
        );
      }

      if (args.amount) {
        if (!requirements.length) {
          fixedAmount = args.amount.toString();
        } else {
          requirements.unshift(
            <Trans i18nKey="react-webln-fallback.invoice.minimumAmount">
              An amount of <strong>{{amount: args.amount}} {{unit}}</strong>
            </Trans>
          );
        }
      }
    }
    else {
      fixedAmount = args.toString();
    }

    if (requirements.length) {
      return (
        <>
          <p>{t('react-webln-fallback.invoice.instructionsMultiple')}</p>
          <ul>{requirements.map((r, idx) => <li key={idx}>{r}</li>)}</ul>
        </>
      )
    }
    else {
      return (
        <Trans i18nKey="react-webln-fallback.invoice.instructionsFixed">
          Please provide an invoice for <strong>{{amount: fixedAmount}} {{unit}}</strong>
        </Trans>
      );
    }
  }
};

export const MakeInvoiceInstructions = withTranslation()(MakeInvoiceInstructionsComponent);
