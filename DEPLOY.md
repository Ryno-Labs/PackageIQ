# PackageIQ — Deploy Guide

Three parts: the **Sheet** (done), the **backend** (Apps Script), the **app** (GitHub Pages).

---

## 1. Backend — Apps Script

1. Open your **PackageIQ** Google Sheet → **Extensions → Apps Script**.
2. Delete whatever's there. Paste the entire contents of **`apps-script.gs`**. Save.
3. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**  ← plain "Anyone", NOT "Anyone with a Google account"
4. **Deploy** → authorize (pick your account → Advanced → Go to project → Allow).
5. Copy the **Web app URL** — it ends in `/exec`.

Test it: paste the `/exec` URL in a browser. You should see a wall of JSON. If you see a login page or an error, the access setting is wrong — redeploy as **Anyone**.

> After you ever change `apps-script.gs`, you must **Deploy → Manage deployments → edit (pencil) → New version → Deploy**. A plain Save does not update the live URL.

---

## 2. App — point it at the backend

1. Open **`index.html`**. Near the top of the script find:
   ```js
   const API_URL = "";
   ```
2. Paste your `/exec` URL between the quotes:
   ```js
   const API_URL = "https://script.google.com/macros/s/AKfy...../exec";
   ```
3. Save.

That's the only edit. The yellow "demo data" banner disappears once it's pulling live.

---

## 3. Host — GitHub Pages

Put **all** of these files in the repo root (same folder):

```
index.html   apps-script.gs(optional, for your records)
manifest.webmanifest   sw.js   .nojekyll
icon-192.png   icon-512.png   apple-touch-icon.png
```

**New repo:**
1. github.com → New repository → name it (e.g. `PackageIQ`) → Public → Create.
2. **Add file → Upload files** → drag everything in → Commit.
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, folder **/(root)** → Save.
4. Wait ~1 minute. Your URL: `https://ryno-labs.github.io/PackageIQ/`.

**Reusing RouteIQ.v2's pattern:** same as above — public repo, Pages from main/root, `.nojekyll` present, all paths relative.

Install on the phone: open the URL in Safari → Share → **Add to Home Screen**.

---

## Day to day

- Enter all work in the **Google Sheet** (Package_Log, Service_Items, etc.). The app is read-only.
- Open the app or hit **Refresh**. It also re-pulls every 60 seconds and caches the last good pull for offline.
- **"Today"** on the dashboard = your most recent logged day, so it's never blank. To force the literal calendar day instead, set `REF_TODAY` at the top of `apps-script.gs`.

## When you change the app code later

1. Edit `index.html`.
2. Bump the cache key in **`sw.js`**: `packageiq-v1` → `packageiq-v2`.
3. Commit. Installed phones pull the new version on next open.

## If something looks off

- **Demo banner won't go away** → `API_URL` empty or `/exec` wrong.
- **Red "can't reach the sheet" banner** → deployment access isn't "Anyone", or you saved the script without redeploying a new version.
- **Today/Yesterday empty but Week/Month fine** → date-format mismatch. The script already formats dates to `yyyy-MM-dd`; if it recurs, confirm the sheet's timezone (File → Settings → Time zone).
- **A dealer bills $0** → its name in Package_Log doesn't match the Dealerships rate book. The sheet's Dashboard tab counts these.
