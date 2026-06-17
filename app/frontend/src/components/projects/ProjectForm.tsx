import { Input } from "@packages/ui/components/ui/input";
import { Label } from "@packages/ui/components/ui/label";
import type { IProjectFormValues } from "@/types/project.type";
import { useForm } from "react-hook-form";

interface ProjectFormProps {
  id?: string;
  onSubmit: (data: IProjectFormValues) => void;
  defaultValues?: Partial<IProjectFormValues>;
}

export function ProjectForm({ id, onSubmit, defaultValues }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProjectFormValues>({
    defaultValues,
  });

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6 py-4">
        {/* Project Name Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-slate-700">
            Project Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter project name"
            {...register("project_name", {
              required: "Project name is required",
            })}
          />
          {errors.project_name && (
            <span className="text-xs text-red-500">
              {errors.project_name.message}
            </span>
          )}
        </div>

        {/* Client / Buyer Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="client" className="text-slate-700">
            Client / Buyer <span className="text-red-500">*</span>
          </Label>
          <Input
            id="client"
            placeholder="Enter client or buyer name"
            {...register("client_name", {
              required: "Client name is required",
            })}
          />
          {errors.client_name && (
            <span className="text-xs text-red-500">
              {errors.client_name.message}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
