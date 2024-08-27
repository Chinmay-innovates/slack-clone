import { usePathname } from "next/navigation";

import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import { UserButton } from "@/features/components/user-button";

export const Sidebar = () => {
	const pathname = usePathname();
	return (
		<aside className="w-[70px] bg-maroon-200 flex flex-col gap-y-4 items-center pt-[9px] pb-4">
			<WorkspaceSwitcher />
			<SidebarButton
				icon={Home}
				label="Home"
				isactive={pathname.includes("/workspace")}
			/>
			<SidebarButton icon={MessagesSquare} label="DMs" />
			<SidebarButton icon={Bell} label="Activity" />
			<SidebarButton icon={MoreHorizontal} label="More" />
			<div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
				<UserButton />
			</div>
		</aside>
	);
};
