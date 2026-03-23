export const metadata = {
  title: "Baby Oracle — Chinese Gender Chart & Sun Sign Divination",
  description:
    "Predict your baby's gender using the ancient Chinese Gender Calendar and discover their sun sign. For entertainment only.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0d0f1a" }}>
        {children}
      </body>
    </html>
  );
}
