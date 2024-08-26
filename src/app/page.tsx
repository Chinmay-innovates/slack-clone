"use client";

import { UserButton } from "@/features/auth/components/user-button";

import { useGetWorkspaces } from "@/features/auth/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/auth/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
	const [open, setOpen] = useCreateWorkspaceModal();
	const { data, isLoading } = useGetWorkspaces();
	const router = useRouter();

	const workspaceId = useMemo(() => data?.[0]?._id, [data]);

	useEffect(() => {
		if (isLoading) return;

		if (workspaceId) {
			router.replace(`/workspace/${workspaceId}`);
		} else if (!open) {
			setOpen(true);
		}
	}, [workspaceId, isLoading, open, setOpen, router]);

	return (
		<div>
			<UserButton />
		</div>
	);
}
