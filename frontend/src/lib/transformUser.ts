import type { UserResource } from "@clerk/types";

export type AppUser = {
  id: string;
  username: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  imageUrl: string;
  createdAt: string | null;
};

export const transformUser = (user: UserResource): AppUser => {
  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? "",
    username: user.username ?? null,
    phoneNumber: user.phoneNumbers[0]?.phoneNumber ?? null,
    fullName: user.fullName ?? null,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    imageUrl: user.imageUrl ?? "",
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
  };
};
