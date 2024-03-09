/* eslint-disable no-new-func */
import { useEffect, useRef, useState } from "react";
import { EditorProps } from "@monaco-editor/react";
import { useDebouncedCallback } from "@waitingonalice/design-system/hooks/debounced-callback";
import { useKeybind } from "@waitingonalice/design-system/hooks/keybind";
import { useAppContext } from "@/components/app-context";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/utils";
import { transpile } from "@/utils/transpile";
import { defaultEditorThemes, defineTheme, monacoThemes } from "../utils/theme";

export type Status = "error" | "success" | "running";
export type Result = unknown[][];
export type ConsoleType = "clear" | "preserve" | "automaticCompilation";

let initMount = true;
let babelParser: typeof import("prettier/parser-babel") | null = null;
let prettier: typeof import("prettier/standalone") | null = null;
let status: Status = "success";
let currentWorker: Worker | null = null;

const defaultValue = `// Welcome to Code Editor!
// Sample code to get you started.
const arraySort = (arr:Array<number>) => arr.sort((a, b) => a - b);

const arr = [2,1,4,5,6,7,0,4];
console.log(arraySort(arr));
`;
const initialOptions: EditorProps = {
  height: "100vh",
  defaultLanguage: "typescript",
  defaultValue,
  options: {
    fontSize: 14,
    tabSize: 2,
    minimap: {
      enabled: true,
      scale: 1,
      showSlider: "always",
      size: "proportional",
    },
    formatOnPaste: true,
    formatOnType: true,
  },
};

/** Flow of execution
 * 1. user types code
 * 2. transpile
 * 3. run eval in worker
 * 4. while executing eval, capture console statements
 * 5. after end of eval, set display
 * 6. reset captured results to not duplicate them on the next eval.
 * 7. handle errors if necessary
 * */
export const useEditor = () => {
  const { renderToast } = useAppContext();
  const editorRef = useRef<any>(null);
  const [editorOptions, setEditorOptions] =
    useState<EditorProps>(initialOptions);
  const [executedCode, setExecutedCode] = useState<Result>([]);
  const [preserveLogs, setPreserveLogs] = useState<boolean>(false);
  const [allowAutomaticCodeExecution, setAllowAutomaticCodeExecution] =
    useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const handlePreserveLog = (forceSet?: boolean) => {
    setPreserveLogs((prev) => {
      setLocalStorage("logStatus", String(!prev));
      if (forceSet === false || !prev === false) {
        removeLocalStorage("preserveLogs");
        removeLocalStorage("logStatus");
      } else if (!prev === true) {
        // eslint-disable-next-line no-use-before-define
        handleAutomaticCodeExecution(false);
      }
      return forceSet ?? !prev;
    });
  };

  const handleAutomaticCodeExecution = (forceSet?: boolean) => {
    setAllowAutomaticCodeExecution((prev) => forceSet ?? !prev);
    if (!allowAutomaticCodeExecution === true) {
      handlePreserveLog(false);
    }
  };

  const handleSelectTheme = async (value: string) => {
    const updateOptions = (options: EditorProps) => {
      const newOptions = { ...options, theme: value };
      setLocalStorage("editorTheme", value);
      return newOptions;
    };
    if (defaultEditorThemes[value as keyof typeof defaultEditorThemes]) {
      setEditorOptions(updateOptions);
    } else {
      await defineTheme(value as keyof typeof monacoThemes);
      setEditorOptions(updateOptions);
    }
  };

  const handleExecutionError = (message: string) => {
    status = "error";
    setExecutedCode([[`Error: ${message}`]]);
    if (currentWorker) {
      currentWorker.postMessage("terminate");
      currentWorker?.terminate();
      currentWorker = null;
    }
  };

  const handleDelayedExecutionError = () => {
    if (currentWorker && status === "running") {
      setTimeout(() => {
        handleExecutionError("Code execution timed out.");
      }, 2000);
    }
  };

  handleDelayedExecutionError();

  const debounceExecute = useDebouncedCallback(
    async (value: string) => {
      if (!value) {
        setExecutedCode([]);
        return;
      }
      currentWorker = new Worker("worker.js", { type: "module" });
      status = "running";
      const code = await transpile(value);
      currentWorker.postMessage(code);
      currentWorker.onmessage = (e) => {
        const result: Result = e.data;
        if ("error" in result) {
          handleExecutionError(result.error as string);
          return;
        }
        setExecutedCode(result);
        currentWorker?.terminate();
        currentWorker = null;
        status = "success";
        if (preserveLogs) setLocalStorage("preserveLogs", value);
      };
    },
    500,
    [preserveLogs],
  );

  const handleOnChange = (newValue?: string) => {
    const value = newValue || "";
    setInput(value);
    if (allowAutomaticCodeExecution) {
      debounceExecute(value);
    }
  };

  const handleMountLocalStorage = () => {
    const code = getLocalStorage<string>("preserveLogs");
    const logStatus = getLocalStorage<string>("logStatus");
    const theme = getLocalStorage<string>("editorTheme");
    setPreserveLogs(Boolean(logStatus));
    if (code) {
      setEditorOptions((prev) => ({ ...prev, defaultValue: code }));
      handleOnChange(code);
      debounceExecute(code);
    } else {
      handleOnChange(defaultValue);
      debounceExecute(defaultValue);
    }
    if (theme) handleSelectTheme(theme ?? "light");
  };

  useEffect(() => {
    if (initMount) {
      handleMountLocalStorage();
    }
    return () => {
      initMount = false;
      if (currentWorker) {
        currentWorker.terminate();
        currentWorker = null;
      }
    };
  }, []);

  useKeybind(["MetaLeft", "KeyS"], (e) => {
    const handleFormatCode = async () => {
      e.preventDefault();
      const unformattedCode = editorRef.current?.getValue();
      try {
        if (!babelParser || !prettier) {
          babelParser = await import("prettier/parser-babel");
          prettier = await import("prettier/standalone");
        }
        const formattedCode = prettier?.format(unformattedCode, {
          parser: "babel",
          ...(babelParser && { plugins: [babelParser] }),
          printWidth: 80,
        });
        editorRef.current?.setValue(formattedCode);
      } catch (e) {
        if (e instanceof Error) {
          status = "error";
          setExecutedCode([[`Error: ${e.message}`]]);
          console.error(e);
        }
      }
    };

    handleFormatCode();
    debounceExecute(input);
  });

  return {
    editorOptions,
    editorRef,
    messages: executedCode,
    input,
    status,
    preserveLogs,
    allowAutomaticCodeExecution,

    debounceExecute,
    handleOnChange,
    handleSelectTheme,
    handleOnMount: (editor: any) => {
      editorRef.current = editor;
      editorRef.current.focus();
    },

    handleSelectedConsoleOption: (val: ConsoleType) => {
      if (val === "clear" && executedCode.length > 0) {
        setExecutedCode([]);
      }
      if (val === "preserve") {
        handlePreserveLog();
      }
      if (val === "automaticCompilation") {
        handleAutomaticCodeExecution();
        if (!allowAutomaticCodeExecution)
          renderToast({
            title: "Automatic compilation enabled",
            description:
              "Warning: Enabling this feature may negatively impact browser performance. Preserving of logs will be disabled.",
            variant: "warning",
          });
      }
    },
  };
};
