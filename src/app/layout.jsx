import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/app-wide/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Student Administration System",
    description: "Student Administration System",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className} style={{ margin: 0 }}>
        <Provider>
            <div>{children}</div> {/* Apply the class here */}
        </Provider>
        </body>
        </html>
    );
}