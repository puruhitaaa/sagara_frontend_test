import { customAlphabet } from "nanoid"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { users } from "./db/schema/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789")

export const timestamps: { createdAt: true; updatedAt: true } = {
  createdAt: true,
  updatedAt: true,
}

export const getInitials = (name: string) => {
  const namesArray = name.split(" ")
  const initials = namesArray
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
  return initials.toUpperCase()
}

type UserColumns = keyof typeof users._.columns

const specificKeys: UserColumns[] = [
  "name",
  "email",
  "phoneNumber",
  "instanceId",
  "createdAt",
]

export const getUserColumns = (): UserColumns[] => {
  return specificKeys
}
