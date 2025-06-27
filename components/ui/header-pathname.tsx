"use client";

import { usePathname } from "next/navigation";

const HeaderPathname = () => {
  const pathaname = usePathname().split("/");
  const lastPathname = pathaname[pathaname.length - 1];

  return (
    <h1 className="header-title hidden sm:block">Manajemen {lastPathname}</h1>
  );
};

export default HeaderPathname;
