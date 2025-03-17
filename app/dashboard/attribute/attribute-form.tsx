"use client";

import { useEffect, useState } from "react";
import { getAllAttributes, createAttribute, addValueToAttribute } from "@/app/api/attribute";
import { AttributeItem } from "@/interface/attribute";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import { SquarePen, Trash2 } from "lucide-react";

export default function AttributesTable() {
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State for adding attributes
  const [attributeName, setAttributeName] = useState("");
  const [attributeType, setAttributeType] = useState<"COLOR" | "TEXT" | "">("");
  const [isVariant, setIsVariant] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [descriptionUrl, setDescriptionUrl] = useState("");

  // State for editing attribute values
  const [editingAttribute, setEditingAttribute] = useState<AttributeItem | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const response = await getAllAttributes(userId, accessToken);
      setAttributes(response.items);
    } catch (error) {
      toast.error("Failed to fetch attributes.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttribute = async () => {
    if (!attributeName || !attributeType) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (isVariant && (!newValue || !descriptionUrl)) {
      toast.error("Vui lòng nhập đủ thông tin giá trị!");
      return;
    }

    try {
      const values = isVariant ? [{ value: newValue, description_url: descriptionUrl }] : [];

      await createAttribute(userId, accessToken, {
        name: attributeName,
        type: attributeType,
        isVariantAttribute: isVariant,
        values,
      });

      toast.success("Thuộc tính đã được thêm!");
      setAttributeName("");
      setAttributeType("");
      setIsVariant(false);
      setNewValue("");
      setDescriptionUrl("");

      fetchAttributes();
    } catch (error) {
      toast.error("Không thể thêm thuộc tính.");
    }
  };

  const handleAddValue = async () => {
    if (!editingAttribute || !newValue) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await addValueToAttribute(userId, accessToken, {
        attributeId: editingAttribute.id,
        values: [{ value: newValue, description_url: descriptionUrl }],
      });

      toast.success("Giá trị đã được thêm!");
      setNewValue("");
      setDescriptionUrl("");
      setEditingAttribute(null);

      fetchAttributes();
    } catch (error) {
      toast.error("Không thể thêm giá trị.");
    }
  };

  return (
    <div className="p-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Danh sách thuộc tính */}
      <Card className="lg:col-span-2 shadow-md border">
        <CardHeader>
          <CardTitle className="text-xl">All Attributes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg">Name</TableHead>
                <TableHead className="text-lg">Type</TableHead>
                <TableHead className="text-lg">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                attributes.map((attr) => (
                  <TableRow key={attr.id}>
                    <TableCell className="font-medium">{attr.name}</TableCell>
                    <TableCell>{attr.type}</TableCell>
                    <TableCell className="flex gap-2">
                      <button
                        className="bg-black text-white px-5 py-1 rounded-md"
                        onClick={() => setEditingAttribute(attr)}
                      >
                        <SquarePen />
                      </button>
                      <button className="bg-black text-white px-5 py-1 rounded-md">
                        <Trash2 />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="lg:flex lg:flex-col lg:gap-4 lg:sticky lg:top-6">
        {/* Form thêm thuộc tính */}
        <Card className="shadow-md border">
          <CardHeader>
            <CardTitle className="text-lg text-center w-full">Add Attribute</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="attributeName">Attribute Name</Label>
            <Input value={attributeName} onChange={(e) => setAttributeName(e.target.value)} />

            <Label htmlFor="attributeType">Attribute Type</Label>
            <Select value={attributeType} onValueChange={(value) => setAttributeType(value as "COLOR" | "TEXT")}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COLOR">Color</SelectItem>
                <SelectItem value="TEXT">Text</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex flex-col items-start space-y-2">
              <span className="text-xs">Is Variant</span>
              <Switch
                className="scale-75"
                checked={isVariant}
                onCheckedChange={setIsVariant}
              />
            </div>

            {/* Chỉ hiển thị khi isVariant bật */}
            {isVariant && (
              <>
                <Label>Value Name</Label>
                <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} />

                <Label>Description URL</Label>
                <Input value={descriptionUrl} onChange={(e) => setDescriptionUrl(e.target.value)} />
              </>
            )}

            <Button className="w-full" onClick={handleAddAttribute} disabled={isVariant && (!newValue || !descriptionUrl)}>
              Add Attribute
            </Button>
          </CardContent>
        </Card>

        {/* Form thêm giá trị khi nhấn chỉnh sửa */}
        {editingAttribute && (
          <Card className="shadow-md border">
            <CardHeader>
              <CardTitle className="text-lg text-center">Add Value to {editingAttribute.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Value Name</Label>
              <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} />

              <Label>Description URL</Label>
              <Input value={descriptionUrl} onChange={(e) => setDescriptionUrl(e.target.value)} />

              <Button className="w-full" onClick={handleAddValue}>
                Add Value
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
