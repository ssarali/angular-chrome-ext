import { Component, OnInit, OnChanges, NgZone } from '@angular/core';
import { TabModel } from './TabModel';
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

  constructor(
    private zone: NgZone,
    public firebaseService: FirebaseService,
  ) { }

  ngOnInit(): void {
    this.tabList = [];
    this.savedTabs = [];

    this.getSavedTabs();

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

  // gets the saved tabs from firebase
  getSavedTabs(): void {
    this.firebaseService.getTabs().subscribe(data => {
      this.savedTabs = data.map(firebaseObject => {        
        return {
          id: firebaseObject.payload.doc.id, // gets the document id associated to each tab
          ...firebaseObject.payload.doc.data() // gets all other properties from document in firebase
        } as TabModel;
      })
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


  // deletes a tab
  deleteTab(tab: TabModel): void {
    let savedTabIndex = this.savedTabs.findIndex(t => t.url === tab.url);
    if (savedTabIndex > 0) {
      this.firebaseService.deleteTab(tab)
        .then((response) => {
          console.log('Deleted: ' + tab.title)
        });
    } else {
      console.log('This tab (with this url) is has not been deleted.')
    }    
  }

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

  // create collection
  createCollection(collectionName: string): void {
    this.firebaseService.createCollection(collectionName)
      .then((response) => {
        console.log('Created new collection: ' + collectionName);        
    });
  }
}


