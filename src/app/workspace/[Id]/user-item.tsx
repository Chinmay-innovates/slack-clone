import Link from "next/link";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Id } from "../../../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const userItemVariants = cva(
	"flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
	{
		variants: {
			variant: {
				default: "text-[#F9EDFFCC]",
				active: "text-[#482139] bg-white/90 hover:bg-white/90",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);
interface UserItemProps {
	id: Id<"members">;
	label?: string;
	image?: string;
	variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({
	id,
	image,
	label = "Member",
	variant,
}: UserItemProps) => {
	const workspaceId = useWorkspaceId();
	const avatarFallback = label.charAt(0).toUpperCase();
	return (
		<Button
			asChild
			size="sm"
			variant="transparent"
			className={cn(userItemVariants({ variant }))}
		>
			<Link href={`/workspace/${workspaceId}/member/${id}`}>
				<Avatar className="size-5 mr-1">
					<AvatarImage src={image} />
					<AvatarFallback>{avatarFallback}</AvatarFallback>
				</Avatar>
				<span className="text-sm truncate">{label}</span>
			</Link>
		</Button>
	);
};
