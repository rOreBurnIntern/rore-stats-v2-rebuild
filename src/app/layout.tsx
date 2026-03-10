/* eslint-disable @next/next/no-css-tags */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "rORE Stats Dashboard",
  description: "Burncoin-inspired dark dashboard for rORE protocol analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="coffee">
      <head>
        <link rel="stylesheet" href="/vendor/daisyui/themes.css" />
        <link rel="stylesheet" href="/vendor/daisyui/styled.css" />
      </head>
      <body className="bg-base-200 text-base-content antialiased">
        <div className="app-shell dashboard-burncoin-shell flex min-h-screen flex-col overflow-x-auto bg-base-200 font-sans">
          <header className="dashboard-shell-header border-b border-white/10">
            <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-4 px-4 py-4">
              <div>
                <p className="dashboard-accent text-xs font-semibold uppercase tracking-[0.3em]">
                  rORE Protocol
                </p>
                <p className="dashboard-muted text-sm">Stats dashboard</p>
              </div>
              <p className="dashboard-chip rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em]">
                Burncoin Dark Theme
              </p>
            </div>
          </header>
          <main className="dashboard-main flex-1">
            <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col px-4 py-8">
              {children}
            </div>
          </main>
          <footer className="dashboard-footer border-t border-white/10">
            <div className="mx-auto w-full max-w-7xl min-w-0 px-4 py-4 text-center text-sm">
              Data sourced from rORE Protocol API
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
