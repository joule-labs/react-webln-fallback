import React from 'react';
import { Input, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

export enum Command {
  SEND = 'SEND',
  INVOICE = 'INVOICE',
  SIGN = 'SIGN',
  VERIFY = 'VERIFY',
};

enum NodeType {
  LND = 'LND',
  C_LIGHTNING = 'C_LIGHTNING',
  ECLAIR = 'ECLAIR',
}

interface NodeInfo {
  name: string;
  cli: string;
  commands: { [key in Command]: (args: any) => string };
}

const nodeInfo: { [key in NodeType]: NodeInfo } = {
  [NodeType.LND]: {
    name: 'LND',
    cli: 'lncli',
    commands: {
      [Command.SEND]: (args: any) => `sendpayment ${args[0]}`,
      [Command.INVOICE]: (_: any) => 'addinvoice',
      [Command.SIGN]: (_: any) => 'signmessage',
      [Command.VERIFY]: (_: any) => 'verifymessage',
    },
  },
  [NodeType.C_LIGHTNING]: {
    name: 'C-Lightning',
    cli: 'lightning-cli',
    commands: {
      [Command.SEND]: (args: any) => `sendpayment ${args[0]}`,
      [Command.INVOICE]: (_: any) => 'addinvoice',
      [Command.SIGN]: () => 'N/A (Unsupported)',
      [Command.VERIFY]: () => 'N/A (Unsupported)',
    },
  },
  [NodeType.ECLAIR]: {
    name: 'Eclair',
    cli: 'eclair-cli',
    commands: {
      [Command.SEND]: (args: any) => `send ${args[0]}`,
      [Command.INVOICE]: (_: any) => 'receive',
      [Command.SIGN]: () => 'N/A (Unsupported)',
      [Command.VERIFY]: () => 'N/A (Unsupported)',
    },
  },
}

interface Props {
  command: Command;
  args: any;
}

interface State {
  nodeType: NodeType;
}

export default class CLIHelp extends React.PureComponent<Props, State> {
  state: State = {
    nodeType: NodeType.LND,
  };

  render() {
    const { nodeType } = this.state;
    
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px' }}>
          <span style={{ paddingRight: '5px' }}>CLI instructions for</span>
          <Radio.Group
            size="small"
            value={nodeType}
            onChange={this.handleTypeChange}
          >
            {Object.entries(nodeInfo).map(([key, info]) => (
              <Radio.Button key={key} value={key}>
                {info.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <Input readOnly value={this.makeCommand()} />
      </div>
    );
  }

  private handleTypeChange = (ev: RadioChangeEvent) => {
    this.setState({ nodeType: ev.target.value });
  };

  private makeCommand = () => {
    const { command, args } = this.props;
    const { nodeType } = this.state;
    return `${nodeInfo[nodeType].cli} ${nodeInfo[nodeType].commands[command](args)}`
  };
}

