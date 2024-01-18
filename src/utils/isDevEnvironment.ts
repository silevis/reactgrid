export default function isDevEnvironment() {
  return process.env.NODE_ENV === "development";
}