"use client";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const ThreadsPage = () => {
	const workspaceId = useWorkspaceId();

	return <div>ThreadsPage {workspaceId}</div>;
};

export default ThreadsPage;
