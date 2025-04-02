// project imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

interface TextInputProps {
  name: string;
  label: string;
  debounce?: boolean;
  debounceTime?: number;
  placeholder?: string;
  onChange?: (value: string, exposedProps: Partial<ExposedTextProps>) => void;
  value?: string;
}

type ExposedTextProps = Omit<TextInputProps, "onChange">;

function TextInput({
  name,
  label,
  placeholder,
  debounce,
  debounceTime = 1000,
  value,
  onChange,
}: TextInputProps) {
  let typingTimer: NodeJS.Timeout | null = null;

  const [inputValue, setInputValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    setInputValue(value);
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (!debounceTime) {
        onChange?.(value, { name });
        setInputValue(value);
        return;
      }

      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        onChange?.(value, { name });
      }, debounceTime);
    },
    [onChange, debounce, debounceTime]
  );

  return (
    <div className="mb-4">
      <Label
        className="text-gray-600 font-light text-xs tracking-wide px-1 mb-1"
        htmlFor={name}
      >
        {label}
      </Label>
      <Input
        id={name}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default TextInput;
