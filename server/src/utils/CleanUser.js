/*Returns only the safe fields of a user (never the password hash)*/

/**
 * Defines a function that receives a "user" object
 * Our database "user" contains sensitive information,
 * especially the password hash
 * We don't want to send that information to the frontend
 */

export default function cleanUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
}