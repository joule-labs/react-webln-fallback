import React from 'react';
import Form from 'react-bootstrap/Form';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { withTranslation, WithTranslation } from 'react-i18next';
import { WebLNMethod, NodeType, nodeInfo, getCliCommand } from 'react-webln-fallback-core';

interface Props {
  method: WebLNMethod;
  args: any;
}

interface State {
  nodeType: NodeType;
}

class CLIHelp extends React.PureComponent<Props & WithTranslation, State> {
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
          <ToggleButtonGroup
            name="nodeType"
            type="radio"
            onChange={this.handleTypeChange}
            size="sm"
            value={nodeType}
          >
            {Object.entries(nodeInfo).map(([key, info]) => (
              <ToggleButton
                key={key}
                value={key}
                variant="outline-primary"
              >
                {info.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
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
        return <Form.Control as="textarea" readOnly value={cmd} rows={5} />;
      }
      else {
        return <Form.Control readOnly value={cmd} />;
      }
    } else {
      return <Form.Control disabled value={t<string>('react-webln-fallback.cli.unsupported')} />;
    }
  };
}

export default withTranslation()(CLIHelp);
