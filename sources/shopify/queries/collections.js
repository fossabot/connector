const collectionsQuery = `query Collections($cursor: String) {
  collections(first: 10, after: $cursor) {
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        title
        description
        descriptionHtml
        handle
      }
    }
  }
}`

export default collectionsQuery