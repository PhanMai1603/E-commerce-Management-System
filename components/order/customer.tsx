import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ShippingAddress } from "@/interface/order";
import { User, Phone, MapPin } from "lucide-react";

interface CustomerProps {
  address: ShippingAddress;
}

export default function Customer({ address }: CustomerProps) {
  if (!address) return null;

  return (
    <div className="col-span-1">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Customer Details</h3>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 mt-1 text-primary" />
            <div>
              <p className="text-muted-foreground">Full Name</p>
              <p className="font-medium text-foreground">{address.fullname}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 mt-1 text-primary" />
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">{address.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-1 text-primary" />
            <div>
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium text-foreground">
                {`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
