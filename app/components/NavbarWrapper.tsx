"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Upload from "./Upload";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const [showUpload, setShowUpload] = useState(false);

  // pages where navbar must be hidden
  const hideNavbarRoutes = ["/", "/login", "/signup"];

  if (hideNavbarRoutes.includes(pathname)) {
    return null;
  }

  return (
    <>
      <Navbar setShowUpload={setShowUpload} />

      {showUpload && (
        <Upload
          onClose={() => setShowUpload(false)}
          className="fixed right-0 top-0 w-[400px] h-full bg-white shadow-lg z-9999"
        />
      )}
    </>
  );
}
