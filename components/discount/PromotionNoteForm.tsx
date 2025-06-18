/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function PromotionNoteForm({ note, setNote }: any) {
    return (
        <Card className="col-span-1 flex flex-col">
            <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1">
                <Textarea
                    className="w-full"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="VD: Khuyến mãi hè, áp dụng nội bộ, ..."
                />
            </CardContent>

        </Card>
    );
}
