import { Component, OnInit, OnChanges, NgZone } from '@angular/core';
import { TabModel } from './TabModel';

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

  constructor(
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.tabList = [];

    this.zone.run(() => {
      this.getTabList();
    });
  }

  getTabList(): void {    
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      tabs.forEach((tab) => {
        console.log('Tab URL: ', tab.url);

        this.tabList.push({
          title: tab.title,
          url: tab.url,
          favIconUrl: tab.favIconUrl,
          windowId: tab.windowId,
          tabIndex: tab.index
        });
      });
    });
  };
}


