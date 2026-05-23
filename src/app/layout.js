import "./globals.css";

export const metadata = {
  title: "MoneyMap",
  description: "Expense Manager App",
  icons: {
    icon: "/favicon.ico",
  },

};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}