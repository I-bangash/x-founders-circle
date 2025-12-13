# Convex Functions

## Quick Start

All Convex functions use a simple response pattern: return `{ data }` on success, `{ error }` on failure.

### Writing a Query

```ts
import { v } from "convex/values";

import { query } from "./_generated/server";
import {
  ConvexResponse,
  ERROR_CODES,
  fail,
  success,
  throwErr,
} from "./convexTypes";

interface User {
  _id: string;
  name: string;
  email: string;
}

export const getUsers = query({
  args: {},
  async handler(ctx): Promise<ConvexResponse<User[]>> {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throwErr(ERROR_CODES.UNAUTHORIZED, "Please sign in");
      }

      const users = await ctx.db.query("users").collect();
      return success(users);
    } catch (err) {
      return fail(err, "Failed to fetch users");
    }
  },
});
```

### Writing a Mutation

```ts
import { v } from "convex/values";

import { mutation } from "./_generated/server";
import {
  ConvexResponse,
  ERROR_CODES,
  fail,
  success,
  throwErr,
} from "./convexTypes";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  async handler(ctx, args): Promise<ConvexResponse<{ id: string }>> {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throwErr(ERROR_CODES.UNAUTHORIZED, "Please sign in");
      }

      if (args.name.length < 2) {
        throwErr(
          ERROR_CODES.VALIDATION_ERROR,
          "Name must be at least 2 characters"
        );
      }

      const id = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
      });

      return success({ id });
    } catch (err) {
      return fail(err, "Failed to create user");
    }
  },
});
```

---

## Using in React

### With useQuery

```tsx
"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { isError } from "@/convex/convexTypes";

export function UsersList() {
  const response = useQuery(api.users.getUsers);

  if (response === undefined) {
    return <div>Loading...</div>;
  }

  if (isError(response)) {
    return <div className="text-red-500">{response.error.message}</div>;
  }

  // TypeScript knows response.data exists here
  return (
    <ul>
      {response.data.map((user) => (
        <li key={user._id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### With useMutation

```tsx
"use client";

import { useState } from "react";

import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { isError } from "@/convex/convexTypes";

export function CreateUserForm() {
  const [name, setName] = useState("");
  const createUser = useMutation(api.users.createUser);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await createUser({ name, email: "test@example.com" });

    if (isError(response)) {
      toast.error(response.error.message);
      return;
    }

    // Success - response.data is available
    toast.success("User created!");
    setName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## API Reference

### Functions

| Function                  | Usage                                                   |
| ------------------------- | ------------------------------------------------------- |
| `success(data)`           | Return success: `return success(users)`                 |
| `throwErr(code, message)` | Throw error: `throwErr("NOT_FOUND", "User not found")`  |
| `fail(err, message)`      | Catch block: `return fail(err, "Something went wrong")` |
| `isError(response)`       | Check for error on frontend, then early return          |

### Error Codes

```ts
ERROR_CODES.UNAUTHORIZED; // User not logged in
ERROR_CODES.FORBIDDEN; // User lacks permission
ERROR_CODES.NOT_FOUND; // Resource not found
ERROR_CODES.VALIDATION_ERROR; // Invalid input
ERROR_CODES.INTERNAL_ERROR; // Server error
```

---

## CLI Commands

```bash
npx convex dev      # Start development
npx convex deploy   # Deploy to production
```
