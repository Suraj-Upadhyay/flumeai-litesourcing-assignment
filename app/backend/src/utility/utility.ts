import crypto from "crypto";

function uniqueID() {
  return crypto.randomBytes(16).toString("base64");
}

export { uniqueID };
