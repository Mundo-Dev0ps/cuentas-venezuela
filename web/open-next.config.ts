import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config: use the Cloudflare adapter with default cache + queue.
// Customise here when we add R2/KV bindings later (e.g. ISR cache → KV).
export default defineCloudflareConfig({
  // No incremental cache, no on-demand revalidation queue for now.
  // Pages are either static (build-time) or `dynamic = 'force-dynamic'`.
});
