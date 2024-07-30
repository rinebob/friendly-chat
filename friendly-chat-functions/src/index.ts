/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
// import {onDocumentWritten} from "firebase-functions/v2/firestore";

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// export const dude = onDocumentWritten(() => {

// });

// exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
export const makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
        console.log('functions makeUppercase called');
        const original = snap.data().original;
        console.log('original: ', original);
        console.log('Uppercasing', context.params.documentId, original);
        const uppercase = original.toUpperCase();
        console.log('uppercase: ', uppercase);
      return snap.ref.set({uppercase}, {merge: true});
});



// Cloud functions for Firebase video series
// From https://www.youtube.com/playlist?list=PLl-K7zZEsYLkPZHe41m4jfAxUi0JjLgSM

// http trigger
// return the contents of a document 
// cities-weather collection

// Promise-based

// http triggers must send a response for all code paths
export const getBostonWeather = functions.https.onRequest((request, response) => {
    // get method returns a promise
    admin.firestore().doc('cities-weather/boston-ma-us').get()
        .then((snapshot) => {
            const data = snapshot.data()
            response.send(data);
        })
        .catch(error => {
            console.log('funcs gBW error: ', error)
            response.status(500).send(error);
        })
})

// firestore (background) trigger
// send a cloud message when a document is updated
export const onBostonWeatherUpdate = functions.firestore.document('cities-weather/boston-ma-us').onUpdate(change => {
    const before = change.before.data();
    const after = change.after.data();
    console.log('funcs oBWU before/after: ', before, after);
    const payload = {
        data: {
            temp: String(after.temp),
            conditions: after.conditions
        }
    }
    // must return a promise for all code paths
    // sendToTopic method returns a promise
    return admin.messaging().sendToTopic('weather_boston-ma-us', payload)
})

export const getBostonAreaWeather = functions.https.onRequest((request, response) => {
    admin.firestore().doc('areas/greater-boston').get()
    .then(areaSnapshot => {
        const cities = areaSnapshot.data()?.cities;
        const promises = [];
        for (const city of cities) {
            const p = admin.firestore().doc(`cities-weather/${city}`).get();
            promises.push(p);
        }
        return Promise.all(promises);
    })
    .then(citySnapshots => {
        const results: any[] = [];
        citySnapshots.forEach(citySnap => {
            const data = citySnap.data()
            data ? data.city = citySnap.id : null;
            results.push(data);
        })
        response.send(results);
    })
    .catch(error => {
        console.log(error);
        response.status(500).send(error);
    })
})

// Async/await based in ts
export async function myFunction(): Promise<string> {

    const rank = await getRank();

    // return Promise.resolve('dude');
    // or just return the string and let the async keyword wrap it in a promise
    return 'dude the rank is: ' + rank;
}

export function getRank() {
    // creates a promise that immediately resolves with a value of 1
    return Promise.resolve(1);
}

// use a try/catch block to handle errors when using async await
export async function myFunction2(): Promise<string> {
    try {
        const rank = await getRank();
        return 'dude the rank is: ' + rank;
    }
    catch (err) {
        return 'Error: ' + err;
    }
}

// above promise-based method now using async await
export const getBostonWeather2 = functions.https.onRequest(async (request, response) => {
    try {
        const snapshot = await admin.firestore().doc('cities-weather/boston-ma-us').get()
        const data = snapshot.data()
        response.send(data);
    }
    catch (error) {
        console.log('funcs gBW error: ', error)
        response.status(500).send(error);
    }
})

// Note: he says that if all you're doing is returning a promise from a function and not using the result
// then there's no need to use async await.  ex onBostonWeatherUpdate function above

// async await version of above getBostonAreaWeather method
export const getBostonAreaWeather2 = functions.https.onRequest(async (request, response) => {
    try {
        const areaSnapshot = await admin.firestore().doc('areas/greater-boston').get();
        const cities = areaSnapshot.data()?.cities;
        const promises = [];
        for (const city of cities) {
            const p = admin.firestore().doc(`cities-weather/${city}`).get();
            promises.push(p);
        }

        const citySnapshots = await Promise.all(promises);
        const results: any[] = [];
        citySnapshots.forEach(citySnap => {
            const data = citySnap.data()
            data ? data.city = citySnap.id : null;
            results.push(data);
        })
        response.send(results);
    }
    catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
})
