import RootLayout from "./RootLayout";

export const metadata = {
  title: "My task management",
  icons: {
    icon: "/favicon.png",
  },
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
