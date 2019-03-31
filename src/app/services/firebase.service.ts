// Angular service to interact with the Firestore database. This service is going to use an
// AngularFirestore instance(public db: AngularFirestore) and will include all the code to
// perform all the CRUD operations in angular.

// allows other classes to use this service
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TabModel } from '../TabModel';

@Injectable({
  providedIn: 'root' // anyone from root and lower can get this service
})

export class FirebaseService {
  constructor(public db: AngularFirestore) { }

  saveTab(tab: TabModel) {
    return this.db.collection('test').add({
      title: tab.title,
      url: tab.url,
      favIconUrl: tab.favIconUrl,
      windowId: tab.windowId,
      tabIndex: tab.tabIndex,
    });
  }

  deleteTab(tab: TabModel) {
    return this.db.collection('test').doc(tab.id).delete();
  }

  getTabs() {
    return this.db.collection('test').snapshotChanges();
  }

  createCollection(collectionName: string) {
    return this.db.collection(collectionName).add({
    });
  }

  // need GCP SDK to extend fnuctionality and use getCollections
  //getListCollections() {
  //  return this.db.getCollections().then(collections => {
  //    for (let collection of collections) {
  //      console.log(`Found collection with id: ${collection.id}`);
  //    }
  //  })
  // }
}
