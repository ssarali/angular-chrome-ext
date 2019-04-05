import { Component, OnInit, OnChanges, NgZone } from '@angular/core';
import { TabModel } from './TabModel';
import { CollectionModel } from './CollectionModel';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  ngOnChanges(changes: import("C:/git/angular-chrome-ext/node_modules/@angular/core/src/metadata/lifecycle_hooks").SimpleChanges): void {
      throw new Error("Method not implemented.");
  }

  public title = 'The Angular Chrome Extension';
  public tabList: TabModel[];
  public savedTabs: TabModel[];
  public projectList: CollectionModel[];
  //public savedAreaName = 'Saved Tabs';
  public resourceTitle: 'test';

  constructor(
    private zone: NgZone,
    public firebaseService: FirebaseService,
  ) { }

  ngOnInit(): void {
    this.tabList = [];
    this.savedTabs = [];
    this.projectList = [];
    this.resourceTitle = 'test';

    this.getSavedTabs();
    this.getProjects(); 

    this.zone.run(() => {
      this.getTabList();
    });
  }

  getTabList(): void {    
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      tabs.forEach((tab) => {
        console.log('Tab URL: ', tab.url);

        this.tabList.push({
          id: null, 
          title: tab.title,
          url: tab.url,
          favIconUrl: tab.favIconUrl,
          windowId: tab.windowId,
          tabIndex: tab.index
        });
      });
      console.log('Number of tabs: ' + this.tabList.length);
    });
  };

  getProjects(): void {
    this.firebaseService.getCollectionData('ListProjects').subscribe(data => {
      this.projectList = data.map(firebaseObject => {
        return {
          id: firebaseObject.payload.doc.id,
          ...firebaseObject.payload.doc.data()
        } as CollectionModel
      })
    });
  }

  // gets the saved tabs from firebase
  getSavedTabs(): void {
    this.firebaseService.getCollectionData(this.resourceTitle).subscribe(data => {
      this.savedTabs = data.map(firebaseObject => {
        return {
          id: firebaseObject.payload.doc.id, // gets the document id associated to each tab
          ...firebaseObject.payload.doc.data() // gets all other properties from document in firebase
        } as TabModel;
      })
      this.savedTabs.sort((a, b) => {
        return (a.favIconUrl < b.favIconUrl ? -1 : (a.favIconUrl > b.favIconUrl ? 1 : 0));
      });
    });
  }

  // deletes a tab
  deleteTab(tab: TabModel): void {
    let savedTabIndex = this.savedTabs.findIndex(t => t.url === tab.url);
    if (savedTabIndex > 0) {
      this.firebaseService.deleteTab(tab)
        .then((response) => {
          console.log('Deleted: ' + tab.title)
        });
    } else {
      console.log('This tab (with this url) has not been deleted.')
    }    
  }

  //deleteCollectionData(model, isTab): void {
  //  if (isTab) {
  //    var index = this.savedTabs.findIndex(t => t.url === model.url);
  //  } else {
  //    var index = this.projectList.findIndex(p => p.projectName == model.projectName);
  //  }

  //  if (index > 0) {
  //    this.firebaseService.deleteCollectionData(model)
  //      .then((response) => {
  //        console.log('Deleted: ' + model)
  //      });
  //  } else {
  //    console.log('This tab (with this url) has not been deleted.')
  //  }
  //}

  // saves a single tab to firebase
  saveTab(tab: TabModel): void {
    // save tab if not found in firebase
    let savedTabIndex = this.savedTabs.findIndex(t => t.url === tab.url);
    if (savedTabIndex < 0) {
      this.firebaseService.saveTab(tab)
        .then((response) => {
          console.log('Saved: ' + tab.title);
        });
    } else {
      console.log('This tab (with this url) is already saved.')
    }
  }

  isTabSaved(tab: TabModel): boolean {
    let foundTabIndex = this.savedTabs.findIndex(t => t.url === tab.url);
    return foundTabIndex > 0;
  }

  createProject(name: string): void {
    if (name) {
      this.firebaseService.createProject(name)
        .then((response) => {
          console.log('Created new collection: ' + name);          
        });
      var cm = new CollectionModel();
      cm.projectName = name;
      this.firebaseService.updateProjectList(cm);
    }    
  }  

  // Open all tabs in project
  openProjectTabs(): void {
    this.savedTabs.forEach((tab) => {
      chrome.tabs.create({ url: tab.url });
    });
  }

  // jumps to the open tab when you click on it in the extension
  openTab(tabIndex: number): void {
    chrome.tabs.highlight({ 'tabs': tabIndex }, function () { });
  }

   //// loads the tab list. This is not needed anymore because of the subscribe method in getSavedTabs().
  //onClickRefresh(): void {
  //  console.log('This triggers a lifecycle to load the tabs in tabList and is related to zone. This is similar to $apply/$digest in angularJs.');
  //}
}


