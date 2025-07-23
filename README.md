[![devnet-bundle-snapshot](https://github.com/conterra/mapapps-map-controls/actions/workflows/devnet-bundle-snapshot.yml/badge.svg)](https://github.com/conterra/mapapps-map-controls/actions/workflows/devnet-bundle-snapshot.yml)
![Static Badge](https://img.shields.io/badge/requires_map.apps-4.18.0-e5e5e5?labelColor=%233E464F&logoColor=%23e5e5e5)
![Static Badge](https://img.shields.io/badge/tested_for_map.apps-4.18.2-%20?labelColor=%233E464F&color=%232FC050)
# Map Controls bundle
The Map Controls Bundle is a widget for displaying a ui used to move around 2D and 3D maps.

## Sample app
https://demos.conterra.de/mapapps/resources/apps/public_demo_mapcontrols/index.html

![Screenshot App](https://github.com/conterra/mapapps-map-controls/blob/main/screenshot.JPG)

## Installation guide
1. Add the bundle `dn_mapcontrols` to your app.
2. No configuration of the bundle is necessary

## Development guide
Run the following commands from the project root directory to start a local development server:

```bash
# install all required node modules
$ mvn initialize

# start dev server
$ mvn compile -Denv=dev -Pinclude-mapapps-deps

# run unit tests
$ mvn test -P run-js-tests,include-mapapps-deps
```
