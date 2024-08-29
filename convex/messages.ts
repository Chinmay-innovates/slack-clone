import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const getMember = async (
	ctx: QueryCtx,
	workspaceId: Id<"workspaces">,
	userId: Id<"users">
) => {
	return ctx.db
		.query("members")
		.withIndex("by_workspace_id_user_id", (q) =>
			q.eq("workspaceId", workspaceId).eq("userId", userId)
		)
		.unique();
};

export const create = mutation({
	args: {
		body: v.string(),
		image: v.optional(v.id("_storage")),
		workspaceId: v.id("workspaces"),
		channelId: v.optional(v.id("channels")),
		conversationId: v.optional(v.id("conversations")),
		parentMessageId: v.optional(v.id("messages")),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("Unauthorized");

		const member = await getMember(ctx, args.workspaceId, userId);
		if (!member) throw new Error("Unauthorized");

		let _conversationId = args.conversationId;

		// Only possible if we are replying to a thread in 1:1 conversation
		if (!args.conversationId && !args.channelId && args.parentMessageId) {
			const parentMessageId = await ctx.db.get(args.parentMessageId);

			if (!parentMessageId) throw new Error("Parent message id not found");

			_conversationId = parentMessageId.conversationId;
		}
		const messageId = await ctx.db.insert("messages", {
			memberId: member._id,
			body: args.body,
			image: args.image,
			channelId: args.channelId,
			conversationId: _conversationId,
			workspaceId: args.workspaceId,
			parentMessageId: args.parentMessageId,
			updatedAt: Date.now(),
		});

		return messageId;
	},
});
