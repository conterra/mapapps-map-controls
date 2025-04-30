<!--

    Copyright (C) 2025 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <div
        class="ct-mapcontrols__wrapper"
        @focusout="pickerCircleMouseUp"
        @mouseup="pickerCircleMouseUp"
    >
        <div
            id="circle"
            ref="circle"
            class="ct-mapcontrols__circle"
        >
            <div
                id="picker"
                ref="picker"
                class="picker"
                :aria-label="i18n.ui.northArrow"
                role="button"
                tabindex="0"
                :style="rotationStyle"
            >
                <v-icon
                    class="ct-mapcontrols__northarrow"
                    color="#45474D"
                    @mousedown="circleMouseDown"
                    @click="resetNorthArrow"
                >
                    esri-icon-compass
                </v-icon>
            </div>
            <div class="ct-mapcontrols__controlwrapper">
                <v-btn
                    icon
                    style=" grid-area: 1 / 2 / 2 / 3"
                    :aria-label="i18n.ui.moveUp"
                    @click="upArrow"
                >
                    <v-icon color="#45474D">
                        icon-arrow-bold-up
                    </v-icon>
                </v-btn>
                <v-btn
                    icon
                    style="grid-area: 2 / 3 / 3 / 4"
                    :aria-label="i18n.ui.moveRight"
                    @click="rightArrow"
                >
                    <v-icon color="#45474D">
                        icon-arrow-bold-right
                    </v-icon>
                </v-btn>
                <v-btn
                    icon
                    style=" grid-area: 3 / 2 / 4 / 3"
                    :aria-label="i18n.ui.moveDown"
                    @click="downArrow"
                >
                    <v-icon
                        color="#45474D"
                    >
                        icon-arrow-bold-down
                    </v-icon>
                </v-btn>
                <v-btn
                    icon
                    style=" grid-area: 2 / 1 / 3 / 2"
                    :aria-label="i18n.ui.moveLeft"
                    @click="leftArrow"
                >
                    <v-icon
                        color="#45474D"
                    >
                        icon-arrow-bold-left
                    </v-icon>
                </v-btn>
                <v-btn
                    v-if="viewmode === '3D'"
                    icon
                    large
                    :ripple="false"
                    style="grid-area: 2 / 2 / 3 / 3;"
                    :class="!arot ? 'autorotate--start' : 'autorotate--stop'"
                    :aria-label="arot ? i18n.ui.stopAutorotation : i18n.ui.startAutorotation"
                    @click="autoRotate"
                >
                    <v-icon
                        color="#45474D"
                        large
                    >
                        icon-video
                    </v-icon>
                </v-btn>
            </div>
        </div>
        <div
            v-if="viewmode === '3D'"
            class="ct-mapcontrols__tiltslider-wrapper"
        >
            <v-slider
                v-model="tilt"
                always-dirty
                :min="0"
                :max="90"
                :step="15"
                hide-details
                ticks="always"
                color="#45474D"
                class="mt-0"
                :aria-label="i18n.ui.cameraAzimut"
                @input="$emit('tilt', $event)"
            >
                <template #append>
                    <v-layout style="margin-top: 5px !important">
                        <v-icon
                            color="#45474D"
                            small
                            role="button"
                            :aria-label="i18n.ui.decreaseCameraAngle"
                            @click="updateCameraAngle(15)"
                        >
                            icon-video
                        </v-icon>
                    </v-layout>
                </template>
                <template #prepend>
                    <v-layout style="margin-top: 5px !important">
                        <v-icon
                            color="#45474D"
                            style="transform: rotate(90deg);"
                            small
                            role="button"
                            :aria-label="i18n.ui.increaseCameraAngle"
                            @click="updateCameraAngle(-15)"
                        >
                            icon-video
                        </v-icon>
                    </v-layout>
                </template>
            </v-slider>
        </div>
    </div>
</template>

<script>
    import Bindable from "apprt-vue/mixins/Bindable";

    export default {
        mixins: [Bindable],
        props: {
            i18n: {
                type: Object,
                default: function () {
                    return {
                        ui: {
                            northArrow: "Direction of north",
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
                    };
                }
            }
        },
        data: function () {
            return {
                rotation: null,
                mousedown: false,
                arot: false,
                tilt: null,
                longpressed: false,
                viewmode: undefined
            };
        },
        computed: {
            rotationStyle() {
                return "transform: rotate(-90deg) rotate(" + this.rotation + "deg);";
            }
        },
        watch: {},
        mounted() {
            document.addEventListener('mousemove', this.pickerCircleMouseMove);
            document.addEventListener('mouseup', this.pickerCircleMouseUp);
        },
        destroyed() {
            document.removeEventListener('mousemove', this.pickerCircleMouseMove);
            document.removeEventListener('mouseup', this.pickerCircleMouseUp);
        },
        methods: {
            resetNorthArrow() {
                if (this.longpressed) {
                    return;
                }
                const newRotation = this.rotation = 0;
                this.$emit("rotate", newRotation);
            },
            autoRotate() {
                this.arot = !this.arot;
                this._autoRotate();
            },
            _autoRotate() {
                if (this.arot) {
                    const newRotation = this.rotation = this.rotation + 0.2;
                    this.$emit("rotate", newRotation);
                    window.requestAnimationFrame(this._autoRotate);
                }
            },
            async rightArrow() {
                this.$emit("rightArrow");
            },
            async upArrow() {
                this.$emit("upArrow");
            },
            async leftArrow() {
                this.$emit("leftArrow");
            },
            async downArrow() {
                this.$emit("downArrow");
            },

            circleMouseDown(event) {
                /* TODO: implement alternate version for Keyboard users
                 * maybe left/right arrows while focus on north arrow
                 */
                this.pickerCircleMouseDown(event);
                this.longpressed = false;
                this.pressTimer = setTimeout(() => {
                    this.longpressed = true;
                }, 100);

            },
            pickerCircleMouseUp() {
                if (!this.mousedown) {
                    return;
                }
                document.body.style.cursor = null;
                this.mousedown = false;
            },
            pickerCircleMouseMove(event) {
                if (!this.mousedown) {
                    return;
                }
                this.rotate(event.x, event.y);
            },
            pickerCircleMouseDown() {
                this.mousedown = true;
                document.body.style.cursor = 'move';
            },
            getCenter() {
                var circle = this.$refs.circle;
                var rect = circle.getBoundingClientRect();
                var center = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
                return center;
            },
            rotate(x, y) {
                const c = this.getCenter();

                var deltaX = x - c.x;
                var deltaY = y - c.y;


                // The atan2 method returns a numeric value between -pi and pi representing the angle theta of an (x,y)
                // point. This is the counterclockwise angle, measured in radians, between the positive X axis,
                // and the point (x,y).Note that the arguments to this function pass the y-coordinate first and the
                // x-coordinate second.
                // atan2 is passed separate x and y arguments, and atan is passed the ratio of those two arguments.
                // * from Mozilla's MDN

                // Basically you give it an [y, x] difference of two points and it give you back an angle
                // The 0 point of the angle is left (the initial position of the picker is also left)

                var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

                // Math.atan2(deltaY, deltaX) => [-PI +PI]
                // We must convert it to deg so...
                // / Math.PI => [-1 +1]
                // * 180 => [-180 +180]
                const newRotation = this.rotation = angle + 90;
                this.$emit("rotate", newRotation);
                return newRotation;
            },
            updateCameraAngle(diff) {
                const newTilt = this.tilt = this.tilt + diff;
                this.$emit('tilt', newTilt);
            }
        }
    };
</script>
<style>

</style>
