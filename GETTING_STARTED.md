# Getting Started with Slack Clone

This guide will walk you through setting up and running the Slack clone application locally. Make sure you've reviewed the [API Documentation](./API_DOCUMENTATION.md) for detailed API and component information.

## 🚀 Quick Start

### 1. **Prerequisites**

Ensure you have the following installed:
- **Node.js** (version 18+ recommended)
- **npm** or **bun** (this project uses Bun)
- **Git**

### 2. **Clone and Install**

```bash
# Clone the repository
git clone https://github.com/Chinmay-innovates/slack-clone.git
cd slack-clone

# Install dependencies (using Bun as configured)
bun install

# Alternative with npm
npm install
```

### 3. **Set up Convex Backend**

#### Install Convex CLI
```bash
npm install -g convex
```

#### Initialize Convex
```bash
# Login to Convex (creates account if needed)
npx convex login

# Initialize your Convex project
npx convex dev
```

This will:
- Create a new Convex project
- Generate deployment URL
- Set up real-time database
- Deploy your schema and functions

### 4. **Configure Environment Variables**

Create a `.env.local` file in the root directory:

```bash
# Convex Configuration (generated from `npx convex dev`)
CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Authentication (if using external providers)
# Add provider-specific environment variables here
# Example for Google Auth:
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 5. **Start Development**

```bash
# Start the development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Development Workflow

### Project Structure Overview

```
├── src/
│   ├── app/                 # Next.js 14 App Router pages
│   ├── components/          # Reusable UI components
│   ├── features/           # Feature-specific components and logic
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── convex/                 # Backend API functions and schema
├── public/                 # Static assets
└── API_DOCUMENTATION.md    # Complete API reference
```

### Key Development Commands

```bash
# Start development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Deploy Convex functions
npx convex deploy
```

## 📚 Using the API Documentation

The `API_DOCUMENTATION.md` file contains comprehensive information about:

1. **Backend APIs** - All Convex mutations and queries
2. **Frontend Components** - React components with props and usage
3. **Custom Hooks** - React hooks for API calls and state management
4. **Data Schema** - Database structure and relationships
5. **Usage Examples** - Real-world implementation patterns

### Example: Creating Your First Workspace

```typescript
import { useCreateWorkspace } from "@/features/workspaces/api/use-create-workspace";

const CreateWorkspace = () => {
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const handleSubmit = async (name: string) => {
    try {
      const workspaceId = await createWorkspace({ name });
      console.log("Workspace created:", workspaceId);
    } catch (error) {
      console.error("Failed to create workspace:", error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      handleSubmit(formData.get("name"));
    }}>
      <input name="name" placeholder="Workspace name" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Workspace"}
      </button>
    </form>
  );
};
```

## 🔐 Authentication Setup

The application uses Convex Auth. To set up authentication:

### 1. **Configure Auth Providers**

Edit `convex/auth.config.ts`:

```typescript
export default {
  providers: [
    // Add your preferred providers
    // Example: Google, GitHub, etc.
  ],
};
```

### 2. **Set Up Auth Components**

The application includes pre-built auth components:
- `SignInCard` - Sign in form
- `SignUpCard` - Sign up form  
- `AuthScreen` - Complete auth flow
- `UserButton` - User profile dropdown

### 3. **Protect Routes**

Use the authentication hooks:

```typescript
import { useCurrentUser } from "@/features/auth/api/use-current-user";

const ProtectedComponent = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return <div>Welcome, {user.name}!</div>;
};
```

## 🎨 UI Development

### Using the Design System

The application uses Shadcn/UI components. Common components include:

```typescript
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";

// Example usage
<Button variant="outline" size="sm">
  Click me
</Button>
```

### Custom Components

Feature-specific components are in `src/features/[feature]/components/`:

```typescript
import { Editor } from "@/components/editor";
import { MessageList } from "@/components/message-list";
import { EmojiPopover } from "@/components/emoji-popover";
```

## 🔄 Real-time Features

The application includes real-time functionality via Convex:

- **Live messaging** - Messages appear instantly
- **Typing indicators** - See when others are typing
- **Presence** - See who's online
- **Reactions** - Real-time emoji reactions

### Example: Real-time Messages

```typescript
import { useGetMessages } from "@/features/messages/api/use-get-messages";

const MessageFeed = ({ channelId }) => {
  // Automatically updates when new messages arrive
  const { results: messages, loadMore } = useGetMessages({ channelId });

  return (
    <MessageList
      data={messages}
      loadMore={loadMore}
      variant="channel"
    />
  );
};
```

## 🚀 Deployment

### Deploying to Vercel

1. **Deploy Convex backend:**
```bash
npx convex deploy --prod
```

2. **Deploy frontend to Vercel:**
```bash
# Connect your repo to Vercel
# Add environment variables in Vercel dashboard
# Deploy automatically on push to main
```

3. **Environment Variables for Production:**
```bash
CONVEX_DEPLOYMENT=your-prod-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Module not found" errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Convex connection issues**
   ```bash
   # Restart Convex dev server
   npx convex dev --reset
   ```

3. **TypeScript errors**
   ```bash
   # Regenerate Convex types
   npx convex codegen
   ```

### Getting Help

- Check the [API Documentation](./API_DOCUMENTATION.md) for detailed API reference
- Review component interfaces and usage examples
- Check Convex logs: `npx convex logs`
- Inspect network requests in browser dev tools

## 📖 Next Steps

Now that you have the application running:

1. **Explore the codebase** using the API documentation
2. **Create your first workspace** and channels
3. **Invite team members** using join codes
4. **Customize the UI** by modifying components
5. **Add new features** following the established patterns
6. **Deploy to production** when ready

### Recommended Learning Path

1. **Start with basic usage** - Create workspaces, channels, send messages
2. **Study the component structure** - Understand how UI components work together
3. **Learn the API patterns** - See how frontend hooks interact with Convex
4. **Customize features** - Modify existing functionality
5. **Add new features** - Build additional capabilities

### Development Best Practices

- **Follow TypeScript types** - Use the documented interfaces
- **Use the custom hooks** - Don't call Convex APIs directly
- **Handle loading states** - Show appropriate UI during async operations
- **Implement error handling** - Use try-catch and display user-friendly errors
- **Test real-time features** - Open multiple browser tabs to test live updates

Happy coding! 🎉