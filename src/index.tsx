import { kebabCase } from "lodash-es";
import * as React from "react";

const themeManPrefix = "_tm";
let variableId = 0;

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
type Options = {
  avoidNameCollision?: boolean;
};

export function createThemeMan<T extends ThemeVariableObject>(
  defaultValues: T,
  options: Options = {}
) {
  // Options
  const { avoidNameCollision = true } = options;

  let timerId: number | undefined;
  const styleTag = document.createElement("style");
  const theme = ({} as any) as T;
  const namingMapping: { [key: string]: number | undefined } = {};

  function minifiedName(originalKey: string) {
    if (typeof namingMapping[originalKey] === "undefined") {
      variableId = variableId + 1;
      namingMapping[originalKey] = variableId;
    }
    return `${themeManPrefix}${namingMapping[originalKey]}`;
  }

  const formattingKey = avoidNameCollision ? minifiedName : kebabCase;

  function generateStringStylesheet(obj: T) {
    return Object.keys(obj)
      .map(key => `--${formattingKey(key)}: ${obj[key]};`)
      .join("");
  }

  function generateReactStyle(obj: Partial<T>) {
    const reactStyleObj: ThemeVariableObject = {};
    Object.keys(obj).forEach(key => {
      reactStyleObj[`--${formattingKey(key)}`] = obj[key] as string;
    });
    return reactStyleObj;
  }

  function createThemeModifier(obj: Partial<T>) {
    const modifier = generateReactStyle(obj);
    const ModifierComponent: React.SFC<{ enabled?: boolean }> = ({
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
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      const result = generateStringStylesheet(defaultValues);
      styleTag.innerText = `:root { ${result} }`;
    }, 0);
  }

  Object.keys(defaultValues).forEach(key => {
    Object.defineProperty(theme, key, {
      get() {
        return `var(--${formattingKey(key)})`;
      },
      set(value) {
        defaultValues[key] = value;
        updateStyle();
      }
    });
  });

  if (!document.head!.contains(styleTag)) {
    document.head!.appendChild(styleTag);
  }

  updateStyle();

  return { theme, createThemeModifier };
}
