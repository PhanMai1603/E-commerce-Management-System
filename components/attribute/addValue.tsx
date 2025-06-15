import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AttributeItem } from "@/interface/attribute";
import { Label } from "../ui/label";

interface ValueInput {
  value: string;
  description_url: string;
}

interface Props {
  attribute: AttributeItem;
  values: ValueInput[];
  setValues: (values: ValueInput[]) => void;
  onSubmit: () => void;
  onCancel: () => void;  // phải có dòng này
}


export default function AddValueForm({
  attribute,
  values,
  setValues,
  onSubmit,
  onCancel,
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
    <div className="col-start-3 mt-0">
<Card>
  <CardHeader>
    <CardTitle className="text-center">Thêm giá trị cho {attribute.name}</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
    {values.map((item, idx) => (
      <div key={idx} className="grid grid-cols-6 gap-2 items-end">
        <div className="col-span-3 space-y-1">
          <Label>Giá trị</Label>
          <Input
            value={item.value}
            onChange={(e) => handleChange(idx, "value", e.target.value)}
          />
        </div>
        <div className="col-span-2 space-y-1">
          <Label>
            {attribute.type === "COLOR" ? "Mã màu (Hex)" : "Mô tả"}
          </Label>
          <Input
            placeholder={attribute.type === "COLOR" ? "#FF5733" : "Nhập URL hoặc mô tả"}
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
      THÊM GIÁ TRỊ KHÁC
    </Button>

    <div className="flex gap-2">
      <Button className="flex-1" variant="outline" type="button" onClick={onCancel}>
        HỦY
      </Button>
      <Button className="flex-1" onClick={onSubmit}>
        THÊM GIÁ TRỊ
      </Button>
    </div>
  </CardContent>
</Card>

    </div>
  );
}
