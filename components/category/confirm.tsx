import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    open,
    title = "Confirm Delete",
    description = "Are you sure you want to delete this item?",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <p>{description}</p>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        className="bg-black text-white hover:bg-neutral-800"
                        onClick={onConfirm}
                    >
                        Delete
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}
