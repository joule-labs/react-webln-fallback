import React from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
  WebLNMethod,
  NodeType,
  MethodComponentProps,
  nodeInfo,
  getCliCommand,
} from 'react-webln-fallback-core';

interface Props {
  method: WebLNMethod;
  args: any;
  t: MethodComponentProps['t'];
}

interface State {
  nodeType: NodeType;
}

export default class CLIHelp extends React.PureComponent<Props, State> {
  state: State = {
    nodeType: NodeType.LND,
  };

  render() {
    const { t } = this.props;
    const { nodeType } = this.state;
    
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <span style={{ paddingRight: 5 }}>
            {t('react-webln-fallback.cli.prefix')}
          </span>
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
    const { method, args, t } = this.props;
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
      return <TextField {...sharedProps} value={t<string>('react-webln-fallback.cli.unsupported')} />;
    }
  };
}
