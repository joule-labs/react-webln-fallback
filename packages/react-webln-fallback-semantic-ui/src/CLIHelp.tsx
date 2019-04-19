import React from 'react';
import { Input, TextArea, Button, Form } from 'semantic-ui-react';
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
        <div style={{ marginBottom: 10 }}>
          <span style={{ paddingRight: 5 }}>
            {t('react-webln-fallback.cli.prefix')}
          </span>
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
    const { method, args, t } = this.props;
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
      return <Input fluid disabled value={t<string>('react-webln-fallback.cli.unsupported')} />;
    }
  };
}

export default withTranslation()(CLIHelp);
