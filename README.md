# IFrame communication

## Workflow

Start all three apps:

```sh
yarn start
```

* host on [http://localhost:3000/](http://localhost:3000/)
* child on [http://localhost:3001/](http://localhost:3001/)
* third party on [http://localhost:3002/](http://localhost:3002/)

## Architecture

* Application Host creates Child Host iframe.
* Child Host iframe creates Child Window (which becomes a host for 3rd party apps).
  * Child Window and Child Host shares the same JavaScript context (no postMessaging needed, the Child Window is scriptable and all its content is available in Child Host).
  * Child Window **just** renders content and uses Child Host JavaScript context to manipulate document, events, etc.
  * if access directly to the `window` object from Child Window in fact you get Child Host `window` object instead.
  * to access Child Window `window` reference it must be passed from Child Host to Child Window as a parameter.
* Child Window hosts Third Party App iframe.

### Example

```tsx

// ChildWindow.tsx
const ChildWindow = (props: { target: Window }) => (  // target is the actual Child Window window, passed as a parameter
  <div>
    <h1>Hi, I'm child window</h1>
    <p>{props.target.someProp}</p>  {/* access to this window prop */}
    <p>{window.someProp}</p>  {/* access to the host window prop */}
  </div>
)

...

// Host.tsx
...
// on openWindowButtonClick

openWindowButtonClick = () => {
  const childWindow = window.open();
  // childWindow.document.body uses just for rendering DOM, but not to access JS context
  // which remains in the window where this code gets executed.
  ReactDOM.render(<ChildWindow target={childWindow} />, childWindow.document.body);
}

...

```
