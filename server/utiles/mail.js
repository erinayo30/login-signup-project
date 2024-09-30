const nodemailer = require("nodemailer");

exports.generateOTP = () => {
  let otp = "";
  for (let i = 0; i <= 3; i++) {
    const randVal = Math.round(Math.random() * 9).toString();
    otp = otp + randVal;
  }
  return otp;
};
exports.generateEmailTemplate = (OTP) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Genetate OTP</title>
    <style>
        @media only screen and (max-width:620){
            h1{
                font-size: 20px;
                padding: 5px;
            }
        }
    </style>
</head>
<body>
    <div>
        <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif;color: #272727;">
            <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">We are delighted to have you onboard </h1>
            <p>Please verify Your Email to continue your verification code is:</p>
            <p style="width: 80px; margin: 0 auto; font-weight: bold; text-align: center ;
            background: #f6f6f6; border-radius: 5px; font-size: 25px;">${OTP}</p>
        </div>
    </div>

</body>
</html>`;
};

exports.plainEmailTemplate = (heading, message) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Genetate OTP</title>
    <style>
        @media only screen and (max-width:620){
            h1{
                font-size: 20px;
                padding: 5px;
            }
        }
    </style>
</head>
<body>
    <div>
        <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif;color: #272727;">
            <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">${heading}</h1>
            <p style="color #272727; text-align: center">${message}</p>
            <p style="width: 1000px; margin: 0 auto; font-weight: bold; text-align: center ;
            background: #f6f6f6; border-radius: 5px; font-size: 25px;">We are glad to have you!</p>
        </div>
    </div>

</body>
</html>`;
};

// Forgot password
exports.generatePasswordResetTemplate = (url) => {
  return `
    <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Genetate OTP</title>
      <style>
          @media only screen and (max-width:620){
              h1{
                  font-size: 20px;
                  padding: 5px;
              }
          }
      </style>
  </head>
  <body>
      <div>
          <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif;color: #272727;">
              <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">Reset Password Request</h1>
              <p style="color #272727; text-align: center">Click the link below to reset your password</p>
              <div style="text-align:center">
              <a href="${url}" style="width: 80px; margin: 0 auto; font-weight: bold; text-align: center ;
              background: #e63946; border-radius: 5px; font-size: 25px 20px; color:#fff; cursor:pointer; text-decoration:none;
              display: inline-block">Reset Password</a>
          </div>
      </div>
  
  </body>
  </html>`;
};

exports.passwordResetTemplate = (heading, message) => {
  return `
    <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Genetate OTP</title>
      <style>
          @media only screen and (max-width:620){
              h1{
                  font-size: 20px;
                  padding: 5px;
              }
          }
      </style>
  </head>
  <body>
      <div>
          <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif;color: #272727;">
              <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727;">${heading}</h1>
              <p style="color #272727; text-align: center">${message}</p>
              <p style="width: 1000px; margin: 0 auto; font-weight: bold; text-align: center ;
              background: #f6f6f6; border-radius: 5px; font-size: 25px;">We are glad to have you!</p>
          </div>
      </div>
  
  </body>
  </html>`;
};
