// CJS stub for optional framework peer deps (next, waku, react-router, @tanstack/react-router).
// Using CJS avoids esbuild's strict ESM named-export checking — property accesses on a CJS
// module.exports object are resolved at runtime, so esbuild won't error on missing named exports.
// None of these are called at runtime in our app; the stubs just prevent startup crashes.
module.exports = {};
