# Theme Man

JavaScript Bindings for Global CSS Variables

## Installation

```sh
npm install --save theme-man
```

## Usage

### Create a theme object

```js
// src/theme.js
import { createThemeMan } from "theme-man";

const defaultThemeValues = {
  primaryColor: "red"
};

const { theme } = createThemeMan(defaultThemeValues);

export const Theme = theme;
```

`theme-man` will create global CSS Variables according to `defaultThemeValues`.

### Use it in components

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

### Change CSS Variables at runtime in JavaScript

```js
import { Theme } from "src/theme";

function darkMode() {
  Theme.primaryColor = "darkred";
}
```

### Override Global CSS Variables with Modifiers

```js
import { createThemeMan } from "theme-man";

const defaultThemeValues = {
  primaryColor: "red"
};

const { theme, createThemeModifier } = createThemeMan(defaultThemeValues);

export const GreenModifier = createThemeModifier({
  primaryColor: "green"
});

export const Theme = theme;
```

```jsx

import { Theme, GreenModifier } from "src/theme";

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

<MyButton>This is a red button</MyButton>
<GreenModifier>
  <MyButton>This is a green button</MyButton>
</GreenModifier>
```

### Why `createThemeModifier` instead of setting those CSS variables by myself?

Because sometimes your components might use `Portal` to render some component out of the scope. `createThemeModifier` provides the context so you can still read correct values by using `ThemeModifierContext` instead of applying the root values.
