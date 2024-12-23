import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/app-wide/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "App Name ",
  description: "Student Administration System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0 }}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
