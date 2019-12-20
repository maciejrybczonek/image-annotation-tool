# Image Annotation Tool

## Preview

http://rybczonek.pl/image-annotation-tool/

## Description

Manual image annotation is the process of manually defining regions in an image and creating a textual description of those regions.

This app is made with:
* Angular
* NgRx Store
* Bootstrap
* Konva.js

*Notice:* Application is using LocalStorage to store images as a Base64 string, due to limitation of LocalStorage capacity
(10MB) you should consider changing storage to IndexedDB (if you want to store images locally) or handle image storing on server side.

## Install dependencies

Run `npm install` or `yarn install`

## Run development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
