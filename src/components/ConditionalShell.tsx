"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { NavbarContent } from "@/components/Navbar";
import type { FooterContent } from "@/components/Footer";

interface Props {
  children: React.ReactNode;
  navbarData: NavbarContent | null;
  footerData: FooterContent | null;
}

export default function ConditionalShell({ children, navbarData, footerData }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar data={navbarData} />
      {children}
      <Footer data={footerData} />
    </>
  );
}
