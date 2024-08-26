"use client";

import { ReactNode } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

interface HintProps {
	label: string;
	children: ReactNode;
	side?: "top" | "right" | "bottom" | "left";
	align?: "center" | "end" | "start";
}

export const Hint = ({ children, label, align, side }: HintProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent
					side={side}
					align={align}
					className="bg-black text-white border-white/5"
				>
					<p className="text-medium text-xs">{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
