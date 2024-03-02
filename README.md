# Online store with customization tools <img src="https://github.com/mateuszzientek/product-customization-store/blob/master/logo.png" width="200" align="center"/>

The System is an innovative web application that not only serves as an online shoe store specializing in footwear sales but also stands out with a unique customization feature. The primary focus is on individual user experiences, allowing them to create their own shoe designs.

The System provides users with complete freedom to customize their footwear. With advanced customization tools, users can add their own texts, graphics, patches, or modify specific colors of shoe elements. It's not just a store, it's a place where everyone can become the designer of their own shoes.


## Personalization 
![Projekt bez nazwy](https://github.com/mateuszzientek/product-customization-store/assets/101110887/ef83a751-54e6-45b5-b513-7f808de54298)

## Features

- User Authentication: Secure login and account management
- Browsing Products (filtering, sorting, searching)
- Adding Products to Cart and Checkout
- User Panel (add addresses, manage personal data, review orders)
- Personalization Tools (creating footwear designs, adding inserts, text, graphics, changing the colors of footwear elements)
- Saving Projects, deleting, modification, finalization
- Administrator panel 
- Favorite products
- Dark Mode Light 
- Newsletter
- Multilingual support
- User Support (Questions)

## Technologies

TypeScript | MongoDB | HTML5 | CSS | React.js | Express.js | Node.js | Tailwind | Firebase | Cloudinary | Photoshop

## Screenshots

<img src="https://github.com/mateuszzientek/product-customization-store/assets/101110887/1536968b-1083-48a7-8912-999eb3d4ec75" width="300" /> <img src="https://github.com/mateuszzientek/product-customization-store/assets/101110887/1f70af46-e705-4e62-8b09-e682b0ca0252" width="300" /> <img src="https://github.com/mateuszzientek/product-customization-store/assets/101110887/cdf8a4c1-5882-49da-b449-614d939319a0" width="300" /> <img src="https://github.com/mateuszzientek/product-customization-store/assets/101110887/8b647b0b-d79d-4725-9e30-ab7b4b67891d" width="300" /> <img src="https://github.com/mateuszzientek/product-customization-store/assets/101110887/a600855e-da39-4b6f-ab19-a713677a7163" width="300" /> <img src="https://github.com/mateuszzientek/product-customization-store/assets/101110887/485abfd9-bd18-4c00-bb1d-220de8360d8c" width="300" />

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_LINK` - Link to the MongoDB Database

`EMAIL_USER`- Recipient Email in Inquiry Module

`EMAIL_PASS`- Recipient Password in Inquiry Module

`GOOGLE_CLIENT_ID`- Client ID (Passport.js)

`GOOGLE_CLIENT_SECRET`- Client Password (Passport.js)

`SECRET_KEY`- Unique session key

## Deployment

Navigate to the "server" directory

```bash
  cd server
```
Install the necessary dependencies for the server layer
```bash
  npm install
```
Create a .env file in the server folder, and add environment variables.
```bash
  touch .env
```
Navigate to the "client" directory
```bash
  cd client
```
Install the necessary dependencies for the client layer
```bash
  npm install
```
Start the server on the server-side (after navigating to the "server" directory) 
```bash
  npm run dev
```
Start the server on the client-side (after navigating to the "client" directory) 
```bash
  npm start
```
Enter http://localhost:3000 in your web browser (if the server's chosen port is 3000)

