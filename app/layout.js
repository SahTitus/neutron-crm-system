import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/features/ThemeProvider";
import { Sidebar } from "@components/shared/Sidebar";
import AuthProviders from "@components/features/Provider";
import { StateProvider } from "@redux/StateProvider";
import { UserSession } from "@components/features/UserSession";
import { Navbar } from "@components/shared/Navbar";
import { OfflineIndicator } from "@components/features/OfflineIndicator";
import { siteName } from "@lib/constants";
import { seoRobot_config } from "@lib/seo/seoConfig";
import { routes } from "@lib/routes";
import { homeMetadata } from "@lib/seo/seoMetadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: siteName,
  siteName: siteName,
  description: homeMetadata.description,
  icons: {
    icon: routes?.neutronIcon,
    shortcut: routes?.neutronIcon,
    apple: routes?.neutronIcon,
    other: {
      rel: routes?.neutronIcon,
      url: routes?.neutronIcon,
    },
    // category: 'Website',
  },
  robots: seoRobot_config,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProviders>
          <StateProvider>
            <ThemeProvider>
              <div className="flex h-screen overflow-hidden ">
                {/* Sidebar Container */}
                <div className="h-full">
                  <Sidebar />
                </div>

                {/* Main Content Container */}
                <div className="flex flex-col flex-1 px-[1%] bg-slate-200 dark:bg-[#151a2d] overflow-hidden">
                  <div className="sticky top-0 z-10 ">
                    <Navbar />
                  </div>
                  <div id="main-container" className="flex-1 main-container overflow-auto custom-scrollbar">
                    {children}
                  </div>
                </div>
              </div>
              <OfflineIndicator />
              <UserSession />
            </ThemeProvider>
          </StateProvider>
        </AuthProviders>
      </body>
    </html>
  );
}
