///
/// Copyright (C) 2023 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import * as projection from "esri/geometry/projection";
import Point from "esri/geometry/Point";
import SpatialReference from "esri/geometry/SpatialReference";

import type { InjectedReference } from "apprt-core/InjectedReference";
import type { MapWidgetModel } from "map-widget/api";
import type { default as Config } from "../MapControlsWidgetModel";

export class MapMovementController {
    private _mapWidgetModel: InjectedReference<MapWidgetModel>;
    private _mapControlsModel: InjectedReference<typeof Config>;

    public constructor(
        mapWidgetModel: InjectedReference<MapWidgetModel>,
        mapControlsModel: InjectedReference<typeof Config>) {
        this._mapWidgetModel = mapWidgetModel;
        this._mapControlsModel = mapControlsModel;
    }

    public async handleRightArrowClick(): Promise<void> {
        const viewpoint = this._mapWidgetModel!.viewpoint;
        if (!viewpoint) { return; }

        if (!projection.isLoaded()) {
            await projection.load();
        }

        const [x, y, z] = this.getCoordinateValuesFromViewpoint(viewpoint);
        const wgs84 = this.convertToWGS84(x, y, z);
        const pt = this.moveLocation(wgs84.latitude, wgs84.longitude,
            (360 - viewpoint.rotation + 90) % 360);
        const epsg25832 = this.convertToGK(pt.x, pt.y);

        this.updateViewPoint(epsg25832);
    }

    public async handleLeftArrowClick(): Promise<void> {
        const viewpoint = this._mapWidgetModel?.viewpoint;
        const targetGeometry = viewpoint?.targetGeometry;
        if (!viewpoint || !targetGeometry) { return; }

        if (!projection.isLoaded()) {
            await projection.load();
        }

        const [x, y, z] = this.getCoordinateValuesFromViewpoint(viewpoint);
        const wgs84 = this.convertToWGS84(x, y, z);
        const pt = this.moveLocation(wgs84.latitude, wgs84.longitude,
            (360 - viewpoint.rotation - 90) % 360);
        const epsg25832 = this.convertToGK(pt.x, pt.y);

        this.updateViewPoint(epsg25832);
    }

    public async handleUpArrowClick(): Promise<void> {
        const viewpoint = this._mapWidgetModel?.viewpoint;
        const targetGeometry = viewpoint?.targetGeometry;
        if (!viewpoint || !targetGeometry) { return; }

        if (!projection.isLoaded()) {
            await projection.load();
        }

        const [x, y, z] = this.getCoordinateValuesFromViewpoint(viewpoint);
        const wgs84 = this.convertToWGS84(x, y, z);
        const pt = this.moveLocation(wgs84.latitude, wgs84.longitude, 360 - viewpoint.rotation);
        const epsg25832 = this.convertToGK(pt.x, pt.y);

        this.updateViewPoint(epsg25832);
    }

    public async handleDownArrowClick(): Promise<void> {
        const viewpoint = this._mapWidgetModel?.viewpoint;
        const targetGeometry = viewpoint?.targetGeometry;
        if (!viewpoint || !targetGeometry) { return; }

        if (!projection.isLoaded()) {
            await projection.load();
        }

        const [x, y, z] = this.getCoordinateValuesFromViewpoint(viewpoint);
        const wgs84 = this.convertToWGS84(x, y, z);
        const pt = this.moveLocation(wgs84.latitude, wgs84.longitude,
            (360 - viewpoint.rotation - 180) % 360);
        const epsg25832 = this.convertToGK(pt.x, pt.y);

        this.updateViewPoint(epsg25832);
    }

    private convertToWGS84(x: number, y: number, z: number): __esri.Point {
        const inputPoint = new Point({
            x,
            y,
            z,
            spatialReference: {
                wkid: 25832
            }
        });

        const spatialReference = new SpatialReference({
            "wkid": 3857
        });

        return projection.project(inputPoint, spatialReference) as __esri.Point;
    }

    private convertToGK(latitude: number, longitude: number): __esri.Point {
        const inputPoint = new Point({
            latitude,
            longitude,
            spatialReference: {
                wkid: 3857
            }
        });
        const spatialReference = new SpatialReference({
            "wkid": 25832
        });

        return projection.project(inputPoint, spatialReference) as __esri.Point;
    }

    private moveLocation(latitude: number, longitude: number, direction: number): { x: number, y: number, z: number } {
        let dist = 100;
        const scale = this._mapWidgetModel!.scale!;

        if (scale <= 13745) {
            dist = 100;
        } else if (scale <= 377344.95536145923) {
            dist = 1000;
        } else {
            dist = 10000;
        }

        const distRadians = dist / (6372797.6);

        const rBearing = direction * Math.PI / 180.0;

        const lat1 = latitude * Math.PI / 180;
        const lon1 = longitude * Math.PI / 180;

        let lat2 = Math.asin(Math.sin(lat1) * Math.cos(distRadians) + Math.cos(lat1)
            * Math.sin(distRadians) * Math.cos(rBearing));
        let lon2 = lon1 + Math.atan2(Math.sin(rBearing) * Math.sin(distRadians) * Math.cos(lat1),
            Math.cos(distRadians) - Math.sin(lat1) * Math.sin(lat2));

        lat2 = lat2 * 180 / Math.PI;
        lon2 = lon2 * 180 / Math.PI;

        const x = lat2;
        const y = lon2;
        const z = 0;

        return { x, y, z };

    }

    private getCoordinateValuesFromViewpoint(viewpoint: __esri.Viewpoint): [number, number, number] {
        const targetGeometry: __esri.Point = viewpoint.targetGeometry;

        if (!targetGeometry) {
            return [0, 0, 0];
        } else {
            return [targetGeometry.x, targetGeometry.y, targetGeometry.z];
        }
    }

    private updateViewPoint(gkPoint: __esri.Point): void {
        const mapControlsModel = this._mapControlsModel!;
        if (mapControlsModel.rightClickActive) {
            return;
        }

        this.getView().then((view) => {
            gkPoint.spatialReference.wkid = view.spatialReference.wkid;
            view.goTo(
                { target: gkPoint },
                { animate: true });
        });

    }

    private getView(): Promise<__esri.MapView | __esri.SceneView> {
        const mapWidgetModel = this._mapWidgetModel!;
        return new Promise((resolve) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                const watcher = mapWidgetModel.watch("view", ({ value: view }) => {
                    watcher.remove();
                    resolve(view);
                });
            }
        });
    }
}
