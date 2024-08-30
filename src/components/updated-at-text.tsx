import { Doc, Id } from "../../convex/_generated/dataModel";

interface UpdatedAtTextProps {
	text: Doc<"messages">["updatedAt"];
	reactions: Array<
		Omit<Doc<"reactions">, "memberId"> & {
			count: number;
			memberId: Id<"members">;
		}
	>;
}

export const UpdatedAtText = ({ text, reactions }: UpdatedAtTextProps) => {
	const r = JSON.stringify(reactions);
	return (
		<>
			{text ? (
				<span className="text-xs text-muted-foreground">(edited)</span>
			) : null}
			{/* {JSON.stringify(reactions)} */}
			{/* {console.log([{r}])} */}
		</>
	);
};
