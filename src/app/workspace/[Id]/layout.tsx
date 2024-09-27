"use client";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Id } from "../../../../convex/_generated/dataModel";

import { usePanel } from "@/hooks/use-panel";

import { Thread } from "@/features/messages/components/thread";
import { Profile } from "@/features/members/components/profile";
import { Spinner } from "@/components/spinner";
interface WorkspaceLayoutProps {
	children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
	const { parentMessageId, onClose, profileMemberId } = usePanel();

	const showPanel = !!parentMessageId || !!profileMemberId;

	return (
		<div className="h-full ">
			<Toolbar />
			<div className="flex h-[calc(100vh-40px)]">
				<Sidebar />
				<ResizablePanelGroup
					autoSaveId="sc-workspace-layout"
					direction="horizontal"
				>
					<ResizablePanel
						defaultSize={20}
						minSize={11}
						className="bg-maroon-300"
					>
						<WorkspaceSidebar />
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel minSize={20} defaultSize={80}>
						{children}
					</ResizablePanel>
					{showPanel && (
						<>
							<ResizableHandle withHandle />
							<ResizablePanel minSize={20} defaultSize={29}>
								{parentMessageId ? (
									<Thread
										messageId={parentMessageId as Id<"messages">}
										onClose={onClose}
									/>
								) : profileMemberId ? (
									<Profile
										memberId={profileMemberId as Id<"members">}
										onClose={onClose}
									/>
								) : (
									<Spinner />
								)}
							</ResizablePanel>
						</>
					)}
				</ResizablePanelGroup>
			</div>
		</div>
	);
};

export default WorkspaceLayout;
