import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
interface SpinnerProps {
	className?: string;
}
export const Spinner = ({ className }: SpinnerProps) => {
	return (
		<div className={cn("h-full flex items-center justify-center", className)}>
			<Loader className="size-5 animate-spin text-muted-foreground" />
		</div>
	);
};
