export const turnEmailIntoUsrname = (
  email: string,
) => {
  const usr = email.split('@')[0];
  return (
    usr.charAt(0).toUpperCase() +
    usr.charAt(usr.length - 1).toUpperCase()
  );
};

export const usernameShorter = (
  username: string,
) =>
  username.charAt(0).toUpperCase() +
  username
    .charAt(username.length - 1)
    .toUpperCase();
