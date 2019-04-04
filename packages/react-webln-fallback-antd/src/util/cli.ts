export enum Command {
  SEND = 'SEND',
  INVOICE = 'INVOICE',
  SIGN = 'SIGN',
  VERIFY = 'VERIFY',
};

export enum NodeType {
  LND = 'LND',
  C_LIGHTNING = 'C_LIGHTNING',
  ECLAIR = 'ECLAIR',
}

interface NodeInfo {
  name: string;
  cli: string;
  commands: { [key in Command]: ((args: any) => string) | false };
}

const cliEscape = (str: str) => (
  str.replace(/"/g, '\\"')
  .replace(/\!/g, '\\!')
);

export const nodeInfo: { [key in NodeType]: NodeInfo } = {
  [NodeType.LND]: {
    name: 'LND',
    cli: 'lncli',
    commands: {
      [Command.SEND]: (args: any) => `sendpayment ${args[0]}`,
      [Command.INVOICE]: (_: any) => 'addinvoice',
      [Command.SIGN]: (args: any) => `signmessage "${cliEscape(args[0])}"`,
      [Command.VERIFY]: (args: any) => (
        `verifymessage --sig ${args[0]} --msg="${cliEscape(args[1])}"`
      ),
    },
  },
  [NodeType.C_LIGHTNING]: {
    name: 'C-Lightning',
    cli: 'lightning-cli',
    commands: {
      [Command.SEND]: (args: any) => `sendpayment ${args[0]}`,
      [Command.INVOICE]: (_: any) => 'addinvoice',
      [Command.SIGN]: false,
      [Command.VERIFY]: false,
    },
  },
  [NodeType.ECLAIR]: {
    name: 'Eclair',
    cli: 'eclair-cli',
    commands: {
      [Command.SEND]: (args: any) => `send ${args[0]}`,
      [Command.INVOICE]: (_: any) => 'receive',
      [Command.SIGN]: false,
      [Command.VERIFY]: false,
    },
  },
}

export function getCliCommand(nodeType: NodeType, command: Command, args: any) {
  const getCmd = nodeInfo[nodeType].commands[command];
  if (getCmd) {
    return `${nodeInfo[nodeType].cli} ${getCmd(args)}`;
  } else {
    return null;
  }
}
