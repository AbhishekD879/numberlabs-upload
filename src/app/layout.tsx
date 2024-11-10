"use client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#EAF6ED",
          width: "100vw",
          height: "100vh",
          margin: 0,
        }}
      >
        <div>{children}</div>
      </body>
    </html>
  );
}
