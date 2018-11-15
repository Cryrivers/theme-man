import { kebabCase } from "lodash-es";
import * as React from "react";

export const ThemeModifierContext = React.createContext({});

const ThemeModifier: React.SFC<{
  modifier: ThemeVariableObject;
}> = ({ modifier, children }) => {
  // const result = React.useMemo(modifier, [modifier]);
  return (
    <span style={{ display: "contents", ...modifier }}>
      <ThemeModifierContext.Provider value={modifier}>
        {children}
      </ThemeModifierContext.Provider>
    </span>
  );
};

type ThemeVariableObject = { [key: string]: string };

function generateStringStylesheet<T extends ThemeVariableObject>(obj: T) {
  return Object.keys(obj)
    .map(key => `--${kebabCase(key)}: ${obj[key]};`)
    .join("");
}

function generateReactStyle<T extends Partial<ThemeVariableObject>>(obj: T) {
  const reactStyleObj: ThemeVariableObject = {};
  Object.keys(obj).forEach(key => {
    reactStyleObj[`--${kebabCase(key)}`] = obj[key] as string;
  });
  return reactStyleObj;
}

export function createThemeMan<T extends ThemeVariableObject>(
  defaultValues: T
) {
  let timerId: number | undefined;
  const styleTag = document.createElement("style");
  const theme = ({} as any) as T;

  function createThemeModifier(obj: Partial<T>) {
    const modifier = generateReactStyle(obj);
    const ModifierComponent: React.SFC<{ enabled: boolean }> = ({
      children,
      enabled = true
    }) => (
      <ThemeModifier modifier={enabled ? modifier : {}}>
        {children}
      </ThemeModifier>
    );
    return ModifierComponent;
  }

  function updateStyle() {
    if (!document.head!.contains(styleTag)) {
      document.head!.appendChild(styleTag);
    }
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      const result = generateStringStylesheet(defaultValues);
      styleTag.innerText = `:root { ${result} }`;
    }, 0);
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
