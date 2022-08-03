// https://api.qualtrics.com/daed82306b1ea-update-response

const QUALTRICS_TOKEN = process.env.QUALTRICS_TOKEN
// technically not a secret, but might as well pre-fill anyway
// since it'll be constant for this task
const SURVEY_ID = process.env.SURVEY_ID

exports.handler = async(event) => {
    const data_in = JSON.parse(event.body)
    const data = data_in['data']
    const responseId = data_in['responseId'] // specific to participant
    const out_data = {surveyId: SURVEY_ID,
                      resetRecordedDate: true,
                      embeddedData: {
                        // I *think* you'll want to pre-make this field,
                        // so it shows up by default? Data should be saved
                        // regardless, but just to save some heartache...
                        "task_data": JSON.stringify(data)
                      }}
    return fetch(`https://ca1.qualtrics.com/API/v3/responses/${responseId}`, {
        "method": "PUT",
        "headers": {
          "Content-Type": "application/json",
          "X-API-TOKEN": QUALTRICS_TOKEN
        },
        "body": JSON.stringify(out_data)
      })
      .then(response => {
        console.log(response);
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
      })
      .catch(err => {
        console.error(err);
        return JSON.stringify(err)
      });
}