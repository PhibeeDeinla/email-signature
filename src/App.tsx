// styles
import "@/assets/scss/main.scss";

import ClipboardJS from "clipboard";

// project imports
import TextInput from "./components/extends/input/TextInput";
import { useEffect, useState } from "react";
import { Templates } from "./lib/template";
import { Button } from "./components/ui/button";

import { LucideCopy } from "lucide-react";
import { each } from "lodash";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

function App() {
  const template = Templates[0];
  const hiddenFields = Templates[0].hiddenFields;

  const [defaultValues, setDefaultValues] = useState<Record<string, string>>();
  const [fields, setFields] = useState<Record<string, string>>();

  const handleInputChange = (field: string | undefined, value: string) =>
    field &&
    setFields((prev) => ({
      ...prev,
      [field]: value,
    }));

  useEffect(() => {
    if (template.defaults) {
      setDefaultValues(template.defaults);
      setFields(template.defaults);
    }
  }, [template.defaults]);

  const replaceValue = (key: string, value: string) => {
    if (key === "website")
      return `<a target="_blank" href='https://${value}'>${value}</a>`;

    return value;
  };

  useEffect(() => {
    each(fields, (value, key) => {
      const element = document.getElementById(key);
      const displayValue =
        value.trim() !== "" ? value : template.defaults?.[key] ?? "";

      if (element) element.innerHTML = replaceValue(key, displayValue);
    });
  }, [fields]);

  const handleCopy = async () => {
    const element = document.getElementById("text-to-copy");
    const textToCopy = element && element.innerHTML;

    try {
      if (textToCopy) {
        const clipboard = new ClipboardJS("#copyBtn", {
          target: () => element,
        });

        clipboard.on("success", function (e) {
          toast("Copied to Clipboard!", {
            description: "Email Signature has been successfully copied.",
          });

          e.clearSelection();
        });

        clipboard.on("error", function (e) {
          console.error("Action:", e.action);
          console.error("Trigger:", e.trigger);
        });
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <>
      <div className="sm:mr-120 bg-slate-100/50 min-h-screen relative">
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-white border rounded-sm flex flex-col">
          <div className="h-18 shadow-sm flex flex-row items-center justify-between px-4">
            <h1 className="font-semibold text-slate-600">Preview</h1>
            <Button
              id="copyBtn"
              size="sm"
              className="font-light"
              onClick={() => handleCopy()}
            >
              <LucideCopy />
              Copy
            </Button>
          </div>
          <div className="bg-slate-100/50 flex-1 flex flex-col justify-center">
            <div
              id="text-to-copy"
              className="mx-auto bg-white shadow-widget border rounded-sm"
              dangerouslySetInnerHTML={{ __html: template.templateHtml }}
            ></div>
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
              debounce
              onChange={(value, { name }) => handleInputChange(name, value)}
            />
          )}
        </div>
      </div>

      <Toaster
        position="top-center"
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
