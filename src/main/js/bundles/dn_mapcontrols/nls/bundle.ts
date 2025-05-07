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

const i18n = {
    root: {
        bundleName: "Map Controls",
        bundleDescription: "This bundle adds a ui element control the map.",
        ui: {
            tool: {
                title: "Map Controls",
                tooltip: "Map Controls"
            },
            northArrow: "Direction of north",
            northArrowDescription: "Can be changed with the arrow keys left and right. Enter resets the rotation.",
            moveUp: "Move view forward",
            moveDown: "Move view backward",
            moveLeft: "Move view left",
            moveRight: "Move view right",
            startAutorotation: "Start autorotation around midpoint",
            stopAutorotation: "Stop autorotation",
            increaseCameraAngle: "Increase camera angle",
            decreaseCameraAngle: "Decrease camera angle",
            cameraAzimut: "Camera azimut"
        }
    },
    de: true
};

export type Messages = (typeof i18n)["root"];
export interface MessagesReference {
    get: () => Messages
}
export default i18n;
