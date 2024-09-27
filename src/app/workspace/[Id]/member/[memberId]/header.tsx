import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import { Hint } from "@/components/hint";
import { VideoIcon } from "lucide-react";
import { useState } from "react";
interface HeaderProps {
	memberName?: string;
	memberImage?: string;
	onClick?: () => void;
}

export const Header = ({
	memberImage,
	memberName = "Member",
	onClick,
}: HeaderProps) => {
	const avatarFallback = memberName.charAt(0).toUpperCase();
	const [media, setMedia] = useState(false);
	const onIconClick = () => {
		setMedia(true);
	};
	return (
		<div className="bg-white border-gray-500/80 border-b h-[49px] flex items-center px-4 overflow-hidden">
			<Button
				variant="ghost"
				size="sm"
				className="text-lg font-semibold px-2 overflow-hidden w-auto"
				onClick={onClick}
			>
				<Avatar className="size-6 mr-2">
					<AvatarImage src={memberImage} />
					<AvatarFallback>{avatarFallback}</AvatarFallback>
				</Avatar>
				<span className="truncate">{memberName}</span>
				<FaChevronDown className="size-2.5 ml-2" />
			</Button>
			<div onClick={onIconClick} className="flex items-center justify-center">
				<Hint label="Video" side="bottom" align="center">
					<VideoIcon className="hover:text-seablue-200 hover:cursor-pointer size-5 flex items-center mr-3" />
				</Hint>
			</div>
			
		</div>
	);
};
