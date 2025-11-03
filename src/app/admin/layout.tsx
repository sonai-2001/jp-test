import AdminWrapper from "../components/admin/Layout/AdminWrapper";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
    <AdminWrapper>{children}</AdminWrapper>
    </>
  );
}
