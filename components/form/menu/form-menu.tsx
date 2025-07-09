import { MenuSchema } from "@/lib/zod/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface iProps {
  menuId?: string;
  type: "CREATE" | "UPDATE" | "DETAIL";
  onClose: () => void;
}

const FormMenu = ({ menuId, type, onClose }: iProps) => {
  const form = useForm<z.infer<typeof MenuSchema>>({
    resolver: zodResolver(MenuSchema),
    defaultValues: {
      name: "",
      image: "",
      price: "",
      status: "AVAILABLE",
      storeId: "",
      categoryId: "",
    },
  });

  const [isSearching, setIsSearching] = useState(false);

  return <div>FormMenu</div>;
};

export default FormMenu;
