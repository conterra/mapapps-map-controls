///
/// Copyright (C) 2025 con terra GmbH (info@conterra.de)
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

import MapControlsWidget from "./template/MapControlsWidget.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";
import { ifDefined } from "apprt-binding/Transformers";
import { MapCameraController } from "./controllers/MapCameraController";
import { MapRotationController } from "./controllers/MapRotationController";
import { MapMovementController } from "./controllers/MapMovementController";

import type { InjectedReference } from "apprt-core/InjectedReference";
import type { MessagesReference } from "./nls/bundle";
import type {MapWidgetModel, View} from "map-widget/api";
import type { default as Config } from "./MapControlsWidgetModel";
import {Handle} from "apprt-core/Types";

export class MapControlsWidgetFactory {
    private vm?: Vue;
    private mapWidgetModelToVmBinding!: Binding | undefined;
    private mapRotationController?: MapRotationController;
    private cameraController?: MapCameraController;
    private mapMovementController?: InjectedReference<MapMovementController>;

    private _i18n!: InjectedReference<MessagesReference>;
    private _mapWidgetModel!: InjectedReference<MapWidgetModel>;
    private _mapControlsModel!: InjectedReference<typeof Config>;

    private _watchViewHandle: Handle;

    public activate(): void {
        this.initComponent();
    }

    private initComponent(): void {
        const vm = this.vm = new Vue(MapControlsWidget);
        vm.i18n = this._i18n!.get();

        this.initMovementControl(vm);
        this.initCameraControl(vm);
        this.initRotationControl(vm);

        this.createMapWidgetModelToVmBinding();
        this.watchForViewChange();
    }

    public createInstance(): typeof VueDijit {
        const widget = VueDijit(this.vm);

        widget.activateTool = () => {};
        widget.deactivateTool = () => {};
        return widget;
    }

    private watchForViewChange(): void {
        this._watchViewHandle = this._mapWidgetModel!.watch("view", (watchEvent) => {
            const view = watchEvent.value;
            if (view) {
                this.addEventListenersToView(view);
            }

            const oldView = watchEvent.old;
            if(oldView) {
                oldView.removeHandles();
            }

        });
    }

    private initMovementControl(vm: Vue): void {
        const controller = this.mapMovementController =
            new MapMovementController(this._mapWidgetModel, this._mapControlsModel);

        vm.$on("rightArrow", () => {
            controller.handleRightArrowClick();
        });
        vm.$on("upArrow", () => {
            controller.handleUpArrowClick();
        });
        vm.$on("leftArrow", () => {
            controller.handleLeftArrowClick();
        });
        vm.$on("downArrow", () => {
            controller.handleDownArrowClick();
        });
    }

    private initCameraControl(vm: Vue): void {
        let cameraController = this.cameraController;
        if (!cameraController) {
            cameraController = this.cameraController = new MapCameraController(
                this._mapWidgetModel, this._mapControlsModel
            );
        }
        vm.$on("tilt", (tilt: number) => {
            this.cameraController?.putHeadingTiltIntoCamera([tilt], undefined);
        });
    }

    private initRotationControl(vm: Vue): void {
        let mapRotationController = this.mapRotationController;
        if (!mapRotationController) {
            mapRotationController = this.mapRotationController = new MapRotationController(
                this._mapWidgetModel, this._mapControlsModel
            );
        }
        vm.$on("rotate", (rotation: number) => {
            this.mapRotationController?.updateViewRotation([rotation]);
        });
    }

    private createMapWidgetModelToVmBinding(): void {
        if (!this.vm || !this._mapWidgetModel || !this._mapControlsModel) { return; }
        const mapWidgetModel = this._mapWidgetModel;

        this.mapWidgetModelToVmBinding = Binding.for(mapWidgetModel, this.vm)
            .syncAll("viewmode")
            .enable()
            .syncToRightNow();
    }

    public deactivate(): void {
        if (this.mapWidgetModelToVmBinding) {
            this.mapWidgetModelToVmBinding.unbind();
            this.mapWidgetModelToVmBinding = undefined;
        }

        if (this.vm) {
            this.vm.$off();
            this.vm = undefined;
        }

        if (this.mapRotationController) {
            this.mapRotationController = undefined;
        }

        if (this.cameraController) {
            this.cameraController = undefined;
        }

        if (this.mapMovementController) {
            this.mapMovementController = undefined;
        }

        if(this._watchViewHandle){
            this._watchViewHandle.remove();
        }
    }

    public addEventListenersToView(view: View): void {
        const mapControlsModel = this._mapControlsModel!;
        const vm = this.vm;

        view.on("pointer-down", (event) => {
            if (event.button === 2) {
                mapControlsModel.rightClickActive = true;
            }
        });
        view.on("pointer-up", (event) => {
            if (event.button === 2) {
                mapControlsModel.rightClickActive = false;
            }
        });
        view.on("drag", (event) => {
            if (event.button === 2 && event.action === "update") {
                if ("camera" in view && vm !== undefined) {
                    vm.tilt = view.camera?.tilt;
                }
                if("viewpoint" in view && vm !== undefined) {
                    vm.rotation = view.viewpoint.rotation;
                }
            }
        });
    }

}
