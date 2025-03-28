// project imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useCallback } from "react";

interface TextInputProps {
  name: string;
  label: string;
  debounce?: boolean;
  debounceTime?: number;
  placeholder?: string;
  onChange?: (value: string, exposedProps: Partial<ExposedTextProps>) => void;
}

type ExposedTextProps = Omit<TextInputProps, "onChange">;

function TextInput({
  name,
  label,
  placeholder,
  debounce,
  debounceTime = 1000,
  onChange,
}: TextInputProps) {
  let typingTimer: NodeJS.Timeout | null = null;

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (!debounceTime) {
        onChange?.(value, { name });
        return;
      }

      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = setTimeout(() => onChange?.(value, { name }), debounceTime);
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
      <Input id={name} placeholder={placeholder} onChange={handleInputChange} />
    </div>
  );
}

export default TextInput;
