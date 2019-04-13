// Angular service to interact with the Firestore database. This service is going to use an
// AngularFirestore instance(public db: AngularFirestore) and will include all the code to
// perform all the CRUD operations in angular.

// allows other classes to use this service
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TabModel } from '../TabModel';
import { ProjectModel } from '../ProjectModel';

@Injectable({
  providedIn: 'root' // anyone from root and lower can get this service
})

export class FirebaseService {
  constructor(public db: AngularFirestore) { }

  private ProjectList = 'ListProjects';

  saveTab(t: TabModel, p: ProjectModel) {
    return this.db.collection(this.ProjectList).doc(p.id).collection(p.projectName).add({
      title: t.title,
      url: t.url,
      favIconUrl: t.favIconUrl,
      windowId: t.windowId,
      tabIndex: t.tabIndex,
    });
  }

  deleteTab(t: TabModel, p: ProjectModel) {
    return this.db.collection(this.ProjectList).doc(p.id).collection(p.projectName).doc(t.id).delete();
  }

  getProjectNames() {
    return this.db.collection(this.ProjectList).snapshotChanges();
  }

  getProjectTabs(p: ProjectModel) {
    return this.db.collection(this.ProjectList).doc(p.id).collection(p.projectName).snapshotChanges();
  }

  // todo: trying to find collection p.projectName but it can't be fouind
  createProject(p: ProjectModel) {
    return this.db.collection(this.ProjectList).doc(p.id).collection(p.projectName).add({
      title: 'New Tab',
      url: 'chrome://newtab/',
      favIconUrl: 'https://www.google.com/favicon.ico',
      windowId: 1,
      tabIndex: 1
    });
  }

  deleteProject(p: ProjectModel) {
    return this.db.collection(this.ProjectList).doc(p.id).delete();
  }
  
  updateProjectList(pm: ProjectModel) {
    return this.db.collection(this.ProjectList).add({
      projectName: pm.projectName
    });
  }
}
