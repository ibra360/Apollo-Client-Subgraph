import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/kreatorland/kreatorland-testnet-v11";




export const client = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache(),
})