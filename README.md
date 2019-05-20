# angular-chrome-extension

## Software Used
- Angular 7
- Bootstrap
- Firebase Cloud Database
- Chrome's public API

## Purpose
A Chrome extension that utilizes Chrome's public API to capture all open tabs, and allows users to save/retrieve tabs to a 'project' stored within Firebase's database.

## General Configuration
- npm install
- npm install -g @angular/cli
- ng new < application-name >
- create manifest.json (required for Chrome extensions)
- npm install --save @types/chrome
- npm install --save firebase @angular/fire
- npm install bootstrap  
  
## Configuration for Chrome Extension Usage
- Update Environment.ts file to include your Firebase database keys.
- Run ng build in the command prompt to create dist folder
- Go to chrome://extensions, enable developer mode and drad n drop the dist folder onto the page
- Chrome extension should appear beside your search bar :)

# Auto-generated Angular information

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
