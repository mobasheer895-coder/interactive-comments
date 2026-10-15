
export interface CurrentUser {
    id: number;
    role: "ADMIN" | "USER";
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const response = await fetch("/api/me", {
        cache: "no-store",
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to fetch current user.");
    }

    const data = await response.json();
    return data.user;
}

export const logout = async () => {
  const response = await fetch("/api/logout", {
    method: "POST",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to log out.");
  }
};