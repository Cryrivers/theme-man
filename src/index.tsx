import { kebabCase } from "lodash-es";
import * as React from "react";

type ThemeVariableObject = { [key: string]: string };

function generateStringStylesheet<T extends ThemeVariableObject>(obj: T) {
  return Object.keys(obj)
    .map(key => `--${kebabCase(key)}: ${obj[key]};`)
    .join("");
}

function generateReactStyle<T extends ThemeVariableObject>(obj: T) {
  const reactStyleObj: ThemeVariableObject = {};
  Object.keys(obj).forEach(key => {
    reactStyleObj[`--${kebabCase(key)}`] = obj[key] as string;
  });
  return reactStyleObj;
}

export function createThemeMan<T extends ThemeVariableObject>(
  defaultValues: T
) {
  const styleTag = document.createElement("style");
  const theme = ({} as any) as T;

  function createThemeModifier(obj: Partial<T>): ThemeVariableObject {
    // @ts-ignore
    return generateReactStyle(obj);
  }

  function updateStyle() {
    const result = generateStringStylesheet(defaultValues);
    styleTag.innerText = `:root { ${result} }`;
    if (!document.head.contains(styleTag)) {
      document.head.appendChild(styleTag);
    }
  }

  Object.keys(defaultValues).forEach(key => {
    Object.defineProperty(theme, key, {
      get() {
        return `var(--${kebabCase(key)})`;
      },
      set(value) {
        defaultValues[key] = value;
        updateStyle();
      }
    });
  });

  updateStyle();

  return { theme, createThemeModifier };
}

export const ThemeModifierContext = React.createContext({});

export const ThemeModifier: React.SFC<{
  modifier: () => {};
}> = ({ modifier, children }) => {
  // const result = React.useMemo(modifier, [modifier]);
  const result = modifier();
  return (
    <div style={{ display: "contents", ...result }}>
      <ThemeModifierContext.Provider value={result}>
        {children}
      </ThemeModifierContext.Provider>
    </div>
  );
};
