// const URL = 'https://appointment-backend.herokuapp.com/api';  //Local Server URL
const URL = 'http://13.232.149.183:3000/api';  //Local Server URL

module.exports = {
    // 'database': 'mongodb://appointment:appointment@ds229609.mlab.com:29609/appointment',
    'database': 'mongodb://localhost/seeadoc_test',
    'token_secret': 'appointment_api_secret',
    'token_expire': '30 days',
    'SERVER_URL': URL
};

