import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import { JotaiProvider } from "@/components/jotai-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Slack clone",
	description:
		"Slack clone a cloud-based messaging app that helps teams communicate and collaborate. It's designed to help organizations work more flexibly and inclusively, and can be used by teams of all sizes.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ConvexAuthNextjsServerProvider>
			<html lang="en">
				<body className={inter.className}>
					<ConvexClientProvider>
						<JotaiProvider>
							<Toaster />
							<Modals />
							{children}
						</JotaiProvider>
					</ConvexClientProvider>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	);
}
