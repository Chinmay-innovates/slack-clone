import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface useGetChannelsProps {
  workspaceId: Id<"workspaces">;
}
export const useGetChannels = ({ workspaceId }: useGetChannelsProps) => {
  const data = useQuery(api.channels.get, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
