The current version of this application is deployed to `https://goa-app.vercel.app/`.

# development

- for the best developer experience, we recommend using [Visual Studio Code](https://code.visualstudio.com/) along with the following extensions
  - https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql
  - https://marketplace.visualstudio.com/items?itemName=luyizhi.vscode-graphql

## local deployment

- make sure you create a github application for authenticating users. follow the steps [here](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

- make sure you have a `.env` file in the root directory of this repository, check `.env.example` for the required variables. `CLIENT_SECRET` and `CLIENT_ID` are the credentials for the GitHub OAuth app. make sure for the callback url you use `http://localhost:3000` in the github app settings when developing locally.

- make sure you have `vercel` installed. for instructions follow [this ](https://vercel.com/docs/cli)

- run `yarn install` or `npm install` to install the dependencies

- we rely on vercel serverless functions to authenticate to github, thus we have to use `vercel dev -l 127.0.0.1:3000` for local development instead of `yarn dev`. make sure the correct callback url is set in the github application settings.

## implementing new metrics

- all of the metrics are defined in `src/lib/components/chaoss-metrics`

- a metric consists of a `.gql` file, that contains the graphql query, and a `.svelte` file that contains the svelte component that renders the metric.

- to explore the API, you can use the [explorer](https://docs.github.com/en/graphql/overview/explorer)

- to find out more about vega-lite api, the following collection of examples is very helpful: [https://observablehq.com/collection/@vega/vega-lite-api](https://observablehq.com/collection/@vega/vega-lite-api)

# deployment

- run `vercel --prod`. make sure the correct callback url is set in the github application settings.

# query optimization stragies

- query the top level objects of the graph first (e.q repositories) and get their ids and use cursors if needed. leverage the use of `totalCounts` to check in advance which subqueries will need pagination.
- then for everyone of those id's seperate them in two groups, those that have `totalCount` of less than 100 and those that dont. use batch fetching the fetch all items in the first group. batch fetching can be done by using the top level `nodes` query and provide a list of nodes that are unique by nature. it works like a global key value store on github. use fragments to typecast to the correct type we want from the batch fetch. don't provide more than 50 items, otherwise timeouts might occur.
- then query the nested objects of the second group seperately and use cursors if needed.
- then merge the results of the queries

# learnings

- provide reasonable `limits` for queries, otherwise you're waisting points on the API rate limit
- e.g. it's unlikely there are more than 20 reviews for a PR, use that as a limit instead of 100 and paginate if needed
- a limit of 50 seems to be a good default for heavy queries to prevent timeouts
