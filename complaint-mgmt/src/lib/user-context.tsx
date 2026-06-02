"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Role } from "@/generated/prisma/client";
import { BACKEND_URL } from "@/lib/api";

interface UserContextType {
  currentUserId: string;
  currentRole: Role;
  setCurrentUserId: (id: string) => void;
  setCurrentRole: (role: Role) => void;
  users: { id: string; name: string; role: Role; avatar: string | null }[];
  setUsers: (
    users: { id: string; name: string; role: Role; avatar: string | null }[]
  ) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentRole, setCurrentRole] = useState<Role>("ADMIN");
  const [users, setUsers] = useState<
    { id: string; name: string; role: Role; avatar: string | null }[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    const fetchUsers = () => {
      fetch(`${BACKEND_URL}/api/users`)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data) => {
          if (cancelled) return;
          setUsers(data);
          // Default to the first admin
          const admin = data.find(
            (u: { role: Role }) => u.role === "ADMIN"
          );
          if (admin) {
            setCurrentUserId(admin.id);
            setCurrentRole(admin.role);
          } else if (data.length > 0) {
            setCurrentUserId(data[0].id);
            setCurrentRole(data[0].role);
          }
        })
        .catch((err) => {
          if (cancelled) return;
          console.error("Failed to fetch users:", err);
          // Retry after 3 seconds
          setTimeout(fetchUsers, 3000);
        });
    };
    fetchUsers();
    return () => { cancelled = true; };
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUserId,
        currentRole,
        setCurrentUserId,
        setCurrentRole,
        users,
        setUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
