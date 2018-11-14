# Theme Man

JavaScript Bindings for Global CSS Variables

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

`theme-man` will create global CSS Variables according to `defaultThemeValues`.

### Use it in your components

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

export function makeItGreen() {
  return createThemeModifier({
    primaryColor: "green"
  });
}

export const Theme = theme;
```

```jsx

import { Theme, makeItGreen } from "src/theme";
import { ThemeModifier } from 'theme-man';

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
<ThemeModifier modifier={makeItGreen}>
  <MyButton>This is a green button</MyButton>
</ThemeModifier>
```

### Why `ThemeModifier` instead of setting those CSS variables by myself?

Because sometimes your components might use `Portal` to render some component out of the scope. `ThemeModifier` also provides the context so you can still read correct values by using `ThemeModifierContext.Consumer` instead of applying the root values.
