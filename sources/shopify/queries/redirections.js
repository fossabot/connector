const redirectionsQuery = `query Redirections($cursor: String) {
    urlRedirects(first: 30, after: $cursor) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          path
          target
        }
      }
    }
  }`;

  
export default redirectionsQuery