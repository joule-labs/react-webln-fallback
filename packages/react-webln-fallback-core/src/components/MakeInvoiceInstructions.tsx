import React from 'react';
import i18next from 'i18next';
import { WebLNProvider, RequestInvoiceArgs } from 'webln';
import { MethodComponentProps } from '../types';

function isInvoiceArgsObject(args: any): args is RequestInvoiceArgs {
  return !(args instanceof String || args instanceof Number);
}

interface Props {
  args: Parameters<WebLNProvider["makeInvoice"]>[0];
  t: MethodComponentProps['t'];
}

// Renders a simple string for fixed amount invoices, or a bullet list for
// invoices with complex requirements (min, max, memo)
export class MakeInvoiceInstructions extends React.Component<Props> {
  render() {
    const { args, t } = this.props;
    const unit = t('react-webln-fallback.common.unit');
    let fixedAmount: string = '';
    let requirements: React.ReactNode[] = [];

    if (isInvoiceArgsObject(args)) {
      if (args.minimumAmount !== undefined) {
        const html = t('react-webln-fallback.invoice.minimumAmount', {
          unit,
          amount: args.minimumAmount,
        });
        requirements.push(<span dangerouslySetInnerHTML={{ __html: html }} />);
      }
      if (args.maximumAmount !== undefined) {
        const html = t('react-webln-fallback.invoice.maximumAmount', {
          unit,
          amount: args.maximumAmount,
        });
        requirements.push(<span dangerouslySetInnerHTML={{ __html: html }} />);
      }
      if (args.defaultMemo) {
        const html = t('react-webln-fallback.invoice.memo', {
          unit,
          memo: args.defaultMemo,
        });
        requirements.push(<span dangerouslySetInnerHTML={{ __html: html }} />);
      }

      if (args.amount) {
        if (!requirements.length) {
          fixedAmount = args.amount.toString();
        } else {
          const html = t('react-webln-fallback.invoice.minimumAmount', {
            unit,
            amount: args.minimumAmount,
          });
          requirements.push(<span dangerouslySetInnerHTML={{ __html: html }} />);
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
      const html = t('react-webln-fallback.invoice.minimumAmount', {
        unit,
        amount: fixedAmount,
      });
      return <p dangerouslySetInnerHTML={{ __html: html }} />;
    }
  }
};
