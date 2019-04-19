// =======================================================================
// Set of utilities centered around providing CLI instruction for commands
// =======================================================================

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

export const nodeInfo: { [key in NodeType]: NodeInfo } = {
  [NodeType.LND]: {
    name: 'LND',
    cli: 'lncli',
    commands: {
      [WebLNMethod.getInfo]: () => 'getinfo',
      [WebLNMethod.sendPayment]: (args: any) => `sendpayment ${args[0]}`,
      [WebLNMethod.makeInvoice]: (_: any) => 'addinvoice',
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
      [WebLNMethod.makeInvoice]: (_: any) => 'addinvoice',
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
      [WebLNMethod.makeInvoice]: (_: any) => 'receive',
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
