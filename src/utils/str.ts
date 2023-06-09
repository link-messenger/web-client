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
  username.charAt(0).toUpperCase()

export const shortenString = (str: string, limit=20) => {
  if (str.length > limit) {
    return str.substring(0, limit) + '...';
  }
  return str;
}