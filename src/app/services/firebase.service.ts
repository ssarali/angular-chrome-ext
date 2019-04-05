// Angular service to interact with the Firestore database. This service is going to use an
// AngularFirestore instance(public db: AngularFirestore) and will include all the code to
// perform all the CRUD operations in angular.

// allows other classes to use this service
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TabModel } from '../TabModel';
import { CollectionModel } from '../CollectionModel';

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

  //deleteCollectionData(collectionName, model) { // model can be TabModel or CollectinModel
  //  return this.db.collection(collectionName).doc(model.id).delete();
  //}

  getCollectionData(resourceTitle: string) {
    return this.db.collection(resourceTitle).snapshotChanges();
  }

  createProject(name: string) {
    return this.db.collection(name).add({});
  }

  updateProjectList(cm: CollectionModel) {
    return this.db.collection('ListProjects').add({
      collectionName: cm.projectName
    });
  }
}
