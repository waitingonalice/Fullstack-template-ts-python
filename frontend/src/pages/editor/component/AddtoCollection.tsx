import { Error, FormInput, useForm } from "@waitingonalice/design-system";
import { CollectionType } from "../loaders/collection";

type InputFieldKey = "title" | "description";
export interface FieldChangeEvent {
  key: InputFieldKey;
  val: string;
}
export type FieldInterface = Omit<CollectionType, "code">;

interface AddToCollectionProps {
  fields: FieldInterface;
  onChange: (arg: FieldChangeEvent) => void;
  errors: Error<FieldInterface>;
  validate: ReturnType<typeof useForm>["validate"];
}
export function AddtoCollection({
  fields,
  onChange,
  validate,
  errors,
}: AddToCollectionProps) {
  const handleChange = (type: InputFieldKey, val: string) => {
    validate(type, val);
    onChange({ key: type, val });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <FormInput
        id="title"
        label="Title"
        required
        onChange={(val) => handleChange("title", val)}
        value={fields.title}
        errorMessage={errors.title}
        showError={Boolean(errors.title)}
      />
      <FormInput
        id="description"
        label="Description"
        onChange={(val) => handleChange("description", val)}
        value={fields.description}
        errorMessage={errors.description}
        showError={Boolean(errors.description)}
      />
    </div>
  );
}
