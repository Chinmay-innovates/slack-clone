import { Doc } from "../../convex/_generated/dataModel";

interface UpdatedAtTextProps {
	text: Doc<"messages">["updatedAt"];
}

export const UpdatedAtText = ({ text }: UpdatedAtTextProps) => {
	return (
		<>
			{text ? (
				<span className="text-xs text-muted-foreground">(edited)</span>
			) : null}
		</>
	);
};
