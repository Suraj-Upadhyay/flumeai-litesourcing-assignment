import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@packages/ui/components/ui/button";
import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";

// Assuming you have Shadcn Popover and Command available
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@packages/ui/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@packages/ui/components/ui/command";
import { cn } from "@packages/ui/lib/utils";

import { useCreateSupplier } from "@/domains/supplier/supplier.query";
import { countryQueries } from "@/domains/country/country.query";
import type { ICreateSupplierBody } from "@/domains/supplier/supplier.types";

interface CreateSupplierFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Temporary type assumption for country. Adjust if your API returns something else.
interface ICountry {
  id?: number | string;
  name: string;
}

export function CreateSupplierForm({
  onSuccess,
  onCancel,
}: CreateSupplierFormProps) {
  // Form State
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");

  // Combobox Open State
  const [openCountry, setOpenCountry] = useState(false);

  // Fetch Countries
  const { data: rawCountries, isLoading: loadingCountries } = useQuery(
    countryQueries.list()
  );

  // Safely extract country list
  const countries: ICountry[] = Array.isArray(rawCountries)
    ? rawCountries
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (rawCountries as any)?.data || [];

  // Setup Mutation
  const { mutate: createSupplier, isPending } = useCreateSupplier();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ICreateSupplierBody = {
      name: name.trim(),
      country: country.trim(),
      website: website.trim() || undefined,
    };

    createSupplier(payload, { onSuccess });
  };

  // Validation: Check if required fields are filled
  const isFormValid = name.trim() && country.trim() && !isPending;

  return (
    <form onSubmit={handleSubmit} className="py-4 space-y-4">
      {/* Supplier Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Supplier Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g., Acme Corp"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Country (Searchable Dropdown) */}
      <div className="space-y-2 flex flex-col">
        <Label htmlFor="country">
          Country <span className="text-red-500">*</span>
        </Label>
        <Popover open={openCountry} onOpenChange={setOpenCountry}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCountry}
              className={cn(
                "w-full justify-between font-normal",
                !country && "text-muted-foreground"
              )}
              disabled={loadingCountries}
            >
              {country
                ? country
                : loadingCountries
                  ? "Loading..."
                  : "Select country..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0 pointer-events-auto"
            align="start"
          >
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((c) => (
                    <CommandItem
                      key={c.name}
                      value={c.name}
                      onSelect={(currentValue) => {
                        // Shadcn command lowercase values by default, so we set it back to the original casing
                        const selectedCountry = countries.find(
                          (item) =>
                            item.name.toLowerCase() ===
                            currentValue.toLowerCase()
                        );
                        setCountry(selectedCountry ? selectedCountry.name : "");
                        setOpenCountry(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          country.toLowerCase() === c.name.toLowerCase()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {c.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website">Website (Optional)</Label>
        <Input
          id="website"
          type="url"
          placeholder="e.g., https://acmecorp.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
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
          {isPending ? "Saving..." : "Save Supplier"}
        </Button>
      </div>
    </form>
  );
}
