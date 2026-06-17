import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@packages/ui/components/ui/button";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packages/ui/components/ui/select";

import { useCreateSupplierProduct } from "@/domains/supplier/supplier.query"; // Adjust path as needed
import { categoryQueries } from "@/domains/category/category.query"; // Adjust path as needed
import { uomQueries } from "@/domains/uom/uom.query"; // Adjust path as needed
import type { ICreateProductBody } from "@/domains/supplier/supplier.types"; // Adjust path as needed
import type { ICategory } from "@/domains/category/category.types"; // Adjust path as needed
import type { IUom } from "@/domains/uom/uom.types"; // Adjust path as needed

interface CreateProductFormProps {
  supplierId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateProductForm({
  supplierId,
  onSuccess,
  onCancel,
}: CreateProductFormProps) {
  // Form State
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD"); // Default to USD
  const [uomId, setUomId] = useState<string>("");
  const [leadTimeDays, setLeadTimeDays] = useState<string>("");

  // Fetch Dropdown Data
  const { data: rawCategories, isLoading: loadingCategories } = useQuery(
    categoryQueries.list()
  );
  const { data: rawUoms, isLoading: loadingUoms } = useQuery(uomQueries.list());

  // Safely extract arrays (handles both direct arrays and { data: [...] } wraps)
  const categories: ICategory[] = Array.isArray(rawCategories)
    ? rawCategories
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (rawCategories as any)?.data || [];
  const uoms: IUom[] = Array.isArray(rawUoms)
    ? rawUoms
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (rawUoms as any)?.data || [];

  // Setup Mutation
  const { mutate: createProduct, isPending } = useCreateSupplierProduct();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ICreateProductBody = {
      product_name: productName.trim(),
      category_id: Number(categoryId),
      unit_price: Number(unitPrice),
      currency: currency.trim(),
      unit_of_measure_id: Number(uomId),
      lead_time_days: Number(leadTimeDays),
    };

    createProduct({ supplierId, payload }, { onSuccess });
  };

  // Validation
  const isFormValid =
    productName.trim() &&
    categoryId &&
    unitPrice &&
    currency.trim() &&
    uomId &&
    leadTimeDays &&
    !isPending;

  return (
    <form onSubmit={handleSubmit} className="py-4 space-y-4">
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="productName">
          Product Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="productName"
          placeholder="e.g., Industrial HVAC Unit"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>

      {/* Category Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="category">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select
          value={categoryId}
          onValueChange={setCategoryId}
          disabled={loadingCategories}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={loadingCategories ? "Loading..." : "Select category"}
            />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price & Currency Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unitPrice">
            Unit Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="unitPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">
            Currency <span className="text-red-500">*</span>
          </Label>
          <Input
            id="currency"
            placeholder="USD"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            maxLength={3}
            required
          />
        </div>
      </div>

      {/* UoM Dropdown & Lead Time Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="uom">
            Unit of Measure <span className="text-red-500">*</span>
          </Label>
          <Select value={uomId} onValueChange={setUomId} disabled={loadingUoms}>
            <SelectTrigger>
              <SelectValue
                placeholder={loadingUoms ? "Loading..." : "Select unit"}
              />
            </SelectTrigger>
            <SelectContent>
              {uoms.map((uom) => (
                <SelectItem key={uom.id} value={String(uom.id)}>
                  {uom.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="leadTimeDays">
            Lead Time (Days) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="leadTimeDays"
            type="number"
            min="0"
            placeholder="e.g., 14"
            value={leadTimeDays}
            onChange={(e) => setLeadTimeDays(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!isFormValid}>
          {isPending ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
