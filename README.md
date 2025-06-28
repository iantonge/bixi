# bixi

> ⚠️ **Note:** bixi is experimental and should not yet be considered ready for production use. Expect potential changes and use with caution in critical applications.

**bixi** is a lightweight JavaScript library designed to progressively enhance links and forms by enabling content swapping without a full page reload. By incorporating a few HTML attributes, developers can enhance user interactions while maintaining full functionality in environments where JavaScript is unavailable.

## Quick Start

### Installation
Pull in the unmodified source from `src/bixi.js` or use the minified/compressed versions from `dist/bixi.js` and/or `dist/bixi.js.br` respectively.

Include the library and initialize it:

```html
<script type="module">
  import { init } from '/bixi.js';
  init();
</script>
```

> ⚠️ **Note:** bixi is published as a javascript module, so the `type="module"` attribute on the script tag is required.

### Panes
- A pane is a container element on the page that can be targeted by bixi links/forms
- There are two types: `bx-pane` and `bx-nav-pane`
- When a `bx-nav-pane` is updated, bixi updates the URL, browser history and updates the document head.
- Updates to a `bx-pane` are just content updates

TODO: Add basic examples of enhancing links & forms here

## Features

### Link Interception
- Intercepts internal links containing `bx-target` and loads content without a full page refresh.
- Respects modifier keys and middle clicks for normal opening behavior.
- Enforces that the link is internal

### Form Enhancement
- Intercepts forms with `bx-target` for both GET and POST methods and supports `formaction` and `formmethod` attributes.

### Targeting `bx-nav-pane`s
- `bx-nav-pane` elements integrate with browser back and forward navigation.
- Updates `<head>` elements such as `<title>` and `<meta>` when content is swapped.

### Request Coordination
- Prevents overlapping requests within nested panes, aborting or skipping as appropriate.
- Feature implemented via `getRequestCoordination()` and validated in `tests/request-coordination`.

### UI Feedback
- Adds and removes a busy class (`bx-busy` by default) and sets the `aria-busy` attribute during requests.

### Autofocus Handling
- Automatically focuses elements with the `autofocus` attribute after navigation and then removes the attribute.

### Custom Events
- Emits `bixi:beforeFetch`, `bixi:afterFetch`, `bixi:beforeLoadContent`, and `bixi:afterLoadContent` for extensibility.

### Error Handling and Pane Validation
- Provides clear errors when expected panes are missing or duplicated.

### Configuration Options
- `init()` accepts options for custom error handling, busy class configuration, and head selector lists.

## Getting Started with Local Development

1. Ensure Node.js and npm are installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the library:
   ```bash
   npm run build
   ```
   This uses `esbuild` and a Brotli plugin as defined in `build.js`.
4. Start the test application:
   ```bash
   npm run test-app
   ```
   This launches the server located in `test-app/server.js`.
5. Run the automated tests:
   ```bash
   npm test
   ```
   Playwright configuration is located in `playwright.config.js`.

## License

This project is released under the MIT License. See the `LICENSE` file for details.
