import { Footer } from "@/components/layouts/public/footer";
import { Header } from "@/components/layouts/public/header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header/>
      {children}
      <Footer />
    </>
  );
}
