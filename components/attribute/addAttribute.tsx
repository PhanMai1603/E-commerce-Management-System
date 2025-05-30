import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { Label } from "../ui/label";

interface ValueInput {
  value: string;
  description_url: string;
}

interface Props {
  attributeName: string;
  setAttributeName: (val: string) => void;
  attributeType: "COLOR" | "TEXT" | "";
  setAttributeType: (val: "COLOR" | "TEXT") => void;
  isVariant: boolean;
  setIsVariant: (val: boolean) => void;
  attributeValues: ValueInput[];                           // ✅ mới thêm
  setAttributeValues: (vals: ValueInput[]) => void;        // ✅ mới thêm
  onSubmit: () => void;
  disabled?: boolean;
}

export default function AddAttributeForm({
  attributeName, setAttributeName,
  attributeType, setAttributeType,
  isVariant, setIsVariant,
  attributeValues, setAttributeValues,
  onSubmit,
  disabled = false,
}: Props) {
  const handleValueChange = (index: number, field: "value" | "description_url", val: string) => {
    const updated = [...attributeValues];
    updated[index][field] = val;
    setAttributeValues(updated);
  };

  const handleAddValue = () => {
    setAttributeValues([...attributeValues, { value: "", description_url: "" }]);
  };

  const handleRemoveValue = (index: number) => {
    const updated = [...attributeValues];
    updated.splice(index, 1);
    setAttributeValues(updated);
  };

  return (
    <div className="col-span-1 mt-14">
   <Card>

      <CardHeader>
        <CardTitle className="text-center">Add Attribute</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-6 gap-x-2 gap-y-4">
        <div className="space-y-2 col-span-6">
          <Label>Attribute Name</Label>
          <Input
            name='name'
            type='text'
            placeholder='Enter name'
            disabled={disabled}
            value={attributeName}
            onChange={(e) => setAttributeName(e.target.value)}
          />
        </div>

        <div className="space-y-2 col-span-6">
          <Label>Attribute Type</Label>
          <Select
            disabled={disabled}
            value={attributeType}
            onValueChange={(val) => setAttributeType(val as "COLOR" | "TEXT")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COLOR">COLOR</SelectItem>
              <SelectItem value="TEXT">TEXT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between col-span-6">
          <Label>Is Variant</Label>
          <Switch
            disabled={disabled}
            checked={isVariant}
            onCheckedChange={setIsVariant}
          />
        </div>

        {/* VALUE INPUTS */}
        {isVariant && attributeValues.map((v, index) => (
          <div className="col-span-6 grid grid-cols-6 gap-2 items-center" key={index}>
            <Input
              placeholder="Value Name"
              className="col-span-2"
              value={v.value}
              onChange={(e) => handleValueChange(index, "value", e.target.value)}
              disabled={disabled}
            />
            <Input
              placeholder={attributeType === "COLOR" ? "#FF5733" : "Description"}
              className="col-span-3"
              value={v.description_url}
              onChange={(e) => handleValueChange(index, "description_url", e.target.value)}
              disabled={disabled}
            />
            <Button
              variant="destructive"
              className="col-span-1"
              onClick={() => handleRemoveValue(index)}
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {isVariant && (
          <Button
            className="col-span-6"
            variant="outline"
            onClick={handleAddValue}
            disabled={disabled}
          >
            ADD VALUE
          </Button>
        )}

        <Button
          disabled={disabled}
          className="w-full col-span-6"
          onClick={onSubmit}
        >
          ADD ATTRIBUTE
        </Button>
      </CardContent>
    </Card>
    </div>
  );
}
