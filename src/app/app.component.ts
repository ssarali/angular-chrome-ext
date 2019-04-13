import { Component, OnInit, OnChanges, NgZone } from '@angular/core';
import { TabModel } from './TabModel';
import { ProjectModel } from './ProjectModel';
import { FirebaseService } from './services/firebase.service';
import { concat } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  ngOnChanges(changes: import("C:/git/stephenyoon-angular-chrome-ext/node_modules/@angular/core/src/metadata/lifecycle_hooks").SimpleChanges): void {
      throw new Error("Method not implemented.");
  }

  public title = 'The Angular Chrome Extension';
  public tabList: TabModel[];
  public savedTabs: TabModel[];
  public projectList: ProjectModel[];
  public defaultProject: ProjectModel;
  public selectedProject: ProjectModel;

  constructor(
    private zone: NgZone,
    public firebaseService: FirebaseService,
  ) { }

  ngOnInit(): void {
    this.tabList = [];
    this.savedTabs = [];
    this.projectList = [];
    this.selectedProject = this.defaultProject;

    this.defaultProject = new ProjectModel();
    this.defaultProject.projectName = 'test';
    this.defaultProject.id = 'NhdyUqrInaM8XHdlUo1i';

    this.getProjectTabs(this.defaultProject);
    this.getProjectNames(); 

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

  getProjectNames(): void {
    this.firebaseService.getProjectNames().subscribe(data => {
      this.projectList = data.map(firebaseObject => {
        return {
          id: firebaseObject.payload.doc.id,
          ...firebaseObject.payload.doc.data()
        } as ProjectModel
      })
    });
  }

  // gets the saved tabs from firebase. When a user chooses which project in the list, this will remove tabs from previous project from savedTabs and repopulate with
  // tabs from the new project to display
  getProjectTabs(p: ProjectModel): void {
    this.selectedProject = p;
    this.savedTabs = [];
    this.firebaseService.getProjectTabs(p).subscribe(data => {
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
  deleteTab(tab: TabModel, project: ProjectModel): void {
    let savedTabIndex = this.savedTabs.findIndex(t => t.url === tab.url);
    if (savedTabIndex > 0) {
      this.firebaseService.deleteTab(tab, project)
        .then((response) => {
          console.log('Deleted: ' + tab.title)
        });
    } 
  }

  // saves a single tab to firebase
  saveTab(tab: TabModel, project: ProjectModel): void {
    // save tab if not found in firebase
    let savedTabIndex = this.savedTabs.findIndex(t => t.url === tab.url);
    if (savedTabIndex < 0) {
      this.firebaseService.saveTab(tab, project)
        .then((response) => {
          console.log('Saved: ' + tab.title);
        });
    }
  }

  isTabSaved(tab: TabModel): boolean {
    let foundTabIndex = this.savedTabs.findIndex(t => t.url === tab.url);
    return foundTabIndex > 0;
  }

  isAnySavedTabs(): boolean {
    return this.savedTabs.length > 0;
  };

  isAnyProjects(): boolean {
    return this.projectList.length > 0;
  };

  createProject(name: string): void {
    var found = this.projectList.findIndex(p => p.projectName === name);
    if (name && found < 0) {
      var pm = new ProjectModel();
      pm.projectName = name;
      this.firebaseService.updateProjectList(pm); // this does not update this.projectlist even though i am subscribed??
      console.log(this.projectList);
      var result = this.projectList[this.projectList.findIndex(p => p.projectName == name)];
      console.log(result);
      this.firebaseService.createProject(result);    
    }    
  }

  deleteProject(p: ProjectModel): void {
    this.firebaseService.deleteProject(p);
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



// find a way to create a subcollection. it seems we need to pass in a documentID. How can we let firebase create it's own documentID
