/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { EllipsisVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

  useEffect(() => {
    fetchAttributes();
  }, []);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const response = await getAllAttributes(userId, accessToken);
      console.log("Attributes fetched:", response); // Log the response data for debugging
      setAttributes(response.items);
    } catch (error) {
      toast.error("Failed to fetch attributes.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttribute = async () => {
    if (!attributeName || !attributeType) {
      toast.error("Please fill in all required information!");
      return;
    }

    if (isVariant && (!newValue || !descriptionUrl)) {
      toast.error("Please fill in all value information!");
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

      toast.success("Attribute added successfully!");
      setAttributeName("");
      setAttributeType("");
      setIsVariant(false);
      setNewValue("");
      setDescriptionUrl("");

      fetchAttributes();
    } catch (error) {
      toast.error("Failed to add attribute.");
    }
  };

  const handleAddValue = async () => {
    if (!editingAttribute || !newValue) {
      toast.error("Please fill in all required information!");
      return;
    }

    try {
      await addValueToAttribute(userId, accessToken, {
        attributeId: editingAttribute.id,
        values: [{ value: newValue, description_url: descriptionUrl }],
      });

      toast.success("Value added successfully!");
      setNewValue("");
      setDescriptionUrl("");
      setEditingAttribute(null);

      fetchAttributes();
    } catch (error) {
      toast.error("Failed to add value.");
    }
  };

  const handleEdit = (id: string) => {
    const attribute = attributes.find(attr => attr.id === id);
    if (attribute) {
      setEditingAttribute(attribute);
      setNewValue("");
      setDescriptionUrl("");
    } else {
      toast.error("Attribute not found.");
    }
  };

  const handleView = (attribute: AttributeItem) => {
    // Implement your view logic here
    console.log("Viewing attribute:", attribute);
  };

  return (
    <div className="p-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Attribute list */}
      <Card className="lg:col-span-2 shadow-md border">
        <CardHeader>
          <CardTitle>All Attributes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : attributes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500">
                    No attributes available
                  </TableCell>
                </TableRow>
              ) : (
                attributes.map((attr) => (
                  <TableRow key={attr.id}>
                    <TableCell className="font-medium">{attr.name}</TableCell>
                    <TableCell>{attr.type}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {attr.values.map((val, index) => (
                          <div key={`${attr.id}-${val.valueId}-${index}`} className="flex items-center">
                            {val.value}
                            {attr.type === "COLOR" ? (
                              <>
                                <span className="inline-block ml-2 w-4 h-4 rounded-full" style={{ backgroundColor: val.descriptionUrl }}></span>
                                {index < attr.values.length - 1 && ", "} {/* Thêm dấu phẩy nếu không phải là phần tử cuối cùng */}
                              </>
                            ) : attr.type === "TEXT" && val.descriptionUrl ? (
                              <>
                                <a href={val.descriptionUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 ml-2">
                                  {val.descriptionUrl}
                                </a>
                                {index < attr.values.length - 1 && ", "} {/* Thêm dấu phẩy nếu không phải là phần tử cuối cùng */}
                              </>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(attr)}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(attr.id)}>
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="lg:flex lg:flex-col lg:gap-4 lg:sticky lg:top-6">
        {/* Form to add attributes */}
        <Card className="shadow-md border">
          <CardHeader>
            <CardTitle className="font-medium text-center w-full">Add Attribute</CardTitle>
          </CardHeader>
          <CardContent className="font-medium space-y-3">
            <Label className="font-medium" htmlFor="attributeName">Attribute Name</Label>
            <Input value={attributeName} onChange={(e) => setAttributeName(e.target.value)} />

            <Label htmlFor="attributeType" className="block mt-10 font-medium">Attribute Type</Label>
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
              <span>Is Variant</span>
              <Switch
                className="scale-75"
                checked={isVariant}
                onCheckedChange={setIsVariant}
              />
            </div>

            {/* Display only when isVariant is true */}
            {isVariant && (
              <>
                <Label>Value Name</Label>
                <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} />

                <Label>
                  {attributeType === "COLOR" ? "Color Hex Code (e.g. #FF5733)" : "Description"}
                </Label>
                <Input
                  placeholder={attributeType === "COLOR" ? "#FF5733" : "Enter description"}
                  value={descriptionUrl}
                  onChange={(e) => setDescriptionUrl(e.target.value)}
                />
              </>
            )}

            <Button className="w-full" onClick={handleAddAttribute} disabled={isVariant && (!newValue || !descriptionUrl)}>
              ADD ATTRIBUTE
            </Button>
          </CardContent>
        </Card>

        {/* Form to add value when editing */}
        {editingAttribute && (
          <Card className="shadow-md border">
            <CardHeader>
              <CardTitle className="font-medium text-center">Add Value to {editingAttribute.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Value Name</Label>
              <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} />

              <Label>
                {editingAttribute.type === "COLOR" ? "Color Hex Code (e.g. #FF5733)" : "Description URL"}
              </Label>
              <Input
                placeholder={editingAttribute.type === "COLOR" ? "#FF5733" : "Enter URL"}
                value={descriptionUrl}
                onChange={(e) => setDescriptionUrl(e.target.value)}
              />

              <Button className="w-full" onClick={handleAddValue}>
                ADD VALUE
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
