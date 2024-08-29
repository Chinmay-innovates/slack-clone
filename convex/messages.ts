import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { count, timeStamp } from "console";
import { paginationOptsValidator } from "convex/server";

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

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
	return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
	return ctx.db.get(memberId);
};

const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
	return ctx.db
		.query("reactions")
		.withIndex("by_message_id", (q) => q.eq("messageId", messageId))
		.collect();
};

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
	const messages = await ctx.db
		.query("messages")
		.withIndex("by_parent_message_id", (q) =>
			q.eq("parentMessageId", messageId)
		)
		.collect();

	if (messages.length === 0) {
		return {
			count: 0,
			image: undefined,
			timestamp: 0,
		};
	}
	const lastMessage = messages[messages.length - 1];
	const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

	if (!lastMessageMember) {
		return {
			count: 0,
			image: undefined,
			timestamp: 0,
		};
	}

	const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

	return {
		count: messages.length,
		image: lastMessageUser?.image,
		timestamp: lastMessage._creationTime,
	};
};

// export const get = query({
// 	args: {
// 		channelId: v.optional(v.id("channels")),
// 		conversationId: v.optional(v.id("conversations")),
// 		parentMessageId: v.optional(v.id("messages")),
// 		paginationOpts: paginationOptsValidator,
// 	},
// 	handler: async (ctx, args) => {
// 		const userId = await getAuthUserId(ctx);
// 		if (!userId) throw new Error("Unauthorized");

// 		let _conversationId = args.conversationId;

// 		if (!args.conversationId && !args.channelId && args.parentMessageId) {
// 			const parentMessage = await ctx.db.get(args.parentMessageId);
// 			if (!parentMessage) throw new Error("parent message not found");

// 			_conversationId = parentMessage.conversationId;
// 		}
// 		const results = await ctx.db
// 			.query("messages")
// 			.withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
// 				q
// 					.eq("channelId", args.channelId)
// 					.eq("parentMessageId", args.parentMessageId)
// 					.eq("conversationId", _conversationId)
// 			)
// 			.order("desc")
// 			.paginate(args.paginationOpts);

// 		return {
// 			...results,
// 			page: (
// 			await Promise.all(
// 				results.page
// 					.map(async (message) => {
// 						const member = await populateMember(ctx, message.memberId);
// 						const user = member ? await populateUser(ctx, member.userId) : null;
// 						if (!member || !user) return null;

// 						const reactions = await populateReactions(ctx, message._id);
// 						const thread = await populateThread(ctx, message._id);
// 						const image = message.image
// 							? await ctx.storage.getUrl(message.image)
// 							: undefined;
// 						//  normailizing reactions data
// 						const reactionsWithCounts = reactions.map((reaction) => {
// 							return {
// 								...reaction,
// 								count: reactions.filter((r) => r.value === reaction.value)
// 									.length,
// 							};
// 						});
// 						// required : 😍(4) ❤️(2) 🔥(9)
// 						const dedupedReactions = reactionsWithCounts.reduce(
// 							(acc, reaction) => {
// 								const existingReaction = acc.find(
// 									(r) => r.value === reaction.value
// 								);
// 								if (existingReaction)
// 									existingReaction.memberIds = Array.from(
// 										new Set([...existingReaction.memberIds, reaction.memberId])
// 									);
// 								else acc.push({ ...reaction, memberIds: [reaction.memberId] });

// 								return acc;
// 							},
// 							// --TYPES FOR REACTIONS-- //
// 							[] as (Doc<"reactions"> & {
// 								count: number;
// 								memberIds: Id<"members">[];
// 							})[]
// 						);
// 						/* this : 😅(1) 😅(1)
// 					  to  : 😅(2)

// 					 removing memberId property from reactions */
// 						const reactionsWithoutMemberIds = dedupedReactions.map(
// 							({ memberId, ...rest }) => rest
// 						);

// 						return {
// 							...message,
// 							image,
// 							member,
// 							user,
// 							reactions: reactionsWithoutMemberIds,
// 							threadCount: thread.count,
// 							threadImage: thread.image,
// 							threadTimestamp: thread.timestamp,
// 						};
// 					})
// 				),
//             )
// 		};
// 	},
// });

export const get = query({
	args: {
		channelId: v.optional(v.id("channels")),
		conversationId: v.optional(v.id("conversations")),
		parentMessageId: v.optional(v.id("messages")),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("Unauthorized");

		let _conversationId = args.conversationId;

		if (!args.conversationId && !args.channelId && args.parentMessageId) {
			const parentMessage = await ctx.db.get(args.parentMessageId);
			if (!parentMessage) throw new Error("parent message not found");

			_conversationId = parentMessage.conversationId;
		}
		const results = await ctx.db
			.query("messages")
			.withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
				q
					.eq("channelId", args.channelId)
					.eq("parentMessageId", args.parentMessageId)
					.eq("conversationId", _conversationId)
			)
			.order("desc")
			.paginate(args.paginationOpts);

		const page = (
			await Promise.all(
				results.page.map(async (message) => {
					const member = await populateMember(ctx, message.memberId);
					const user = member ? await populateUser(ctx, member.userId) : null;
					if (!member || !user) return null;

					const reactions = await populateReactions(ctx, message._id);
					const thread = await populateThread(ctx, message._id);
					const image = message.image
						? await ctx.storage.getUrl(message.image)
						: undefined;
					//  normailizing reactions data
					const reactionsWithCounts = reactions.map((reaction) => ({
						...reaction,
						count: reactions.filter((r) => r.value === reaction.value).length,
					}));
					// required : 😍(4) ❤️(2) 🔥(9)
					const dedupedReactions = reactionsWithCounts.reduce(
						(acc, reaction) => {
							const existingReaction = acc.find(
								(r) => r.value === reaction.value
							);
							if (existingReaction) {
								existingReaction.memberIds = Array.from(
									new Set([...existingReaction.memberIds, reaction.memberId])
								);
							} else {
								acc.push({ ...reaction, memberIds: [reaction.memberId] });
							}
							return acc;
						},
						// --TYPES FOR REACTIONS-- //
						[] as (Doc<"reactions"> & {
							count: number;
							memberIds: Id<"members">[];
						})[]
					);
					/* this : 😅(1) 😅(1)
					  to  : 😅(2)

 					 Removing memberId property from reactions */
					const reactionsWithoutMemberIds = dedupedReactions.map(
						({ memberIds, ...rest }) => rest
					);

					return {
						...message,
						image,
						member,
						user,
						reactions: reactionsWithoutMemberIds,
						threadCount: thread.count,
						threadImage: thread.image,
						threadTimestamp: thread.timestamp,
					};
				})
			)
		).filter(
			(message): message is NonNullable<typeof message> => message !== null
		);

		return {
			...results,
			page,
		};
	},
});

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
		});

		return messageId;
	},
});
