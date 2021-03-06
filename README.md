# query optimization stragies

- query the top level objects of the graph first (e.q repositories) and get their ids and use cursors if needed. leverage the use of `totalCounts` to check in advance which subqueries will need pagination.
- then for everyone of those id's seperate them in two groups, those that have `totalCount` of less than 100 and those that dont. use batch fetching the fetch all items in the first group. batch fetching can be done by using the top level `nodes` query and provide a list of nodes that are unique by nature. it works like a global key value store on github. use fragments to typecast to the correct type we want from the batch fetch. don't provide more than 50 items, otherwise timeouts might occur.
- then query the nested objects of the second group seperately and use cursors if needed.
- then merge the results of the queries

# learnings

- provide reasonable `limits` for queries, otherwise you're waisting points on the API rate limit
- e.g. it's unlikely there are more than 20 reviews for a PR, use that as a limit instead of 100 and paginate if needed
- a limit of 50 seems to be a good default for heavy queries to prevent timeouts

# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte

# create a new project in my-app
npm init svelte my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
