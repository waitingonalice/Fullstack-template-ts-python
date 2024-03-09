import { useState } from "react";
import { useRouter } from "next/router";
import Editor from "@monaco-editor/react";
import {
  ButtonProps,
  Drawer,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useForm,
} from "@waitingonalice/design-system";
import { Main, Spinner } from "@/components";
import { useAppContext } from "@/components/app-context";
import { clientRoutes } from "@/constants";
import { useEditor } from "./hooks/useEditor";
import { useAddToCollection } from "./loaders/collection";
import { themeOptions } from "./utils/theme";
import { validateCreateCollectionSchema } from "./utils/validation";
import {
  AddtoCollection,
  ConsolePanel,
  FieldChangeEvent,
  FieldInterface,
  JudgePanel,
  Language,
  ThemeDropdown,
} from "./component";

const initFieldsState = { title: "", description: "" };
function CodeEditor() {
  const { renderToast } = useAppContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fields, setFields] = useState<FieldInterface>(initFieldsState);

  const {
    editorOptions,
    messages,
    input,
    status,
    preserveLogs,
    allowAutomaticCodeExecution,
    debounceExecute,
    handleOnChange,
    handleSelectedConsoleOption,
    handleOnMount,
    handleSelectTheme,
  } = useEditor();
  const { push } = useRouter();

  const { validate, errors, onSubmitValidate, clearErrors } = useForm({
    data: { ...fields, code: input },
    zod: validateCreateCollectionSchema,
  });

  const [addToCollection, options] = useAddToCollection();

  const handleBackClick = () => {
    push(clientRoutes.dashboard);
  };

  const handleRun = () => {
    debounceExecute(input);
  };

  const handleCloseDrawer = () => {
    clearErrors();
    setIsDrawerOpen(false);
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleChangeFields = (arg: FieldChangeEvent) => {
    setFields((prev) => ({ ...prev, [arg.key]: arg.val }));
  };

  const handleAddToCollection = async () => {
    const { title, description } = fields;
    const success = onSubmitValidate();
    if (!success) return;
    try {
      await addToCollection({
        input: {
          title,
          description,
          code: input,
        },
      });
      renderToast({
        title: "Snippet added to collection.",
        variant: "success",
      });
      setFields(initFieldsState);
      handleCloseDrawer();
    } catch (err) {
      renderToast({
        title: "Failed to add snippet to collection",
        variant: "destructive",
      });
    }
  };

  const triggerButton: ButtonProps = {
    children: "Add to collection",
    size: "small",
    onClick: handleOpenDrawer,
  };

  const actionButtons: ButtonProps[] = [
    {
      variant: "secondary",
      children: "Cancel",
      onClick: handleCloseDrawer,
      disabled: options.isLoading,
    },
    {
      children: options.isLoading ? <Spinner /> : "Save",
      onClick: handleAddToCollection,
      disabled: options.isLoading,
    },
  ];
  return (
    <Main>
      <Main.Header
        title="Code Editor"
        onBackClick={handleBackClick}
        leftChildren={
          <>
            <ThemeDropdown
              options={themeOptions}
              onSelect={handleSelectTheme}
              selectedValue={editorOptions.theme}
            />
            <Language />
          </>
        }
        rightChildren={
          <Drawer
            className="bg-secondary-2"
            open={isDrawerOpen}
            title="Add to collection"
            description="Enter more details about this snippet."
            triggerButton={triggerButton}
            actionButtons={actionButtons}
            onClose={handleCloseDrawer}
            content={
              <AddtoCollection
                fields={fields}
                onChange={handleChangeFields}
                validate={validate}
                errors={errors}
              />
            }
          />
        }
      />

      <Main.Content>
        <ResizablePanelGroup
          direction="vertical"
          className="min-h-[calc(100vh-54px)]"
        >
          <ResizablePanel defaultSize={75}>
            <Editor
              {...editorOptions}
              onChange={handleOnChange}
              onMount={handleOnMount}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50}>
                <ConsolePanel
                  result={messages}
                  status={status}
                  preserveLogs={preserveLogs}
                  allowAutomaticCompilation={allowAutomaticCodeExecution}
                  onExecuteCode={handleRun}
                  onSelectOption={handleSelectedConsoleOption}
                />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                {/* Judge panel */}
                <JudgePanel code={input} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Main.Content>
    </Main>
  );
}

export default CodeEditor;
