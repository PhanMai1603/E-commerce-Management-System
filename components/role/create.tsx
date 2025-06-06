/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { createRole } from "@/app/api/role";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const categories = ["PAGE", "MANAGE_PRODUCT", "SYSTEM", "MANAGE_ORDER", "SETTING"] as const;
const entities: { [key in typeof categories[number]]: string[] } = {
    PAGE: ["PANEL", "DASHBOARD"],
    MANAGE_PRODUCT: ["PRODUCT", "CATEGORY", "ATTRIBUTE", "SKU", "UPLOAD", "COUPON"],
    SYSTEM: ["USER", "ROLE"],
    MANAGE_ORDER: ["REVIEW", "ORDER"],
    SETTING: ["PAYMENT_TYPE", "DELIVERY_TYPE", "CITY"],
};
const actions = ["CREATE", "VIEW", "UPDATE", "DELETE"];

const RoleCreationForm = ({ onRoleCreated, onCancel }: { onRoleCreated: () => void; onCancel: () => void }) => {
    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState<Record<string, Record<string, Record<string, boolean>>>>({});

    const togglePermission = (category: string, entity: string, action: string) => {
        setPermissions((prev) => ({
            ...prev,
            [category]: {
                ...(prev[category] || {}),
                [entity]: {
                    ...(prev[category]?.[entity] || {}),
                    [action]: !(prev[category]?.[entity]?.[action] ?? false),
                },
            },
        }));
    };

    const handleSubmit = async () => {
        if (!roleName.trim()) {
            toast.error("Role name cannot be empty");
            return;
        }

        // Retrieve userId and accessToken from localStorage
        const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
        const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

        // Make sure userId and accessToken are not empty
        if (!userId || !accessToken) {
            toast.error("User ID or Access Token is missing");
            return;
        }

        try {
            // Pass the correct arguments to createRole
            await createRole({ name: roleName, permissions }, userId, accessToken);
            toast.success("Role created successfully!");
            onRoleCreated();
            onCancel();
        } catch (error) {
            toast.error("Failed to create role");
        }
    };


    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Role</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Enter role name"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        className="mb-4"
                    />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                {actions.map((action) => (
                                    <TableHead key={action} className="text-center">{action}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <React.Fragment key={category}>
                                    {/* Dòng tiêu đề cho mỗi danh mục */}
                                    <TableRow key={`${category}-header`} className="bg-gray-200">
                                        <TableCell colSpan={actions.length + 1} className="font-bold">
                                            {category}
                                        </TableCell>
                                    </TableRow>

                                    {/* Danh sách entity bên trong danh mục */}
                                    {entities[category].map((entity) => (
                                        <TableRow key={`${category}-${entity}`}>
                                            <TableCell className="pl-6">{entity}</TableCell>
                                            {actions.map((action) => (
                                                <TableCell key={`${category}-${entity}-${action}`} className="text-center">
                                                    <Checkbox
                                                        checked={!!(permissions[category]?.[entity]?.[action] ?? false)}
                                                        onCheckedChange={() => togglePermission(category, entity, action)}
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>

            <div className="flex justify-end gap-3 mt-2">
                <Button
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                >
                    Create Role
                </Button>
            </div>

        </div>
    );
};

export default RoleCreationForm;
