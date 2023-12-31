async function retrieveData(req) {
  const storeName = process.env.SHOPIFY_STORE_NAME;
  const shopifyUrl = `https://${storeName}.myshopify.com/admin/api/2023-10/graphql.json`;

  try {
    const shopifyResponse = await fetch(shopifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_TOKEN,
      },
      body: JSON.stringify(req.body),
    });

    const shopifyData = await shopifyResponse.json();

    // Return the unprocessed data
    return shopifyData;
  } catch (error) {
    console.error("Error making Shopify request:", error);
    throw error; // Propagate the error to the caller
  }
}

export default {
  handleGqlPost: async function (req, res) {
    try {
      const rawData = await retrieveData(req);

      res.json(rawData);
    } catch (error) {
      console.error("Error processing data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
