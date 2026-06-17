import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@packages/ui/components/ui/button";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import { Textarea } from "@packages/ui/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packages/ui/components/ui/select";

import { useCreateProjectSpecItem } from "@/domains/project/project.query";
import { categoryQueries } from "@/domains/category/category.query";
import { uomQueries } from "@/domains/uom/uom.query";
import type { ICreateSpecItemBody } from "@/domains/project/project.types";
import type { ICategory } from "@/domains/category/category.types";
import type { IUom } from "@/domains/uom/uom.types";

interface CreateNewSpecItemFormProps {
  projectId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SpecItemForm({
  projectId,
  onSuccess,
  onCancel,
}: CreateNewSpecItemFormProps) {
  // Form State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [uomId, setUomId] = useState<string>("");
  const [description, setDescription] = useState("");

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
  const { mutate: createSpecItem, isPending } = useCreateProjectSpecItem();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map state to payload matching ICreateSpecItemBody perfectly
    const payload: ICreateSpecItemBody = {
      name,
      category_id: Number(categoryId),
      quantity: Number(quantity),
      unit_of_measure_id: Number(uomId),
      description: description.trim() || undefined,
    };

    createSpecItem({ projectId, payload }, { onSuccess });
  };

  // Validation: Check if required fields are filled
  const isFormValid =
    name.trim() && categoryId && quantity && uomId && !isPending;

  return (
    <form onSubmit={handleSubmit} className="py-4 space-y-4">
      {/* Item Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Item Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g., 4mm Copper Cable"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Category */}
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

      {/* Quantity & UoM Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

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
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter item description..."
          className="resize-none h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
          {isPending ? "Adding..." : "Add Spec Item"}
        </Button>
      </div>
    </form>
  );
}
