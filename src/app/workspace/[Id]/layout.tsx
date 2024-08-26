"use client";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { WorkspaceSidebar } from "./workspace-sidebar";

interface WorkspaceLayoutProps {
	children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
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
				</ResizablePanelGroup>
			</div>
		</div>
	);
};

export default WorkspaceLayout;
