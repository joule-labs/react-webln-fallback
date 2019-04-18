import React from 'react';
import { Input, TextArea, Button, Form } from 'semantic-ui-react';
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
          <Button.Group size="mini">
            {Object.entries(nodeInfo).map(([key, info]) => (
              <Button
                key={key}
                toggle
                active={nodeType === key}
                onClick={() => this.handleTypeChange(key as NodeType)}
              >
                {info.name}
              </Button>
            ))}
          </Button.Group>
        </div>
        <Form as="div">
          {this.renderCommandInput()}
        </Form>
      </div>
    );
  }

  private handleTypeChange = (nodeType: NodeType) => {
    this.setState({ nodeType });
  };

  private renderCommandInput = () => {
    const { method, args } = this.props;
    const { nodeType } = this.state;
    const cmd = getCliCommand(nodeType, method, args);
    if (cmd) {
      if (cmd.includes('\n')) {
        return <TextArea fluid disabled rows={5} value={cmd} />;
      }
      else {
        return <Input fluid disabled value={cmd} />;
      }
    } else {
      return <Input fluid disabled value="N/A (Unsupported)" />;
    }
  };
}

