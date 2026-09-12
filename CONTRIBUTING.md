# Contributing to HackIEEE

These rules are binding for everyone on the team — humans and AI agents alike.

## The one-line version

> Branch → commit → push the branch → open a PR → get a review → merge.
> Never push to `main`. Never force-push anything.

---

## 1. Never commit directly to `main`

`main` is the deployed site. Every change reaches it through a pull request.

```bash
git checkout main
git pull origin main
git checkout -b feat/dune-hero
```

Branch naming:

| Prefix      | Use for                                  | Example                       |
| ----------- | ---------------------------------------- | ----------------------------- |
| `feat/`     | New feature or section                   | `feat/dune-timeline`          |
| `fix/`      | Bug fix                                  | `fix/mobile-menu-overflow`    |
| `style/`    | Visual/theme work, no logic change       | `style/arrakis-palette`       |
| `chore/`    | Deps, config, tooling, assets            | `chore/compress-backgrounds`  |
| `docs/`     | Documentation only                       | `docs/contributing`           |

One branch = one concern. If you find an unrelated bug mid-branch, write it down and fix it on its own branch.

## 2. Commit messages

Conventional Commits, imperative mood, lowercase subject, no trailing period:

```
feat(hero): add spice-drift particle layer
fix(navbar): close mobile menu on route change
style(tracks): swap neon palette for arrakis tokens
chore(assets): convert tracks-bg to avif
```

Keep commits small enough that the subject line is honest about what changed.

## 3. Push the branch, never `main`

```bash
git push -u origin feat/dune-hero
```

If `git push` is rejected because the remote moved ahead, **rebase or merge and push again** — do not reach for `--force`:

```bash
git pull --rebase origin feat/dune-hero
git push
```

## 4. `--force` is banned

The following are **never** to be run in this repository, by anyone, for any reason:

```
git push --force
git push -f
git push --force-with-lease
git push --force-if-includes
```

Also banned as a way to "clean up" shared history:

```
git reset --hard <something already pushed>
git rebase <onto a branch others have pulled>   # rewriting pushed commits
git commit --amend                              # on a commit that is already pushed
```

Why: force-pushing rewrites history on the remote. Anyone who has already pulled that
branch gets a divergent local copy, and any commit that was on the remote but not in
your local branch is silently destroyed. During a hackathon build, with several people
on the same repo, that is the single fastest way to lose someone's work.

**To undo a bad commit, add a new commit that reverses it:**

```bash
git revert <sha>        # safe: creates a new commit undoing <sha>
git push                # ordinary push, no force
```

If you genuinely believe a branch's history must be rewritten (e.g. a secret was
committed), stop and raise it with the repo owner. Do not do it yourself. The fix is a
rotated credential plus a revert, not a rewritten remote.

## 5. Opening the pull request

```bash
gh pr create --base main --title "feat(hero): dune-themed hero section" --body-file -
```

Every PR must include:

- **What changed** — one paragraph, plain English.
- **Why** — the issue, the request, or the bug it fixes.
- **How to check it** — the route to open and what to look at (`/`, `/sponsorship`, mobile at 375px).
- **Screenshots or a screen recording** — mandatory for any visual change, desktop *and* mobile.
- **Risk** — anything a reviewer should look at twice (asset weight, animation cost, form/DB changes).

Before you request review:

```bash
npm run lint
npm run build
```

Both must pass. A PR that does not build does not get reviewed.

## 6. Review and merge

- At least one approval from someone who did not write the code.
- The author does not merge their own PR without that approval.
- Resolve every review thread before merging; reply with what you changed.
- Merge with **Squash and merge** so `main` keeps one clean commit per PR.
- Delete the branch after merge.

## 7. Keeping a long-lived branch current

Prefer merging `main` in over rebasing, because merge never rewrites commits that
others may already have:

```bash
git checkout feat/dune-hero
git fetch origin
git merge origin/main
# resolve conflicts, commit, then an ordinary push
git push
```

## 8. Rules for AI agents working in this repo

- Do **not** run `git commit`, `git push`, or `gh pr create` unless the user asks for that specific action in that turn.
- Never run any command containing `--force`, `-f` on a push, or `reset --hard` on pushed history.
- Never commit `.env*`, keys, or Supabase/Resend credentials.
- Never commit generated or vendored directories (`.next/`, `node_modules/`).
- Report honestly when lint or build fails; do not describe unverified work as done.
