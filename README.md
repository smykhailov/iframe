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
