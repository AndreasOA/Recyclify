# Recyclify

![alt Recyclify](https://public-files.gumroad.com/variants/2eybkmnrm28tg75h8hf5pnf04srf/aaae050e7f2cfbcf4bae0db128f6d013bbb2ef09ed7bbdf8f388260a71b0abfa)

Introducing Recyclify - the ultimate app for all your recycling needs! 

With Recyclify, you can easily find recycling recommendations in your area based on your current location. Whether you're looking to recycle old electronics or dispose of hazardous materials safely, Recyclify has got you covered. But that's not all - Recyclify is also a marketplace for buying and selling used, old, or damaged items. By connecting you with buyers and sellers in your local community, Recyclify helps you reduce waste and give new life to items that might have otherwise ended up in the landfill.

This app was created in the process of three months by [Florian Rothkegel](https://github.com/FlorianRothkegel) and me.

## Installation
We used Expo for testing. Therefore, if you might want to check it out, [here](https://docs.expo.dev/get-started/installation/) is the link.

Use the package manager [yarn](https://yarnpkg.com/) to install the necessary node_modules.

```bash
yarn install
```

Setup a [firebase](https://cloud.google.com/firestore/docs/client/get-firebaseaccount) and store the necessary credentials in a file named config.json. 
The config.json should look as follows:

```json
{
    "apiKey": "XXX",
    "authDomain": "XXX",
    "projectId": "XXX",
    "storageBucket": "XXX",
    "messagingSenderId": "XXX",
    "appId": "XXX"
}
```

## Usage

For Android
```bash
yarn android
```
or for iOS
```bash
yarn ios
```
