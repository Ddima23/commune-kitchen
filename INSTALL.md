# Install & publish

## Publish the plugin (developer)

### Option A — npm
1. `cd plugin && npm publish`
2. In `index/index.json`, keep `source: { "type": "npm" }` and bump `publishTimestamp` to the publish time.

### Option B — git
1. Push `plugin/` to a git repo.
2. In `index/index.json`, change the version `source` to:
   ```json
   { "type": "git", "url": "https://github.com/<you>/commune-kitchen", "commit": "<40-hex sha>", "path": "plugin" }
   ```

### Host the index
Put `index/index.json` on any static host (GitHub Pages, Vercel, Netlify) and share its URL.

## Install for a customer (no coding)
1. Open DSH → Plugins → Discover.
2. Add your index URL.
3. Find "Commune Kitchen" → Install.

## Local test (your own machine)
1. Copy the plugin into your profile's `node_modules` (or `pnpm add file:../commune-kitchen/plugin`).
2. Add to your profile `cordis.patch.yml`:
   ```yaml
   - insert:
       - id: commune-kitchen
         name: 'commune-kitchen'
   ```
3. Restart / reload the profile; the 3 tools and 5 skills should appear in the catalog.
