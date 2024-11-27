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

import type { InjectedReference } from "apprt-core/InjectedReference";
import type { MapWidgetModel } from "map-widget/api";
import type { default as Config } from "../MapControlsWidgetModel";

export class MapCameraController {
    private _mapWidgetModel: InjectedReference<MapWidgetModel>;
    private _mapControlsModel: InjectedReference<typeof Config>;

    public constructor(
        mapWidgetModel: InjectedReference<MapWidgetModel>,
        mapControlsModel: InjectedReference<typeof Config>) {
        this._mapWidgetModel = mapWidgetModel;
        this._mapControlsModel = mapControlsModel;
    }

    public putHeadingTiltIntoCamera([tilt]: number[], camera: __esri.Camera): __esri.Camera | undefined {
        const mapControlsModel = this._mapControlsModel!;

        if (mapControlsModel.rightClickActive) {
            return;
        }

        this.getView().then(async (view) => {
            if (view?.state?.animation !== null) {
                return camera;
            }

            view.goTo({tilt}, { animate: false });

            return camera;
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
