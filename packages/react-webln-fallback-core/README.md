# WORK IN PROGRESS

# React WebLN Fallback Core

Contains the base component and a bunch of utilities for creating React WebLN fallback components. Exports the following things:

## Components

### ReactWebLNFallback

The base component for implementing a WebLN fallback component. Binds the WebLN provider on mount, and renders components per supported method when they're called.

*Props*
```ts
export interface ReactWebLNFallbackProps {
  supportedMethods: WebLNMethod[];
  methodComponents: { [key in WebLNMethod]?: React.ComponentType<MethodComponentProps> };
  i18next?: i18next.i18n;
  i18nextLng?: string;
  i18nextResource?: i18next.Resource;
  overrideWebLN?: boolean;
}
```

*Example*
```tsx
<ReactWebLNFallback
  supportedMethods={[
    WebLNMethod.makeInvoice,
    WebLNMethod.sendPayment,
    WebLNMethod.signMessage,
    WebLNMethod.verifyMessage,
  ]}
  methodComponents={{
    [WebLNMethod.makeInvoice]: MyMakeInvoiceComponent,
    [WebLNMethod.sendPayment]: MySendPaymentComponent,
    [WebLNMethod.signMessage]: MySignMessageComponent,
    [WebLNMethod.verifyMessage]: MyVerifyMessageComponent,
  }}
/>
```

### MakeInvoiceInstructions

Renders instructions for the requirements of an invoice. Either a basic text description for fixed amounts, or a bullet list for complex invoices.

*Props*
```ts
export interface MakeInvoiceInstructionsProps {
  // The first arg in webln.makeInvoice, string | number | RequestInvoiceArgs.
  args: Parameters<WebLNProvider["makeInvoice"]>[0];
}
```

*Example*
```tsx
const args = {
  minimumAmount: 100,
  maximumAmount: 1000,
  defaultMemo: 'Tip for comment #184814',
};
<MakeInvoiceInstructions args={args} />
```

## Utility Functions

###

## Utility Constants / Types

See [`src/types.ts`](src/types.ts) all of these.