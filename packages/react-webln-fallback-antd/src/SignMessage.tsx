import React from 'react';
import { MethodComponentProps } from 'react-webln-fallback';

type Props = MethodComponentProps;

export default class SignMessage extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        Hello
      </div>
    );
  }
}
