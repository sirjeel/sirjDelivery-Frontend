
import  ReduxProvider from "../providers/StoreProvider";
import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <ReduxProvider>       
          {children}        
      </ReduxProvider>
      </body>
    </html>
  )
}
