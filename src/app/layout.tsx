import "./globals.css";

export const metadata = {
  title: "Rubik's Cube Solver (Offline)",
  description: "Offline Rubik's cube solver with animated 3D playback."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">{children}</body>
    </html>
  );
}
