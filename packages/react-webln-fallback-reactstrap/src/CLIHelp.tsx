import React from 'react';
import { Input, Button, ButtonGroup } from 'reactstrap';
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
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 10 }}>
          <span style={{ paddingRight: 5 }}>
            {t('react-webln-fallback.cli.prefix')}
          </span>
          <ButtonGroup size="sm">
            {Object.entries(nodeInfo).map(([key, info]) => (
              <Button
                key={key}
                value={key}
                active={key === nodeType}
                color="primary"
                outline
                onClick={() => this.handleTypeChange(key)}
              >
                {info.name}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        {this.renderCommandInput()}
      </div>
    );
  }

  private handleTypeChange = (nodeType: any) => {
    this.setState({ nodeType });
  };

  private renderCommandInput = () => {
    const { method, args, t } = this.props;
    const { nodeType } = this.state;
    const cmd = getCliCommand(nodeType, method, args);
    if (cmd) {
      if (cmd.includes('\n')) {
        return <Input type="textarea" readOnly value={cmd} rows={5} />;
      }
      else {
        return <Input readOnly value={cmd} />;
      }
    } else {
      return <Input disabled value={t<string>('react-webln-fallback.cli.unsupported')} />;
    }
  };
}
