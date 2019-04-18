import React from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
        <div style={{ marginBottom: 10 }}>
          <span style={{ paddingRight: '5px' }}>CLI instructions for</span>
          <Select
            value={nodeType}
            onChange={this.handleTypeChange}
          >
            {Object.entries(nodeInfo).map(([key, info]) => (
              <MenuItem key={key} value={key}>{info.name}</MenuItem>
            ))}
          </Select>
        </div>
        {this.renderCommandInput()}
      </div>
    );
  }

  private handleTypeChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ nodeType: ev.target.value } as any);
  };

  private renderCommandInput = () => {
    const { method, args } = this.props;
    const { nodeType } = this.state;
    const cmd = getCliCommand(nodeType, method, args);
    const sharedProps = {
      variant: 'outlined' as 'outlined',
      fullWidth: true,
      disabled: true,
    };
    if (cmd) {
      if (cmd.includes('\n')) {
        return <TextField {...sharedProps} multiline rows={5} value={cmd} />;
      }
      else {
        return <TextField {...sharedProps} value={cmd} />;
      }
    } else {
      return <TextField {...sharedProps} value="N/A (Unsupported)" />;
    }
  };
}

