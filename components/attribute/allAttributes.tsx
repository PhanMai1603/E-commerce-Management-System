import { AttributeItem } from "@/interface/attribute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface Props {
  attributes: AttributeItem[];
  loading: boolean;
  onEdit: (id: string) => void;
  onView: (attribute: AttributeItem) => void;
}

export default function AttributeTable({ attributes, loading, onEdit, onView }: Props) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>All Attributes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : attributes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">No attributes available</TableCell>
              </TableRow>
            ) : (
              attributes.map(attr => (
                <TableRow key={attr.id}>
                  <TableCell className="font-medium">{attr.name}</TableCell>
                  <TableCell>{attr.type}</TableCell>
                  <TableCell>
                  <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                      {attr.values.map((val, i) => (
                        <div key={`${val.valueId}-${i}`} className="flex items-center gap-1 border border-gray-300 px-2 py-1 rounded text-sm break-all">
                          {attr.type === "COLOR" ? (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer">
                                  <span>{val.value}</span>
                                  <span className="inline-block w-4 h-4 rounded-full border" style={{ backgroundColor: val.descriptionUrl }} />
                                </div>
                              </HoverCardTrigger>
                            </HoverCard>
                          ) : attr.type === "TEXT" && val.descriptionUrl ? (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <span className="cursor-pointer">{val.value}</span>
                              </HoverCardTrigger>
                              <HoverCardContent className="text-sm break-words p-2 max-w-xs">{val.descriptionUrl}</HoverCardContent>
                            </HoverCard>
                          ) : (
                            <span>{val.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger><EllipsisVertical className="cursor-pointer" /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(attr)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(attr.id)}>Edit</DropdownMenuItem>
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
  );
}
