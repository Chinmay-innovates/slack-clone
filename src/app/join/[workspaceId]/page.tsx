"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import VerificationInput from "react-verification-input";
import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";

import { Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";

interface JoinPageProps {
	params: {
		workspaceId: Id<"workspaces">;
	};
}

const JoinPage = ({ params }: JoinPageProps) => {
	const router = useRouter();
	const { mutate, isPending, isError } = useJoin();
	const { data, isLoading } = useGetWorkspaceInfo({ id: params.workspaceId });

	const isMember = useMemo(() => data?.isMember, [data?.isMember]);

	useEffect(() => {
		if (isMember) router.replace(`/workspace/${params.workspaceId}`);
	}, [isMember, router, params.workspaceId]);

	const handleComplete = (value: string) => {
		mutate(
			{
				workspaceId: params.workspaceId,
				joinCode: value,
			},
			{
				onSuccess: (id) => {
					router.replace(`/workspace/${id}`);
					toast.success("Workspace joined.");
				},
				onError: () => {
					toast.error("Failed to join workspace.");
				},
			}
		);
	};

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
					onComplete={handleComplete}
					classNames={{
						container: cn(
							"flex gap-2",
							isPending && "opacity-50 cursor-not-allowed",
							!isPending && "bg-white"
						),
						character: cn(
							"uppercase h-auto rounded-md  border border-gray-300 flex items-center justify-center text-lg font-bold  text-gray-500",
							isError &&	data?.isMember && "border-red-500",
						),
						characterInactive: "bg-muted",
						characterSelected: cn(
							"bg-white text-black",
							isError && "border-red-500 text-red-500"
						),
						characterFilled: cn(
							"bg-white text-black",
							isError && "border-red-500",
						),
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
