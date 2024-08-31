"use client";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/features/messages/components/thread";
import { Spinner } from "@/components/spinner";

interface WorkspaceLayoutProps {
	children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
	const { parentMessageId, onClose, onOpenMessage } = usePanel();

	const showPanel = !!parentMessageId;

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
					<ResizablePanel minSize={20}>{children}</ResizablePanel>
					{showPanel && (
						<>
							<ResizableHandle withHandle />
							<ResizablePanel minSize={20} defaultSize={29}>
								{parentMessageId ? (
									<Thread
										messageId={parentMessageId as Id<"messages">}
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
