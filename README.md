# Materials Cloud React component library

React component library used in Materials Cloud, built with vite and bootstrap.

Install via

```
npm install mc-react-library
```

Note: make sure all `peerDependencies` (defined in `package.json`) are installed in the host application!

Project structure:

- `lib\` - contains the React components of the library.
- `src\` - contains a demo page that renders the components just for development.

## Development

### Using the demo page

For developing the library of components, start the demo page (in `src\`) by

```
npm install
npm run dev
```

and update the components in `lib\`.

### Building and testing locally

To build the library and test it locally in an external application (before publishing to npm), use

```
npm run build
npm pack
```

which will create a `.tgz` file that can then be installed by the external application via

```
npm install /path/to/mc-react-library-x.y.z.tgz
```

### Publishing a new version

To make a new version and publish to npm via GitHub Actions:

```bash
npm version <patch/minor/major>
git push --follow-tags
```
