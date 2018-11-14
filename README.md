# Theme Man

JavaScript Bindings of Global CSS Custom Properties

## Installation

```sh
npm install theme-man
```

## Usage

### Create a theme object

```js
import { createThemeMan } from "theme-man";

const defaultThemeValues = {
  primaryColor: "red"
};

const { theme } = createThemeMan(defaultThemeValues);

export const Theme = theme;
```

`theme-man` will create global CSS Custom Properties according to `defaultThemeValues`.

### Use in your components

```jsx
import { Theme } from "src/theme";

function MyButton({ children }) {
  return (
    <div
      style={{
        background: Theme.primaryColor
      }}
    >
      {children}
    </div>
  );
}
```

### Change CSS Custom Properties at runtime in JavaScript

```js
import { Theme } from "src/theme";

function darkMode() {
  Theme.primaryColor = "darkblue";
}
```
