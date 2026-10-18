# Starlit Wishes
A coquette, starry wish list app with separate lists that installs on your phone.
**Live app:** https://starlit-wishes.netlify.app
<img src="docs/homescreen.png" alt="Starlit Wishes on a phone" width="300" />
## Features
- Separate lists, e.g. Birthday, Christmas, Room makeover
- Add wishes with a link, price, category and how much you want them
- Tick wishes off when you get them, with totals of what's left
- Installs to your home screen as a PWA
## Built with
React, Vite, CSS variables, vite-plugin-pwa, Netlify
## Run it locally
 npm install
 npm run dev
## How I built it
Planned with GitHub Issues and a Projects board, one branch and
pull request per issue.
## What I learned

- **Planning work like a team.** I broke the app into 21 GitHub issues
  on a project board and built each one on its own branch, merged through
  a pull request. It made a big project feel manageable, one issue at a time.

- **Modelling related data.** Lists and wishes are stored separately, and
  each wish points to its list with a `listId`. Moving or deleting things
  became much simpler, and it's the same idea as a foreign key in a database.

- **Keeping React state immutable.** I learned to create new arrays with
  `map`, `filter` and the spread operator instead of changing state
  directly, because React only re-renders when it sees a new value.

- **Case sensitivity matters.** A saved key called `"Wishes"` didn't match
  `"wishes"`, and lowercase file names worked on my Mac but would have
  broken on Netlify's servers. I now keep naming consistent and component
  files capitalised.

- **Reading errors properly.** Messages like "is not a function" or
  "does not provide an export named" pointed straight at typos and import
  mistakes once I learned to read the file and line number in the console.

- **Default vs named exports.** `export default` is imported without braces;
  named exports need `{ }`. Mixing them up caused some of my most
  confusing bugs.

- **Validating user input.** Links typed without `https://` were treated as
  pages on my own site, so I wrote a `cleanUrl` helper that fixes and
  checks links before they're saved.
