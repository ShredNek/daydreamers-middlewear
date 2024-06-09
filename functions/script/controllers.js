import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

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
  postEnquiry: async function (req, res) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const {
        firstName,
        lastName,
        mobileNumber,
        email,
        enquiryType,
        subject,
        message,
        favouriteColour,
        angerLevel,
        suggestedPunishment,
        codeName,
        levelOfSecrecy,
      } = req.body;

      const text = `Message: ${message},
      First name: ${firstName},
      Last name: ${lastName},
      Mobile number: ${mobileNumber},
      Enquiry type: ${enquiryType},
      Favourite colour: ${favouriteColour},
      ${angerLevel ? `angerLevel: ${angerLevel},` : ""}
      ${
        suggestedPunishment
          ? `suggestedPunishment: ${suggestedPunishment},`
          : ""
      }
      ${codeName ? `codeName: ${codeName},` : ""}
      ${levelOfSecrecy ? `levelOfSecrecy: ${levelOfSecrecy}` : ""}
              `;

      const html = `
      <p><strong>First name:</strong> ${firstName}</p>
      <p><strong>Last name:</strong> ${lastName}</p>
      <p><strong>Enquiry type:</strong> ${enquiryType}</p>
        <p><strong>Mobile number:</strong> ${mobileNumber}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Favourite colour:</strong> ${favouriteColour}</p>
        ${
          angerLevel ? `<p><strong>Anger level:</strong> ${angerLevel}</p>` : ""
        }
        ${
          suggestedPunishment
            ? `<p><strong>Suggested punishment:</strong> ${suggestedPunishment}</p>`
            : ""
        }
        ${codeName ? `<p><strong>Code name:</strong> ${codeName}</p>` : ""}
        ${
          levelOfSecrecy
            ? `<p><strong>Level of secrecy:</strong> ${levelOfSecrecy}</p>`
            : ""
        }`;

      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Website Enquiry: ${subject}`,
        text,
        html,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send(error.toString());
        }
        res.status(200).send("Email sent: " + info.response);
      });
    } catch (error) {
      console.error("Error making Shopify request:", error);
      res.status(500).json({ error: "Internal Server Error: " + error });
    }
  },
};
