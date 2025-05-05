"use client";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Pair } from "@/generated/ts";
import { MaybeAccount } from "gill";

interface CellActionProps {
  data: MaybeAccount<Pair>;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
   
  };

  const onDelete = async () => {
    router.refresh()
  };

  return (
    <Button variant={"outline"} className="bg-primary-mojo text-white">
      Trade
    </Button>
  );
};
