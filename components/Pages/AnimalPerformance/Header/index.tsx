import { SelectBatch } from "@/components/Global/SelectBatch/Index";
import { SelectAnimal } from "./SelectAnimal";

export default function Header() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Performance do animal</h1>
        <div className="flex gap-2">
          <SelectBatch />
          <SelectAnimal />
        </div>
      </div>
    </div>
  );
}