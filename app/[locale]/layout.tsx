import localFont from "next/font/local";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const roboto = localFont({
  src: "../fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-roboto",
  weight: "100 900",
});



export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}