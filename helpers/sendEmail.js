const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.EMAIL_KEY;

const emailApi = new Sib.TransactionalEmailsApi();

const sendEmail = async (email, name, text) => {
  try {
    const response = await emailApi.sendTransacEmail({
      sender: { email: "romanovskiyk97@gmail.com", name: "OwnRestaurant" },
      to: [{ email: email, name: name }],
      subject: "Notification from restaurant 'OwnRestaurant'",
      htmlContent: <h1>${text}</h1>,
    });

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
