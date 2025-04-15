import { AttributeItem } from "@/interface/attribute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";

interface Props {
  attribute: AttributeItem;
  newValue: string;
  setNewValue: (val: string) => void;
  descriptionUrl: string;
  setDescriptionUrl: (val: string) => void;
  onSubmit: () => void;
}

export default function AddValueForm({
  attribute,
  newValue,
  setNewValue,
  descriptionUrl,
  setDescriptionUrl,
  onSubmit,
}: Props) {
  return (
    <Card className="col-start-3">
      <CardHeader>
        <CardTitle className="text-center">Add Value to {attribute.name}</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-6 gap-x-2 gap-y-4">
        <div className="space-y-2 col-span-6">
          <Label>Value Name</Label>
          <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} />
        </div>

        <div className="space-y-2 col-span-6">
          <Label>
            {attribute.type === "COLOR" ? "Color Hex Code (e.g. #FF5733)" : "Description URL"}
          </Label>
          <Input
            placeholder={attribute.type === "COLOR" ? "#FF5733" : "Enter URL"}
            value={descriptionUrl}
            onChange={(e) => setDescriptionUrl(e.target.value)}
          />
        </div>

        <Button className="w-full col-span-6" onClick={onSubmit}>
          ADD VALUE
        </Button>
      </CardContent>
    </Card>
  );
}
