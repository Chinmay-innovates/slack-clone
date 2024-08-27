"use client";

import Image from "next/image";
import Link from "next/link";
import VerificationInput from "react-verification-input";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
interface JoinPageProps {
	params: {
		workspaceId: Id<"workspaces">;
	};
}

const JoinPage = ({ params }: JoinPageProps) => {
	const { data, isLoading } = useGetWorkspaceInfo({ id: params.workspaceId });

	if (isLoading)
		return (
			<div className="h-full flex items-center justify-center">
				<Loader className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	return (
		<div className="h-full flex items-center justify-center  flex-col gap-y-8  bg-white p-8 rounded-lg shadow-md">
			<Image src="/logo.png" alt="Logo" width={250} height={250} />
			<div className="flex flex-col gap-y-4 items-center  max-w-md">
				<div className="flex flex-col gap-y-2 items-center justify-center">
					<h1 className="text-2xl font-extrabold">Join {data?.name}</h1>
					<p className="text-muted-foreground text-md">
						Enter the workspace code to join
					</p>
				</div>
				<VerificationInput
					length={6}
					autoFocus
					classNames={{
						container: "flex gap-2",
						character:
							"uppercase h-auto rounded-md  border border-gray-300 flex items-center justify-center text-lg font-bold  text-gray-500 ",
						characterInactive: "bg-muted",
						characterSelected: "bg-white text-black",
						characterFilled: "bg-white text-black",
					}}
				/>
			</div>
			<div className="flex gap-x-4">
				<Button size="lg" variant="outline" asChild>
					<Link href="/">Back to home</Link>
				</Button>
			</div>
		</div>
	);
};

export default JoinPage;
