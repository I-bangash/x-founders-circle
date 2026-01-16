import { ConvexError, v } from "convex/values";

import { Doc, Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";
import {
  getIdentityOrThrow,
  handleConvexError,
} from "../helper/convexHelperFunctions";

// Types for error handling
type UserResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

type UserData = Doc<"users">;

// Get user by ID
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<UserResponse<UserData | null>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), userId))
        .first();

      if (!user) {
        return {
          error: {
            code: "NOT_FOUND",
            message: "User not found",
          },
        };
      }

      return { data: user };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

// Create user
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    username: v.optional(v.string()),
    gh_username: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<UserResponse<UserData>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
        .first();

      if (existingUser) {
        throw new ConvexError({
          code: "USER_EXISTS",
          message: "User already exists",
        });
      }

      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        firstname: args.firstname,
        lastname: args.lastname,
        username: args.username,
        image: args.image,
        emailVerified: args.emailVerified,
        organizationId: args.organizationId,
      });

      const createdUser = await ctx.db.get(userId);

      if (!createdUser) {
        throw new ConvexError({
          code: "CREATION_FAILED",
          message: "Failed to create user",
        });
      }

      return { data: createdUser };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

export const createUserInternal = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    username: v.optional(v.string()),
    gh_username: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<UserResponse<UserData>> => {
    try {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
        .first();

      if (existingUser) {
        throw new ConvexError({
          code: "USER_EXISTS",
          message: "User already exists",
        });
      }

      // Create base insert object with required fields
      const insertData: Omit<Doc<"users">, "_id" | "_creationTime"> = {
        clerkId: args.clerkId,
        email: args.email,
      };

      // Only add optional fields if they are defined and not null
      if (args.name) insertData.name = args.name;
      if (args.firstname) insertData.firstname = args.firstname;
      if (args.lastname) insertData.lastname = args.lastname;
      if (args.username) insertData.username = args.username;
      if (args.image) insertData.image = args.image;
      if (args.emailVerified) insertData.emailVerified = args.emailVerified;
      if (args.organizationId) insertData.organizationId = args.organizationId;

      const userId = await ctx.db.insert("users", insertData);

      const createdUser = await ctx.db.get(userId);

      if (!createdUser) {
        throw new ConvexError({
          code: "CREATION_FAILED",
          message: "Failed to create user",
        });
      }

      return { data: createdUser };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

// Update user
export const updateUser = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    gh_username: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
    image: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    hasOnboarded: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<UserResponse<UserData>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), args.userId))
        .first();

      if (!existingUser) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Only update fields that are provided
      const updateData = {
        ...(args.name !== undefined && { name: args.name }),
        ...(args.firstName !== undefined && { firstname: args.firstName }),
        ...(args.lastName !== undefined && { lastname: args.lastName }),
        ...(args.username !== undefined && { username: args.username }),
        ...(args.gh_username !== undefined && {
          gh_username: args.gh_username,
        }),
        ...(args.email !== undefined && { email: args.email }),
        ...(args.emailVerified !== undefined && {
          emailVerified: args.emailVerified,
        }),
        ...(args.image !== undefined && { image: args.image }),
        ...(args.organizationId !== undefined && {
          organizationId: args.organizationId,
        }),
        ...(args.hasOnboarded !== undefined && {
          hasOnboarded: args.hasOnboarded,
        }),
      };

      await ctx.db.patch(existingUser._id, updateData);

      const updatedUser = await ctx.db.get(existingUser._id);

      if (!updatedUser) {
        throw new ConvexError({
          code: "UPDATE_FAILED",
          message: "Failed to update user",
        });
      }

      return { data: updatedUser };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

export const updateUserInternal = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    username: v.optional(v.string()),
    gh_username: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
    image: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    hasOnboarded: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<UserResponse<UserData>> => {
    try {
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), args.userId))
        .first();

      if (!existingUser) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Only update fields that are provided
      const updateData = {
        ...(args.name !== undefined && { name: args.name }),
        ...(args.firstname !== undefined && { firstname: args.firstname }),
        ...(args.lastname !== undefined && { lastname: args.lastname }),
        ...(args.username !== undefined && { username: args.username }),
        ...(args.gh_username !== undefined && {
          gh_username: args.gh_username,
        }),
        ...(args.email !== undefined && { email: args.email }),
        ...(args.emailVerified !== undefined && {
          emailVerified: args.emailVerified,
        }),
        ...(args.image !== undefined && { image: args.image }),
        ...(args.organizationId !== undefined && {
          organizationId: args.organizationId,
        }),
        ...(args.hasOnboarded !== undefined && {
          hasOnboarded: args.hasOnboarded,
        }),
      };

      await ctx.db.patch(existingUser._id, updateData);

      const updatedUser = await ctx.db.get(existingUser._id);

      if (!updatedUser) {
        throw new ConvexError({
          code: "UPDATE_FAILED",
          message: "Failed to update user",
        });
      }

      return { data: updatedUser };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

// Delete user
export const deleteUser = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<UserResponse<boolean>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), userId))
        .first();

      if (!existingUser) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      await ctx.db.delete(existingUser._id);

      return { data: true };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

export const deleteUserInternal = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<UserResponse<boolean>> => {
    try {
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), userId))
        .first();

      if (!existingUser) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      await ctx.db.delete(existingUser._id);

      return { data: true };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

// Get or create user
// TODO PROD : REMOVE THIS AND USE GETUSER, NOT CREATE USER
export const getOrCreateUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<
    UserResponse<{
      name: string | null;
      email: string;
    }>
  > => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      const { userId, orgId } = getIdentityOrThrow(identity);

      // Check if user exists
      let user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first();

      if (!user) {
        // Create new user
        const newUserId = await ctx.db.insert("users", {
          clerkId: userId,
          email: args.email,
          name: args.name,
          organizationId: orgId,
        });

        const createdUser = await ctx.db.get(newUserId);

        if (!createdUser) {
          throw new ConvexError({
            code: "CREATION_FAILED",
            message: "Failed to create user",
          });
        }

        user = createdUser;
      }

      return {
        data: {
          name: user.name ?? null,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

// Update user onboarding status
export const updateOnboardingStatus = mutation({
  args: {
    userId: v.string(),
    hasOnboarded: v.boolean(),
  },
  handler: async (ctx, args): Promise<UserResponse<UserData>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), args.userId))
        .first();

      if (!existingUser) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      await ctx.db.patch(existingUser._id, {
        hasOnboarded: args.hasOnboarded,
      });

      const updatedUser = await ctx.db.get(existingUser._id);

      if (!updatedUser) {
        throw new ConvexError({
          code: "UPDATE_FAILED",
          message: "Failed to update user onboarding status",
        });
      }

      return { data: updatedUser };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});
