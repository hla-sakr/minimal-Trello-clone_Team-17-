
/**
 * @param {*} v email value
 * @returns returns true or false by checking email rules:
 * 1. an email should be text
 * 2. 254 is the maximum email length allowed
 * 3.Regular Expression:
 *  ^: start of the string
 *  [^\s@]+: one or more characters that are not whitespace or @
 *  @: the @ symbol
 *  [^\s@]+: one or more characters that are not whitespace or @
 *  \.: a dot (.)
 *  [^\s@]+: one or more characters that are not whitespace or @
 *  $: end of the string
 *  .test() checks whether a string matches the Regex pattern. It returns true if the pattern matches and false otherwise.
 *  .trim() removes spaces from the beginning and end of the text.
 */
export function isEmail(v) {
    return typeof v === "string"
        && v.length <= 254
        && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

/***
 * @param {*} p password value
 * @returns returns null if the password is valid, otherwise returns an error message 
 * by checkinh\g password rules:
 * 1. password should be a string
 * 2. password should be at least 8 characters long
 * 3. password should not exceed 72 bytes (bcrypt limit)
 * 4. password should contain at least one letter and one number
 */
export function passwordError(p) {
    if (typeof p !== "string") return "Password is required";
    if (p.length < 8) return "Password must be at least 8 characters";
    if (Buffer.byteLength(p) > 72) return "Password is too long";
    if (!/[A-Za-z]/.test(p) || !/\d/.test(p))
        return "Password must include a letter and a number";
    return null;
}