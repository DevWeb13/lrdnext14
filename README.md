
# LRDnext14

Authentication template with Next.js 14.



## Tech Stack

**Next.js 14**           
**Next-Auth V5**                    
**MongoDb**                    
**Mongoose**             
**TailwindCss**                
**Resend**        
**Zod**       
**Vercel**

## Features

- Authentication with Auth.js V5 and server actions.
- Authentication with credentials and Google.
- Account creation.
- Account verification by email
- Change password by email.
- Connection.
- Disconnection.
- Account deletion.
- Intelligent User Account Management: Our application uses an advanced authentication method which guarantees the creation of only one account per email address. Whether you choose to log in with Google or through traditional credentials, our system recognizes your email address and automatically links your session to your existing account. This simplifies your user experience while maintaining the security and integrity of your personal data.
- Error management and display.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URI`            
`AUTH_SECRET`                  
`AUTH_URL`                     
`GOOGLE_CLIENT_ID`                       
`GOOGLE_CLIENT_SECRET`                  
`RESEND_API_KEY`
## Run Locally

Clone the project

```bash
  git clone https://github.com/DevWeb13/lrdnext14.git
```

Go to the project directory

```bash
  cd lrdnext14
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

**Clone Project Video Demo:**

[![Clone project video demo](https://raw.githubusercontent.com/DevWeb13/lrdnext14/main/mq2.webp)](https://youtu.be/7uKiR6s3-Ao "Clone project")

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
