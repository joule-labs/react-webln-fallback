import React from 'react';
import Form from 'react-bootstrap/Form';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
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
    const { method, args } = this.props;
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
      return <Form.Control disabled value="N/A (Unsupported)" />;
    }
  };
}

