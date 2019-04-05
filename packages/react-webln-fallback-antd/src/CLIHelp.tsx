import React from 'react';
import { Input, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import TextArea from 'antd/lib/input/TextArea';
import { WebLNMethod, NodeType, nodeInfo, getCliCommand } from 'react-webln-fallback';

interface Props {
  method: WebLNMethod;
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
        {this.renderCommandInput()}
      </div>
    );
  }

  private handleTypeChange = (ev: RadioChangeEvent) => {
    this.setState({ nodeType: ev.target.value });
  };

  private renderCommandInput = () => {
    const { method, args } = this.props;
    const { nodeType } = this.state;
    const cmd = getCliCommand(nodeType, method, args);
    if (cmd) {
      if (cmd.includes('\n')) {
        return <TextArea readOnly value={cmd} rows={5} />;
      }
      else {
        return <Input readOnly value={cmd} />;
      }
    } else {
      return <Input disabled value="N/A (Unsupported)" />;
    }
  };
}

