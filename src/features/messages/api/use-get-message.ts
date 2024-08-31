import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface useGetMessageProps {
	id: Id<"messages">;
}
export const useGetMessage = ({ id }: useGetMessageProps) => {
	const data = useQuery(api.messages.getById, { id });
	const isLoading = data === undefined;

	return { data, isLoading };
};
