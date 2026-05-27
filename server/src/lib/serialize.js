/** Remove sensitive fields before sending a user to the client. */
export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, avatarPublicId, ...rest } = user;
  return rest;
}
