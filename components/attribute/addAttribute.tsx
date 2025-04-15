import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import clsx from "clsx";

interface Props {
  attributeName: string;
  setAttributeName: (val: string) => void;
  attributeType: "COLOR" | "TEXT" | "";
  setAttributeType: (val: "COLOR" | "TEXT") => void;
  isVariant: boolean;
  setIsVariant: (val: boolean) => void;
  newValue: string;
  setNewValue: (val: string) => void;
  descriptionUrl: string;
  setDescriptionUrl: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function AddAttributeForm({
  attributeName, setAttributeName,
  attributeType, setAttributeType,
  isVariant, setIsVariant,
  newValue, setNewValue,
  descriptionUrl, setDescriptionUrl,
  onSubmit,
  disabled = false,
}: Props) {
  return (
    <Card className={clsx("col-span-1", disabled && "opacity-50 pointer-events-none")}>
      <CardHeader>
        <CardTitle className="text-center">Add Attribute</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-6 gap-x-2 gap-y-4">
        <div className="space-y-2 col-span-6">
          <Label>Attribute Name</Label>
          <Input
            disabled={disabled}
            value={attributeName}
            type="text"
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
              <SelectItem value="COLOR">Color</SelectItem>
              <SelectItem value="TEXT">Text</SelectItem>
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

        {/* Luôn hiện nhưng sẽ disable nếu isVariant = false */}
        <div className="space-y-2 col-span-6">
          <Label>Value Name</Label>
          <Input
            disabled={!isVariant || disabled}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
        </div>

        <div className="space-y-2 col-span-6">
          <Label>{attributeType === "COLOR" ? "Color Hex Code" : "Description"}</Label>
          <Input
            disabled={!isVariant || disabled}
            placeholder={attributeType === "COLOR" ? "#FF5733" : "Enter description"}
            value={descriptionUrl}
            onChange={(e) => setDescriptionUrl(e.target.value)}
          />
        </div>

        <Button
          disabled={disabled || (isVariant && (!newValue || !descriptionUrl))}
          className="w-full col-span-6"
          onClick={onSubmit}
        >
          ADD ATTRIBUTE
        </Button>
      </CardContent>
    </Card>
  );
}
