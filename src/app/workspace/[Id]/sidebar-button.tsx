import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface SidebarButtonProps {
	icon: LucideIcon | IconType;
	label: string;
	isactive?: boolean;
}

export const SidebarButton = ({
	icon: Icon,
	label,
	isactive,
}: SidebarButtonProps) => {
	return (
		<div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
			<Button
				variant="transparent"
				className={cn(
					"size-9 p-2 group-hover:bg-accent/20",
					isactive && "bg-accent/20"
				)}
			>
				<Icon className="text-white size-5 group-hover:scale-125 transition-all" />
			</Button>
			<span className="text-[11px] text-white group-hover:text-accent">
				{label}
			</span>
		</div>
	);
};
