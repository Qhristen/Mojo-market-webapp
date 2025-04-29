"use client";

import { Copy, Edit, MoreHorizontal, Trash, View } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TokenPair } from "@/types";

interface CellActionProps {
  data: TokenPair;
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
