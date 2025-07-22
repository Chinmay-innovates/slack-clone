# Slack Clone - Comprehensive API Documentation

## Table of Contents

- [Overview](#overview)
- [Backend APIs (Convex)](#backend-apis-convex)
  - [Authentication](#authentication)
  - [Workspaces](#workspaces)
  - [Channels](#channels)
  - [Messages](#messages)
  - [Members](#members)
  - [Conversations](#conversations)
  - [Reactions](#reactions)
  - [Upload](#upload)
  - [Users](#users)
- [Frontend Components](#frontend-components)
  - [UI Components](#ui-components)
  - [Feature Components](#feature-components)
  - [Layout Components](#layout-components)
- [Custom Hooks](#custom-hooks)
  - [Navigation Hooks](#navigation-hooks)
  - [API Hooks](#api-hooks)
  - [State Management Hooks](#state-management-hooks)
- [Utilities](#utilities)
- [Data Schema](#data-schema)

## Overview

This is a Slack-like collaboration application built with:
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Convex (serverless backend)
- **Authentication**: Convex Auth
- **State Management**: Jotai
- **Rich Text Editor**: Quill.js

## Backend APIs (Convex)

### Authentication

#### `auth.ts`
Handles user authentication using Convex Auth.

```typescript
// Available endpoints
auth.signIn(provider: string)
auth.signOut()
auth.store() // Get current auth state
```

**Usage Example:**
```typescript
import { useAuthActions } from "@convex-dev/auth/react";

const { signIn, signOut } = useAuthActions();

// Sign in with provider
await signIn("google");

// Sign out
await signOut();
```

#### `users.ts`

##### `current` (Query)
Gets the current authenticated user.

```typescript
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  }
});
```

**Usage:**
```typescript
const user = useQuery(api.users.current);
```

### Workspaces

#### `join` (Mutation)
Allows a user to join a workspace using a join code.

```typescript
export const join = mutation({
  args: {
    joinCode: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    // Validates join code and adds user as member
    return workspaceId;
  }
});
```

**Usage:**
```typescript
const join = useMutation(api.workspaces.join);

await join({
  joinCode: "abc123",
  workspaceId: "workspace_id"
});
```

#### `newJoinCode` (Mutation)
Generates a new join code for a workspace.

```typescript
export const newJoinCode = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    // Generates new 6-character join code
    return workspace;
  }
});
```

#### `create` (Mutation)
Creates a new workspace.

```typescript
export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Creates workspace and adds creator as admin
    return workspaceId;
  }
});
```

#### `get` (Query)
Gets all workspaces for the current user.

```typescript
export const get = query({
  args: {},
  handler: async (ctx) => {
    // Returns workspaces where user is a member
    return workspaces;
  }
});
```

#### `getById` (Query)
Gets a specific workspace by ID.

```typescript
export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    return workspace;
  }
});
```

#### `getInfoById` (Query)
Gets workspace info (name and join code) for public access.

```typescript
export const getInfoById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    return { name, isMember };
  }
});
```

#### `update` (Mutation)
Updates workspace details.

```typescript
export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Updates workspace name (admin only)
    return workspaceId;
  }
});
```

#### `remove` (Mutation)
Deletes a workspace and all associated data.

```typescript
export const remove = mutation({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    // Cascades deletion to channels, messages, etc.
    return workspaceId;
  }
});
```

### Channels

#### `create` (Mutation)
Creates a new channel in a workspace.

```typescript
export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    // Creates channel (admin only)
    return channelId;
  }
});
```

#### `get` (Query)
Gets all channels in a workspace.

```typescript
export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    // Returns channels for workspace members
    return channels;
  }
});
```

#### `getById` (Query)
Gets a specific channel by ID.

```typescript
export const getById = query({
  args: { id: v.id("channels") },
  handler: async (ctx, args) => {
    return channel;
  }
});
```

#### `update` (Mutation)
Updates channel details.

```typescript
export const update = mutation({
  args: {
    id: v.id("channels"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Updates channel name (admin only)
    return channelId;
  }
});
```

#### `remove` (Mutation)
Deletes a channel and all its messages.

```typescript
export const remove = mutation({
  args: { id: v.id("channels") },
  handler: async (ctx, args) => {
    // Deletes channel and messages (admin only)
    return channelId;
  }
});
```

### Messages

#### `create` (Mutation)
Creates a new message.

```typescript
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
    return messageId;
  }
});
```

**Usage:**
```typescript
const createMessage = useMutation(api.messages.create);

await createMessage({
  body: "Hello world!",
  workspaceId: "workspace_id",
  channelId: "channel_id"
});
```

#### `get` (Query)
Gets paginated messages for a channel or conversation.

```typescript
export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return {
      page: messages,
      isFinished: boolean
    };
  }
});
```

#### `getById` (Query)
Gets a specific message by ID.

```typescript
export const getById = query({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    return message; // with member and reactions data
  }
});
```

#### `update` (Mutation)
Updates a message.

```typescript
export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Updates message (author only)
    return messageId;
  }
});
```

#### `remove` (Mutation)
Deletes a message.

```typescript
export const remove = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    // Deletes message (author only)
    return messageId;
  }
});
```

### Members

#### `get` (Query)
Gets all members of a workspace.

```typescript
export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return members; // with user data
  }
});
```

#### `getById` (Query)
Gets a specific member by ID.

```typescript
export const getById = query({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    return member; // with user data
  }
});
```

#### `getCurrent` (Query)
Gets current user's membership in a workspace.

```typescript
export const getCurrent = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return member;
  }
});
```

#### `update` (Mutation)
Updates member role.

```typescript
export const update = mutation({
  args: {
    id: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    // Updates member role (admin only)
    return memberId;
  }
});
```

#### `remove` (Mutation)
Removes a member from workspace.

```typescript
export const remove = mutation({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    // Removes member (admin only, can't remove self)
    return memberId;
  }
});
```

### Conversations

#### `getOrCreate` (Mutation)
Gets or creates a direct conversation between two members.

```typescript
export const getOrCreate = mutation({
  args: {
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return conversationId;
  }
});
```

### Reactions

#### `toggle` (Mutation)
Toggles a reaction on a message.

```typescript
export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(), // emoji value
  },
  handler: async (ctx, args) => {
    // Adds or removes reaction
    return reactionId;
  }
});
```

### Upload

#### `generateUploadUrl` (Mutation)
Generates a URL for file uploads.

```typescript
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
```

**Usage:**
```typescript
const generateUploadUrl = useMutation(api.upload.generateUploadUrl);

const uploadUrl = await generateUploadUrl();
// Upload file to the URL, then get storage ID
```

## Frontend Components

### UI Components

Located in `src/components/ui/`. These are reusable design system components built with Radix UI and Tailwind CSS.

#### `Button`
```typescript
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

// Usage
<Button variant="outline" size="sm">
  Click me
</Button>
```

#### `Avatar`
```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
}

// Usage
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

#### `Dialog`
Modal dialog component.

```typescript
// Usage
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### `DropdownMenu`
Dropdown menu component.

```typescript
// Usage
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Feature Components

#### `Editor`
Rich text editor component using Quill.js.

```typescript
interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: "create" | "update";
}

// Usage
<Editor
  onSubmit={({ body, image }) => {
    // Handle submission
  }}
  placeholder="Type a message..."
  variant="create"
/>
```

#### `Message`
Displays a single message with reactions, threading, and actions.

```typescript
interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<{
    count: number;
    memberIds: Id<"members">[];
    value: string;
  }>;
  body: string;
  image?: string | null;
  createdAt: number;
  updatedAt?: number;
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp?: number;
}

// Usage
<Message
  id={message._id}
  memberId={message.memberId}
  authorName={member.user.name}
  authorImage={member.user.image}
  isAuthor={message.memberId === currentMember?._id}
  body={message.body}
  image={message.image}
  createdAt={message._creationTime}
  reactions={reactions}
  // ... other props
/>
```

#### `MessageList`
Displays a paginated list of messages.

```typescript
interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

// Usage
<MessageList
  data={messages}
  loadMore={loadMore}
  isLoadingMore={isLoadingMore}
  canLoadMore={canLoadMore}
  variant="channel"
  channelName="general"
  channelCreationTime={creationTime}
/>
```

#### `Reactions`
Displays and manages message reactions.

```typescript
interface ReactionsProps {
  data: Array<{
    count: number;
    memberIds: Id<"members">[];
    value: string;
  }>;
  onChange: (value: string) => void;
}

// Usage
<Reactions
  data={reactions}
  onChange={(emoji) => toggleReaction({ value: emoji })}
/>
```

#### `EmojiPopover`
Emoji picker popover component.

```typescript
interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: { native: string }) => void;
}

// Usage
<EmojiPopover
  hint="Add reaction"
  onEmojiSelect={(emoji) => toggleReaction({ value: emoji.native })}
>
  <Button variant="ghost" size="sm">
    😀
  </Button>
</EmojiPopover>
```

### Layout Components

#### `Sidebar`
Main navigation sidebar.

```typescript
// Usage in layout
<div className="h-full">
  <Toolbar />
  <div className="flex h-[calc(100vh-40px)]">
    <Sidebar />
    <main className="flex-1">
      {children}
    </main>
  </div>
</div>
```

#### `WorkspaceSwitcher`
Workspace selection dropdown.

```typescript
// Usage
<WorkspaceSwitcher />
```

#### `WorkspaceHeader`
Workspace header with title and actions.

```typescript
interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces"> & { isMember: boolean };
  isAdmin: boolean;
}

// Usage
<WorkspaceHeader workspace={workspace} isAdmin={isAdmin} />
```

## Custom Hooks

### Navigation Hooks

#### `useWorkspaceId`
Gets current workspace ID from URL parameters.

```typescript
export const useWorkspaceId = () => {
  const params = useParams();
  return params.Id as Id<"workspaces">;
};

// Usage
const workspaceId = useWorkspaceId();
```

#### `useChannelId`
Gets current channel ID from URL parameters.

```typescript
export const useChannelId = () => {
  const params = useParams();
  return params.channelId as Id<"channels">;
};

// Usage
const channelId = useChannelId();
```

#### `useMemberId`
Gets current member ID from URL parameters.

```typescript
export const useMemberId = () => {
  const params = useParams();
  return params.memberId as Id<"members">;
};

// Usage
const memberId = useMemberId();
```

### API Hooks

All API hooks follow the pattern `use[Operation][Entity]` and return mutation/query functions with loading states.

#### Workspace Hooks

```typescript
// Get all workspaces
const { data: workspaces, isLoading } = useGetWorkspaces();

// Get specific workspace
const { data: workspace, isLoading } = useGetWorkspace({ id: workspaceId });

// Create workspace
const { mutate: createWorkspace, isPending } = useCreateWorkspace();

// Update workspace
const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();

// Remove workspace
const { mutate: removeWorkspace, isPending } = useRemoveWorkspace();

// Join workspace
const { mutate: joinWorkspace, isPending } = useJoin();

// Generate new join code
const { mutate: newJoinCode, isPending } = useNewJoinCode();
```

#### Channel Hooks

```typescript
// Get channels
const { data: channels, isLoading } = useGetChannels({ workspaceId });

// Get specific channel
const { data: channel, isLoading } = useGetChannel({ id: channelId });

// Create channel
const { mutate: createChannel, isPending } = useCreateChannel();

// Update channel
const { mutate: updateChannel, isPending } = useUpdateChannel();

// Remove channel
const { mutate: removeChannel, isPending } = useRemoveChannel();
```

#### Message Hooks

```typescript
// Get messages
const {
  results: messages,
  status,
  loadMore,
} = useGetMessages({
  channelId,
  conversationId,
  parentMessageId,
});

// Get specific message
const { data: message, isLoading } = useGetMessage({ id: messageId });

// Create message
const { mutate: createMessage, isPending } = useCreateMessage();

// Update message
const { mutate: updateMessage, isPending } = useUpdateMessage();

// Remove message
const { mutate: removeMessage, isPending } = useRemoveMessage();
```

#### Member Hooks

```typescript
// Get members
const { data: members, isLoading } = useGetMembers({ workspaceId });

// Get specific member
const { data: member, isLoading } = useGetMember({ id: memberId });

// Get current member
const { data: currentMember, isLoading } = useCurrentMember({ workspaceId });

// Update member
const { mutate: updateMember, isPending } = useUpdateMember();

// Remove member
const { mutate: removeMember, isPending } = useRemoveMember();
```

#### Other Hooks

```typescript
// Get current user
const { data: user, isLoading } = useCurrentUser();

// Toggle reaction
const { mutate: toggleReaction, isPending } = useToggleReaction();

// Generate upload URL
const { mutate: generateUploadUrl, isPending } = useGenerateUploadUrl();

// Get or create conversation
const { mutate: getOrCreateConversation, isPending } = useGetOrCreateConversation();
```

### State Management Hooks

#### `usePanel`
Manages right panel state (thread view, profile view).

```typescript
export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();

  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };

  const onClose = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return {
    parentMessageId,
    profileMemberId,
    onOpenProfile,
    onOpenMessage,
    onClose,
  };
};

// Usage
const { parentMessageId, onOpenMessage, onClose } = usePanel();
```

#### `useConfirmation`
Provides confirmation dialog functionality.

```typescript
export const useConfirmation = (
  title: string,
  message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
  // Returns [ConfirmDialog, confirm function]
};

// Usage
const [ConfirmDialog, confirm] = useConfirmation(
  "Delete message",
  "Are you sure you want to delete this message?"
);

const handleDelete = async () => {
  const ok = await confirm();
  if (ok) {
    // Proceed with deletion
  }
};

return (
  <>
    <ConfirmDialog />
    <Button onClick={handleDelete}>Delete</Button>
  </>
);
```

#### Modal State Hooks

```typescript
// Create workspace modal
const [open, setOpen] = useCreateWorkspaceModal();

// Create channel modal
const [open, setOpen] = useCreateChannelModal();

// Usage
<CreateWorkspaceModal />
<Button onClick={() => setOpen(true)}>
  Create Workspace
</Button>
```

## Utilities

### `utils.ts`

#### `cn`
Utility for combining CSS classes with clsx and tailwind-merge.

```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn("text-sm", isActive && "font-bold", className)} />
```

#### `formatDateLabel`
Formats date strings for display.

```typescript
export const formatDateLabel = (dateKey: string) => {
  const date = new Date(dateKey);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

// Usage
const dateLabel = formatDateLabel(message.creationTime);
```

#### Constants

```typescript
export const TIME_THRESHOLD = 5; // Minutes for message grouping
export const BATCH_SIZE = 20; // Messages per page
```

## Data Schema

### Database Tables

#### `workspaces`
```typescript
{
  name: string;
  userId: Id<"users">;
  joinCode: string;
}
```

#### `members`
```typescript
{
  userId: Id<"users">;
  workspaceId: Id<"workspaces">;
  role: "admin" | "member";
}
```

#### `channels`
```typescript
{
  name: string;
  workspaceId: Id<"workspaces">;
}
```

#### `conversations`
```typescript
{
  workspaceId: Id<"workspaces">;
  memberOneId: Id<"members">;
  memberTwoId: Id<"members">;
}
```

#### `messages`
```typescript
{
  body: string;
  image?: Id<"_storage">;
  memberId: Id<"members">;
  workspaceId: Id<"workspaces">;
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
  updatedAt?: number;
}
```

#### `reactions`
```typescript
{
  workspaceId: Id<"workspaces">;
  messageId: Id<"messages">;
  memberId: Id<"members">;
  value: string; // emoji
}
```

### Indexes

- `members`: by_user_id, by_workspace_id, by_workspace_id_user_id
- `channels`: by_workspace_id
- `conversations`: by_workspace_id
- `messages`: by_workspace_id, by_member_id, by_channel_id, by_parent_message_id, by_conversation_id
- `reactions`: by_workspace_id, by_message_id, by_member_id

## Error Handling

All API functions throw errors with descriptive messages:

```typescript
// Common error types
- "Unauthorized" - User not authenticated
- "Forbidden" - User lacks permission
- "Not found" - Resource doesn't exist
- "Invalid join code" - Workspace join code incorrect
- "Already a member" - User already in workspace
```

## Best Practices

1. **Authentication**: Always check user authentication before API calls
2. **Authorization**: Verify user permissions for workspace/channel operations
3. **Error Handling**: Use try-catch blocks and display user-friendly errors
4. **Loading States**: Show loading indicators during API operations
5. **Optimistic Updates**: Use optimistic updates for better UX
6. **Pagination**: Use pagination for message lists and large datasets
7. **File Uploads**: Generate upload URLs and handle file storage properly

## Example Usage Patterns

### Creating a Workspace
```typescript
const CreateWorkspace = () => {
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();
  const router = useRouter();

  const handleSubmit = async (values: { name: string }) => {
    try {
      const workspaceId = await createWorkspace(values);
      router.push(`/workspace/${workspaceId}`);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Workspace name" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Workspace"}
      </button>
    </form>
  );
};
```

### Sending a Message
```typescript
const SendMessage = ({ channelId }: { channelId: Id<"channels"> }) => {
  const { mutate: createMessage } = useCreateMessage();
  const workspaceId = useWorkspaceId();

  const handleSubmit = ({ body, image }: EditorValue) => {
    createMessage({
      body,
      image,
      workspaceId,
      channelId,
    });
  };

  return (
    <Editor
      onSubmit={handleSubmit}
      placeholder="Type a message..."
    />
  );
};
```

### Real-time Updates

The application uses Convex's real-time capabilities. Components automatically re-render when data changes:

```typescript
const ChannelMessages = () => {
  const channelId = useChannelId();
  
  // This will automatically update when new messages arrive
  const { results: messages } = useGetMessages({ channelId });

  return (
    <MessageList
      data={messages}
      variant="channel"
    />
  );
};
```

This documentation covers all public APIs, components, and usage patterns in the Slack clone application. Each section includes practical examples and best practices for implementation.