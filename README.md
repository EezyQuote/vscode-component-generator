# React Component Generation Extension for VSCode (includes next.js pages)

[![The MIT License](https://flat.badgen.net/badge/license/MIT/orange)](http://opensource.org/licenses/MIT)
[![GitHub](https://flat.badgen.net/github/release/EezyQuote/vscode-component-generator)](https://github.com/EezyQuote/vscode-component-generator/releases)

## Description

The extension automatically creates folder for react component containing :

- `index.ts`
- `ComponentName.tsx`
- `ComponentName.styles.js` (for `styled`-component or `emotion` option)
- `ComponentName.css` (for `css` style option)
- `ComponentName.scss` (for `sass` style option)
- `ComponentName.less` (for `less` style option)
- `ComponentName.module.css` (for `module css` style option)
- `ComponentName.module.scss` (for `module sass` style option)
- `ComponentName.module.less` (for `module less` style option)

The extension can also automatically create SSG, SSR and normal pages for next.js

<!-- ## Installation

Install through VS Code extensions. Search for `VSCode React Component Generator`

[Visual Studio Code Market Place: VSCode React Component Generator](https://marketplace.visualstudio.com/items?itemName=eezyquote.vscode-react-component-generator)

Can also be installed in VS Code: Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.

```bash
ext install eezyquote.vscode-react-component-generator
``` -->

## Usage

- Right click on the file or folder in the file explorer
- Select one of following options the generate new files and templated code
- Enter a component name in the pop up in camelCase or PascalCase. If you enter the component name as in camelCase, then extension will convert it PascalCase automatically.

## Configuration

You can access to the extension's settings through VSCode settings. You can customize:

| config item                                | default                    | options            | description                                                                                          |
| ------------------------------------------ | -------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------- |
| `ComponentGenerator.global.generateFolder` | true                       | boolean            | Generate or not separate folder for newly created component                                          |
| `ComponentGenerator.global.quotes`         | `single`                   | `single`, `double` | Controls the quotes for the imports in the files.                                                    |
| `ComponentGenerator.global.case`           | `pascal`                   | `pascal`, `param`  | Controls the casing that the files should be generated in.                                           |
| `ComponentGenerator.indexFile.create`      | true                       | boolean            | Whether to generate component's index file or not.                                                   |
| `ComponentGenerator.indexFile.extension`   | `ts`                       | string             | The extension of generated component index file. e.g.: index.(`extension`)                           |
| `ComponentGenerator.nextPage.extension`    | `tsx`                      | string             | The extension of generated nextjs page file. e.g.: my-page.tsx(`extension`)                          |
| `ComponentGenerator.mainFile.create`       | true                       | boolean            | Whether to generate component's main file or not.                                                    |
| `ComponentGenerator.mainFile.extension`    | `tsx`                      | string             | The extension of generated component file. e.g.: ComponentName.(`extension`)                         |
| `ComponentGenerator.styleFile.create`      | false                      | boolean            | Whether to generate component's stylesheet file or not.                                              |
| `ComponentGenerator.styleFile.extension`   | `ts`                       | string             | The extension of generated stylesheet file. e.g.: ComponentName.styles.(`extension`)                 |
| `ComponentGenerator.styleFile.suffix`      | ``                         | string             | The suffix to add to the end of the stylesheet filename. Default: ComponentName`.styles`.(extension) |
| `ComponentGenerator.styleFile.type`        | `module.css (.module.css)` | options below      | The type of stylesheet file to create                                                                |

## `ComponentGenerator.styleFile.type` Options

- "css (.css)" - ComponentName.styles.`css`
- "scss (.scss)" - ComponentName.styles.`scss`
- "less (.less)" - ComponentName.styles.`less`
- "module.css (.module.css)" - ComponentName.styles.module.`css`
- "module.scss (.module.scss)" - ComponentName.styles.module.`scss`
- "module.less (.module.less)" - ComponentName.styles.module.`less`

## Changelog

### [Click here](CHANGELOG.md)
