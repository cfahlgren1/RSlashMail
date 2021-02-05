const mailchimp = require("@mailchimp/mailchimp_marketing");
const { startAirflowJob } = require("./startAirflowJob");
const md5 = require("md5");

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.SERVER_PREFIX,
});

const addUserToList = async (subscribingUser, options) => {
  const tags = options.choices;
  const listId = process.env.MAILCHIMP_AUDIENCE;
  const email = subscribingUser.email;
  const subscriberHash = md5(email.toLowerCase());

  // if user wants instant email, tag as SendNow
  if (options.sendNow) {
    tags.push("SendNow");
  }

  console.log(email, tags);

  try {
    // create or update contact in mailchimp
    const response = await mailchimp.lists.setListMember(
      listId,
      subscriberHash,
      {
        email_address: email,
        status_if_new: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
        },
        tags: tags,
      }
    );
    console.log(
      `Successfully added ${email} as an audience member with tags ${tags}.`
    );

    // check to see if they would like an instant newsletter
    if (options.sendNow) {
      startAirflowJob(email);
    }
  } catch (err) {
    console.log("Error adding contact", err.message);
  }
};

module.exports = { addUserToList };
