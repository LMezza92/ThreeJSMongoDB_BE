const nodemailer = require("nodemailer");

class Email {

    constructor(){}

    async send(o) {
        let emailBody = `<h1>Hello</h1>`+
                        `<p>You have a new message from ${o.firstName}</p>`+
                        `<h3>Message: </h3> <p>${o.message}</p>`+
                        `<h4>From: </h4> <p>${o.firstName} ${o.lastName} from ${o.company}. Email: ${o.email}</p>`

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "lovadeus.music@gmail.com",
                pass: "zubvos-biZhyk-8zasmo"
            }
        });
    
        let info = await transporter.sendMail({
          from: '"Node App 😀" <node@mail.com>',
          to: "lovadeus.music@gmail.com", 
          subject: "Email from Node.js", 
          text: "text", 
          html:  emailBody, 
        });
        console.log("Message sent: %s", info.messageId);  
        
        //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }  
}

// main().catch(console.error);
module.exports = Email