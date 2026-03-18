import './globals.css';
import Provider from '@/app/provider';

export const metadata = {
  title: 'FlightBook Demo',
  description: 'Training-ready Next.js flight booking demo with JSON-backed APIs and seat selection.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
