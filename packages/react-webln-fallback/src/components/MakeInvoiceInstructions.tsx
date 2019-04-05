import React from 'react';
import { WebLNProvider, RequestInvoiceArgs } from 'webln';

function isInvoiceArgsObject(args: any): args is RequestInvoiceArgs {
  return !(args instanceof String || args instanceof Number);
}

interface Props {
  args: Parameters<WebLNProvider["makeInvoice"]>[0];
}

// Renders a simple string for fixed amount invoices, or a bullet list for
// invoices with complex requirements (min, max, memo)
export const MakeInvoiceInstructions: React.SFC<Props> = ({ args }) => {
  let fixedAmount: string = '';
  let requirements: React.ReactNode[] = [];

  if (isInvoiceArgsObject(args)) {
    if (args.minimumAmount) {
      requirements.push(<>A minimum of <strong>{args.minimumAmount} satoshis</strong></>);
    }
    if (args.maximumAmount) {
      requirements.push(<>A maximum of <strong>{args.maximumAmount} satoshis</strong></>);
    }
    if (args.defaultMemo) {
      requirements.push(<>A memo of <strong>"{args.defaultMemo}"</strong></>);
    }

    if (args.amount) {
      if (!requirements.length) {
        fixedAmount = args.amount.toString();
      } else {
        requirements.unshift(`An amount of ${args.amount} satoshis`);
      }
    }
  }
  else {
    fixedAmount = args.toString();
  }

  if (requirements.length) {
    return (
      <>
        <p>Please provide an invoice that meets the following requirements:</p>
        <ul>{requirements.map((r, idx) => <li key={idx}>{r}</li>)}</ul>
      </>
    )
  }
  else {
    return <>Please provide an invoice for <strong>{fixedAmount} satoshis</strong>:</>
  }
};
