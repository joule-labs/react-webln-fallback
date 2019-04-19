import React from 'react';
import { Input, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import TextArea from 'antd/lib/input/TextArea';
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
    const { method, args, t } = this.props;
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
      return <Input disabled value={t<string>('react-webln-fallback.cli.unsupported')} />;
    }
  };
}

export default withTranslation()(CLIHelp);
