"use client";

import { usePathname } from "next/navigation";

const HeaderPathname = () => {
  const pathaname = usePathname().split("/");
  const lastPathname = pathaname[pathaname.length - 1];

  return <h1 className="text-lg font-semibold capitalize">{lastPathname}</h1>;
};

export default HeaderPathname;
