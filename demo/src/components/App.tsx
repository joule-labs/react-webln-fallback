import React from 'react';
import { Tabs, Dropdown, Menu, Button } from 'antd';
import MakeInvoice from './MakeInvoice';
import SendPayment from './SendPayment';
import SignMessage from './SignMessage';
import VerifyMessage from './VerifyMessage';
import 'antd/dist/antd.css';
import './App.less';

const STYLES = {
  antd: {
    name: 'Ant Design',
    link: 'https://ant.design',
  },
  bootstrap: {
    name: 'Bootstrap (react-bootstrap)',
    link: 'https://react-bootstrap.github.io/',
  },
  reactstrap: {
    name: 'Bootstrap (reactstrap)',
    link: 'https://reactstrap.github.io/',
  },
  'semantic-ui': {
    name: 'Semantic UI',
    link: 'https://react.semantic-ui.com',
  },
  'material-ui': {
    name: 'Material UI',
    link: 'https://material-ui.com/',
  },
};
type Style = keyof typeof STYLES;

interface Props {
  style: Style;
  WebLNFallbackComponent: React.ComponentType<any>;
  paymentComplete(preImage: string): void;
}

export default class App extends React.Component<Props> {
  render() {
    const { style, WebLNFallbackComponent, paymentComplete } = this.props;
    const tabs = [{
      key: 'sendPayment',
      tab: 'Send Payment',
      content: <SendPayment paymentComplete={paymentComplete} />,
    }, {
      key: 'makeInvoice',
      tab: 'Make Invoice',
      content: <MakeInvoice />,
    }, {
      key: 'signMessage',
      tab: 'Sign Message',
      content: <SignMessage />,
    }, {
      key: 'verifyMessage',
      tab: 'Verify Message',
      content: <VerifyMessage />,
    }];

    const styleMenu = (
      <Menu selectedKeys={[style]}>
        {Object.entries(STYLES).map(([s, info]) => (
          <Menu.Item key={s} onClick={() => this.goToStyle(s)}>
            {info.name}
          </Menu.Item>
        ))}
      </Menu>
    )

    return (
      <div className="App">
        <div className="App-header">
          <div className="App-header-left">
            <h1 className="App-header-left-title">
              React WebLN Fallback Demo
            </h1>
            <div className="App-header-left-docs">
              For more information, check out the{' '}
              <a href="https://github.com/wbobeirne/react-webln-fallback" target="_blank">
                documentation on GitHub
              </a>.
            </div>
          </div>
          <div className="App-header-right">
            <Dropdown overlay={styleMenu}>
              <Button>
                Style: {STYLES[style].name}
              </Button>
            </Dropdown>
          </div>
        </div>
        <div className="App-content">
          <Tabs defaultActiveKey="sendPayment">
            {tabs.map(t => (
              <Tabs.TabPane tab={t.tab} key={t.key}>
                {t.content}
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div>
        <WebLNFallbackComponent overrideWebLN />
      </div>
    )
  }

  private goToStyle = (s: string) => {
    window.location.pathname = `/${s}`;
  };
}
