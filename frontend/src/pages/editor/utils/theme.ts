import { loader } from "@monaco-editor/react";
import { generateOptions } from "@/utils/formatting";
import themes from "./themes/themelist.json";

export const defaultEditorThemes = {
  "vs-dark": "VS-dark",
  light: "Light",
};

export const monacoThemes = {
  ...themes,
  ...defaultEditorThemes,
};

export const themeOptions = generateOptions(monacoThemes);

export const defineTheme = async (theme: keyof typeof monacoThemes) => {
  const [monaco, themeOption] = await Promise.all([
    loader.init(),
    import(`./themes/${monacoThemes[theme]}.json`),
  ]);
  monaco.editor.defineTheme(theme, themeOption);
};
