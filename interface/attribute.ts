export interface AttributeData{
    name: string;
    type: "COLOR" | "TEXT";
    isVariantAttribute: boolean;
    values?: AddValue[];
}

//POST
export interface AddValue {
    value: string;
    description_url: string;
}

export interface AttributeResponse {
    id: string;
}

//
export interface addValueToAttribute{
    attributeId: string;
    values: AddValue[];
}

export interface ValuesData{
    id: string;
    value: string;
}
export interface addValueToAttributeResponse {
    attributeId: string;
    addedValues: ValuesData[];
}


//GET
export interface AttributeValue {
    id: null | undefined;
    valueId: string;
    value: string;
    descriptionUrl: string;
}

export interface AttributeItem {
    id: string;
    name: string;
    slug: string;
    type: "COLOR" | "TEXT";
    isVariantAttribute: boolean;
    values: AttributeValue[];
    isActive: boolean;
}

export interface AllAttributeResponse {
    total: number;
    totalPages: number;
    page: number;
    size: number;
    hasMore: boolean;
    items: AttributeItem[];
}
