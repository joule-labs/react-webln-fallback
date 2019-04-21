import React from 'react';
import { ReactWebLNFallbackProps } from 'react-webln-fallback-core';
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
declare type Props = Partial<Omit<ReactWebLNFallbackProps, 'methodComponents'>>;
export default class MaterialUIReactWebLNFallback extends React.PureComponent<Props> {
    render(): JSX.Element;
}
export {};
