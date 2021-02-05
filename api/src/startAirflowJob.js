const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.SERVER_PREFIX,
});

const startAirflowJob = async (userEmail) => {
  console.log("Started Airflow Job!");

  const listId = process.env.MAILCHIMP_AUDIENCE;
  const email = userEmail;
  const subscriberHash = md5(email.toLowerCase());

  console.log(`Removing SendNow tag for ${email}`);

  try {
    // remove SendNow tag since we have sent email
    await mailchimp.lists.updateListMemberTags(listId, subscriberHash, {
      tags: [
        {
          name: "SendNow",
          status: "inactive",
        },
      ],
    });
  } catch (err) {
    console.log("Error removing tag", err.message);
  }
  console.log("Successfully removed tag!");
};

module.exports = { startAirflowJob };
