// styles
import "@/assets/scss/main.scss";

import ClipboardJS from "clipboard";

// project imports
import TextInput from "./components/extends/input/TextInput";
import { useCallback, useEffect, useState } from "react";
import { Template, Templates } from "./lib/template";
import { Button } from "./components/ui/button";
import {
  LucideBookOpenCheck,
  LucideCheck,
  LucideCopy,
  LucideCopyCheck,
  LucideSquarePen,
  LucideX,
} from "lucide-react";
import { each, map } from "lodash";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import HtmlRender from "./HtmlRender";
import TemplateBottomSheet from "./TemplateBottomSheet";

function App() {
  const [template, setTemplate] = useState<Partial<Template>>({});
  const [hiddenFields, setHiddenFields] = useState<Array<string> | undefined>();
  const [defaultValues, setDefaultValues] = useState<Record<string, string>>();
  const [fields, setFields] = useState<Record<string, string>>();
  const [copied, setCopied] = useState<boolean>(false);
  const [isTemplateOpen, setTemplateOpen] = useState<boolean>(false);

  const handleInputChange = useCallback(
    (field: string | undefined, value: string) =>
      field &&
      setFields((prev) => ({
        ...prev,
        [field]: value,
      })),
    []
  );

  const handleCopy = useCallback(() => {
    const element = document.getElementById("text-to-copy");
    const textToCopy = element && element.innerHTML;

    try {
      if (textToCopy) {
        const clipboard = new ClipboardJS("#copyBtn", {
          target: () => element,
        });

        clipboard.on("success", function (e) {
          setCopied(true);

          toast("Copied to Clipboard!", {
            description: "Email Signature has been successfully copied.",
            onAutoClose: () => setCopied(false),
          });

          e.clearSelection();
        });

        clipboard.on("error", function (e) {
          console.log({ e });
          // console.error("Action:", e.action);
          // console.error("Trigger:", e.trigger);
        });
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }, []);

  const handleTemplateChange = useCallback(
    (template: Template) => {
      setTemplate(template);
      setTemplateOpen(false);
      setHiddenFields(template.hiddenFields);
      setDefaultValues(template.defaults);

      each(template.defaults, (value, key) =>
        setFields((prev) => ({
          ...prev,
          [key]: fields?.[key] ?? value,
        }))
      );
    },
    [fields, setFields]
  );

  useEffect(() => {
    const _template = Templates[0];

    setTemplate(_template);
    setHiddenFields(_template.hiddenFields);
    setDefaultValues(_template.defaults);
  }, []);

  const replaceValue = useCallback((key: string, value: string) => {
    if (key === "website")
      return `<a target="_blank" href='https://${value}'>${value}</a>`;

    return value;
  }, []);

  useEffect(() => {
    each(defaultValues, (value, key) => {
      const element = document.getElementById(key);
      const displayValue = (fields?.[key] ?? value ?? "").trim();

      if (element)
        element.innerHTML = replaceValue(
          key,
          displayValue !== "" ? displayValue : value
        );
    });
  }, [defaultValues, fields, hiddenFields]);

  return (
    <>
      <div className="sm:mr-120 bg-slate-100/50 min-h-screen relative">
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-white border rounded-sm">
          <div className="relative h-full flex flex-col overflow-hidden">
            <div className="h-18 shadow-sm flex flex-row items-center justify-between px-4">
              <h1 className="font-semibold text-slate-600">Preview</h1>
              <Button
                id="copyBtn"
                size="sm"
                className="font-light"
                onClick={() => handleCopy()}
              >
                {copied ? <LucideCopyCheck /> : <LucideCopy />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="bg-slate-100/50 flex-1 flex flex-col justify-center">
              <HtmlRender template={template.templateHtml} />
            </div>

            <div className="absolute bottom-0 mb-4 flex flex-row justify-center w-full gap-x-3">
              <Button
                variant="outline"
                className="rounded-full shadow-xl border-slate-400 text-[0.8em] py-5 !px-5"
                size="sm"
                onClick={() => setTemplateOpen(true)}
              >
                <LucideSquarePen />
                Change Template
              </Button>

              <Button
                variant="outline"
                className="rounded-full shadow-xl border-slate-400 text-[0.8em] py-5  !px-5"
                size="sm"
              >
                <LucideBookOpenCheck />
                Setup Instruction
              </Button>
            </div>

            <TemplateBottomSheet open={isTemplateOpen}>
              <div className="p-6">
                <div className="flex flex-row items-center justify-between mb-4">
                  <h2 className="font-semibold flex flex-row gap-2 items-center">
                    <LucideSquarePen size={20} className="text-slate-600" />
                    Change Template
                  </h2>

                  <Button
                    variant="ghost"
                    className="border-slate-400 text-[0.8em]"
                    size="sm"
                    onClick={() => setTemplateOpen(false)}
                  >
                    <LucideX />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {map(Templates, (value, index) => (
                    <div
                      key={index}
                      className="relative group rounded-sm overflow-hidden select-none"
                    >
                      <div className="bg-slate-100 h-60 border flex flex-col justify-center">
                        <img src={value.templateImage} />
                      </div>

                      <div className="bg-black/50 top-0 left-0 right-0 bottom-0 absolute flex items-center justify-center invisible group-hover:visible">
                        <Button
                          variant="outline"
                          className="rounded-full shadow-xl border-slate-400 text-[0.8em] py-5 !px-5 hover:bg-black hover:text-white"
                          size="sm"
                          onClick={() => handleTemplateChange(value)}
                        >
                          <LucideCheck />
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TemplateBottomSheet>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed top-0 right-0 z-40 w-120 h-screen p-8">
        <h1 className="mb-6 font-semibold">Signature Details</h1>

        {/* Form */}
        <div>
          <TextInput
            name="name"
            label="Name"
            placeholder={defaultValues?.["name"]}
            debounce
            onChange={(value, { name }) => handleInputChange(name, value)}
          />
          <TextInput
            name="position"
            label="Position"
            placeholder={defaultValues?.["position"]}
            debounce
            onChange={(value, { name }) => handleInputChange(name, value)}
          />
          <TextInput
            name="email"
            label="Email"
            placeholder={defaultValues?.["email"]}
            debounce
            onChange={(value, { name }) => handleInputChange(name, value)}
          />
          <TextInput
            name="mobileNo"
            label="Mobile/Phone Number"
            placeholder={defaultValues?.["mobileNo"]}
            debounce
            onChange={(value, { name }) => handleInputChange(name, value)}
          />

          {!hiddenFields?.includes("website") && (
            <TextInput
              name="website"
              label="Website"
              placeholder={defaultValues?.["website"]}
              debounce
              onChange={(value, { name }) => handleInputChange(name, value)}
            />
          )}
        </div>
      </div>

      <Toaster
        position="bottom-left"
        toastOptions={{
          classNames: {
            description: "!text-gray-500",
          },
        }}
      />
    </>
  );
}

export default App;
