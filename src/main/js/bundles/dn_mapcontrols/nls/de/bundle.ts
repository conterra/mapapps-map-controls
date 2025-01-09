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

import { Messages } from "../bundle";

export default {
    bundleName: "Karten Steuerung",
    bundleDescription: "Dieses Bundle fügt der Karte ein Bedienelement zur Steuerung hinzu.",
    ui: {
        tool: {
            title: "Kartensteuerung",
            tooltip: "Kartensteuerung"
        },
        northArrow: "Nordrichtung",
        moveUp: "Ansicht nach vorne verschieben",
        moveDown: "Ansicht nach hinten verschieben",
        moveLeft: "Ansicht nach links verschieben",
        moveRight: "Ansicht nach rechts verschieben",
        startAutorotation: "Autorotation der Ansicht starten",
        stopAutorotation: "Autorotation der Ansicht stoppen",
        increaseCameraAngle: "Kamera Azimuth erhöhen",
        decreaseCameraAngle: "Kamera Azimut verringern",
        cameraAzimut: "Kamera Azimut"
    }
} satisfies Messages;
