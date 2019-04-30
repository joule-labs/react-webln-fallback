// =======================================================================
// Set of utilities centered around providing CLI instruction for commands
// =======================================================================

import { RequestInvoiceArgs } from 'webln';
import { WebLNMethod } from '../types';

export enum NodeType {
  LND = 'LND',
  C_LIGHTNING = 'C_LIGHTNING',
  ECLAIR = 'ECLAIR',
}

interface NodeInfo {
  name: string;
  cli: string;
  commands: {
    [key in WebLNMethod]: ((args: any) => string) | false
  };
}

const cliEscape = (str: string) => (
  str.replace(/"/g, '\\"')
  .replace(/\!/g, '\\!')
);

const normalizeInvoiceArgs = (args: number | string | RequestInvoiceArgs): RequestInvoiceArgs => {
  if (typeof args === 'number' || typeof args === 'string') {
    return { amount: args };
  }
  return args;
};

const makeArgsString = (args: object) => (
  Object.entries(args).map(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return false;
    }
    if (typeof value === 'string' && value.includes(' ')) {
      return `--${key} "${cliEscape(value)}"`;
    }
    return `--${key} ${value}`;
  })
  .filter(arg => !!arg)
  .join(' ')
);

export const nodeInfo: { [key in NodeType]: NodeInfo } = {
  [NodeType.LND]: {
    name: 'LND',
    cli: 'lncli',
    commands: {
      [WebLNMethod.getInfo]: () => 'getinfo',
      [WebLNMethod.sendPayment]: (args: any) => `sendpayment ${args[0]}`,
      [WebLNMethod.makeInvoice]: (rawArgs: any) => {
        const args = normalizeInvoiceArgs(rawArgs[0]);
        const cliArgs = {
          amt: args.amount || args.defaultAmount,
          memo: args.defaultMemo,
        };
        return `addinvoice ${makeArgsString(cliArgs)}`;
      },
      [WebLNMethod.signMessage]: (args: any) => `signmessage "${cliEscape(args[0])}"`,
      [WebLNMethod.verifyMessage]: (args: any) => (
        `verifymessage --sig ${args[0]} --msg="${cliEscape(args[1])}"`
      ),
    },
  },
  [NodeType.C_LIGHTNING]: {
    name: 'C-Lightning',
    cli: 'lightning-cli',
    commands: {
      [WebLNMethod.getInfo]: () => 'getinfo',
      [WebLNMethod.sendPayment]: (args: any) => `sendpayment ${args[0]}`,
      [WebLNMethod.makeInvoice]: (rawArgs: any) => {
        const args = normalizeInvoiceArgs(rawArgs[0]);
        return `invoice ${args.amount || args.defaultAmount || '[sats]'} [label] '${args.defaultMemo || 'description'}'`;
      },
      [WebLNMethod.signMessage]: false,
      [WebLNMethod.verifyMessage]: false,
    },
  },
  [NodeType.ECLAIR]: {
    name: 'Eclair',
    cli: 'eclair-cli',
    commands: {
      [WebLNMethod.getInfo]: () => 'getinfo',
      [WebLNMethod.sendPayment]: (args: any) => `send ${args[0]}`,
      [WebLNMethod.makeInvoice]: (rawArgs: any) => {
        const args = normalizeInvoiceArgs(rawArgs[0]);
        const amt = args.amount || args.defaultAmount;
        const cliArgs = {
          amountMsat: amt ? parseInt(amt as string, 10) * 1000 : null,
          description: args.defaultMemo,
        };
        return `createinvoice ${makeArgsString(cliArgs)}`;
      },
      [WebLNMethod.signMessage]: false,
      [WebLNMethod.verifyMessage]: false,
    },
  },
}

export function getCliCommand(nodeType: NodeType, method: WebLNMethod, args: any) {
  const getCmd = nodeInfo[nodeType].commands[method];
  if (getCmd) {
    return `${nodeInfo[nodeType].cli} ${getCmd(args)}`;
  } else {
    return null;
  }
}
