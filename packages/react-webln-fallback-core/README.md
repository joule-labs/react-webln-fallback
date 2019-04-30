# React WebLN Fallback Core

Contains the base component and a bunch of utilities for creating React WebLN fallback components. If you're not sure what this is or how to use it, please read the main repository GitHub readme for more information: [https://github.com/joule-labs/react-webln-fallback](https://github.com/joule-labs/react-webln-fallback)

This package exports the following things:

## Components

### `ReactWebLNFallback`

The base component for implementing a WebLN fallback component. Binds the WebLN provider on mount, and renders components per supported method when they're called.

**Props**
```ts
export interface ReactWebLNFallbackProps {
  supportedMethods: WebLNMethod[];
  methodComponents: { [key in WebLNMethod]?: React.ComponentType<MethodComponentProps> };
  i18nextLng?: string;
  overrideWebLN?: boolean;
}
```

**Example**
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
  i18nextLng="en"
  overrideWebLN={true}
/>
```

### `MakeInvoiceInstructions`

Renders instructions for the requirements of an invoice. Either a basic text description for fixed amounts, or a bullet list for complex invoices.

**Props**
```ts
export interface MakeInvoiceInstructionsProps {
  // The first arg in webln.makeInvoice, string | number | RequestInvoiceArgs.
  args: Parameters<WebLNProvider["makeInvoice"]>[0];
  // i18n translation function
  t: i18n.TFunction;
}
```

**Example**
```tsx
const args = {
  minimumAmount: 100,
  maximumAmount: 1000,
  defaultMemo: 'Tip for comment #184814',
};
<MakeInvoiceInstructions args={args} t={t} />
```

## Component Functions

### `paymentComplete(preimage: string)`

Call after using `webln.sendPayment` when the payment is complete. Provides the preimage for the sendPayment callback, as well as displaying a success message to the user.

**Example**
```tsx
import { paymentComplete } from 'react-webln-fallback-core';

webln.sendPayment(bolt11).then(res => /* ... */);

myInvoiceSocket.on(invoice => {
  if (invoice.settled) {
    paymentComplete(invoice.r_preimage);
  }
});
```

### `closePrompt()`

Simple fire-and-forget function, closes any open prompts.

## Utility Functions

See [`src/utils/*.ts`](src/util) for all of these.

## Utility Constants / Types

See [`src/types.ts`](src/types.ts) all of these.