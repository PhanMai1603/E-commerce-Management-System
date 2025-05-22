import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Trash2 } from "lucide-react";
import { AttributeItem } from "@/interface/attribute";

interface ValueInput {
  value: string;
  description_url: string;
}

interface Props {
  attribute: AttributeItem;
  values: ValueInput[];
  setValues: (values: ValueInput[]) => void;
  onSubmit: () => void;
}

export default function AddValueForm({
  attribute,
  values,
  setValues,
  onSubmit,
}: Props) {
  const handleChange = (index: number, key: keyof ValueInput, val: string) => {
    const updated = [...values];
    updated[index][key] = val;
    setValues(updated);
  };

  const addRow = () => {
    setValues([...values, { value: "", description_url: "" }]);
  };

  const removeRow = (index: number) => {
    const updated = [...values];
    updated.splice(index, 1);
    setValues(updated);
  };

  return (
    <Card className="col-start-3">
      <CardHeader>
        <CardTitle className="text-center">Add Values to {attribute.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {values.map((item, idx) => (
          <div key={idx} className="grid grid-cols-6 gap-2 items-end">
            <div className="col-span-3 space-y-1">
              <Label>Value</Label>
              <Input
                value={item.value}
                onChange={(e) => handleChange(idx, "value", e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label>
                {attribute.type === "COLOR" ? "Hex Code" : "Description URL"}
              </Label>
              <Input
                placeholder={attribute.type === "COLOR" ? "#FF5733" : "Enter URL"}
                value={item.description_url}
                onChange={(e) => handleChange(idx, "description_url", e.target.value)}
              />
            </div>
            <Button
              variant="destructive"
              className="col-span-1"
              onClick={() => removeRow(idx)}
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button className="w-full" onClick={addRow} type="button">
          ADD ANOTHER VALUE
        </Button>

        <Button className="w-full" onClick={onSubmit}>
          ADD VALUES
        </Button>
      </CardContent>
    </Card>
  );
}
