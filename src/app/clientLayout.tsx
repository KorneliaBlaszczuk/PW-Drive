'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

const HIDDEN_LAYOUT_PATHS = ["/logIn", "/register"];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() ?? '';
    const isHiddenLayout = HIDDEN_LAYOUT_PATHS.includes(pathname);

    return (
        <>
            {!isHiddenLayout && <Header />}
            <main>{children}</main>
            {!isHiddenLayout && <Footer />}
        </>
    );
}
