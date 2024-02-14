export const isAdmin = (role?: string | null) => {
  return role === process.env.NEXT_PUBLIC_ADMIN_ROLE;
};
