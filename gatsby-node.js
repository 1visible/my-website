const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require('path')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "MarkdownRemark") {
    const parent = getNode(node.parent)
    const collection = parent.sourceInstanceName
    const relativeFilePath = createFilePath({ node, getNode, basePath: "content/" })

    createNodeField({
      node,
      name: 'collection',
      value: collection,
    })

    createNodeField({
      node,
      name: 'slug',
      value: relativeFilePath,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const result = await graphql(`
      query {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
                collection
              }
            }
          }
        }
      }
    `)

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve(`./src/templates/${node.fields.collection}.js`),
        context: {
            slug: node.fields.slug,
        },
      })
    })
  }