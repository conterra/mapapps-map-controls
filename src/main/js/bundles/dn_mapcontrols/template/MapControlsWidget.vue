<!--

    Copyright (C) 2023 con terra GmbH (info@conterra.de)

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
        class="circlewrapper"
        @mouseleave="pickerCircleMouseUp"
        @mousemove="pickerCircleMouseMove"
        @mouseup="pickerCircleMouseUp"
    >
        <div
            id="circle"
            ref="circle"
            class="circle"
        >
            <div
                id="picker"
                ref="picker"
                class="picker"
                :style="rotationStyle"
            >
                <!--                <i-->
                <!--                    class="rotationarrow"-->
                <!--                    @mousedown="circleMouseDown"-->
                <!--                />-->
                <v-icon
                    class="esrinortharrow"
                    color="#45474D"
                    @mousedown="circleMouseDown"
                    @click="resetNorthArrow"
                >
                    esri-icon-compass
                </v-icon>
            </div>
            <div class="controlwrapper">
                <!--                <i-->
                <!--                    class="arrow right"-->
                <!--                    style="grid-area: 2 / 3 / 3 / 4; margin: 12px"-->
                <!--                    @click="rightArrow"-->
                <!--                />-->
                <!--                <i-->
                <!--                    class="arrow up"-->
                <!--                    style=" grid-area: 1 / 2 / 2 / 3; margin: 12px"-->
                <!--                    @click="upArrow"-->
                <!--                />-->
                <!--                <i-->
                <!--                    class="arrow left"-->
                <!--                    style=" grid-area: 2 / 1 / 3 / 2; margin: 12px"-->
                <!--                    @click="leftArrow"-->
                <!--                />-->
                <!--                <i-->
                <!--                    class="arrow down"-->
                <!--                    style=" grid-area: 3 / 2 / 4 / 3; margin: 12px"-->
                <!--                    @click="downArrow"-->
                <!--                />-->
                <v-icon
                    style="grid-area: 2 / 3 / 3 / 4; margin-top: 3px"
                    color="#45474D"
                    @click="rightArrow"
                >
                    icon-arrow-bold-right
                </v-icon>
                <v-icon
                    style=" grid-area: 1 / 2 / 2 / 3; "
                    color="#45474D"
                    @click="upArrow"
                >
                    icon-arrow-bold-up
                </v-icon>
                <v-icon
                    style=" grid-area: 2 / 1 / 3 / 2; margin-top: 3px"
                    color="#45474D"
                    @click="leftArrow"
                >
                    icon-arrow-bold-left
                </v-icon>
                <v-icon
                    style=" grid-area: 3 / 2 / 4 / 3"
                    color="#45474D"
                    @click="downArrow"
                >
                    icon-arrow-bold-down
                </v-icon>
                <!--                <v-icon-->
                <!--                    style=" grid-area: 2 / 2 / 3 / 3;"-->
                <!--                    color="#45474D"-->
                <!--                    @click="autoRotate"-->
                <!--                >-->
                <!--                    icon-video-->
                <!--                </v-icon>-->
                <div
                    v-if="viewmode === '3D'"
                    class="camera"
                    @click="autoRotate"
                />
            </div>
        </div>
        <div
            v-if="viewmode === '3D'"
            class="tiltslider"
        >
            <v-slider
                v-model="tilt"
                always-dirty
                :min="0"
                :max="90"
                :step="15"
                ticks="always"
                style="margin: 10px; position: absolute; top: -7px"
                height="42px"
                color="#45474D"
            >
                <template #append>
                    <v-layout style="margin-top: 5px !important">
                        <v-icon
                            color="#45474D"
                            @click="tilt=((tilt+15))"
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
                            @click="tilt=((tilt-15))"
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
        data: function () {
            return {
                rotation: null,
                mousedown: false,
                arot: false,
                tilt:null,
                longpressed: false,
                viewmode: undefined
            };
        },
        computed:{
            rotationStyle(){
                return "transform: rotate(-90deg) rotate(" + this.rotation + "deg);";
            }
        },
        watch: {
        },
        methods: {
            resetNorthArrow(event){
                if(this.longpressed){
                    return;
                }
                this.rotation = 0;
            },
            autoRotate(){
                this.arot = !this.arot;
                this._autoRotate();
            },
            _autoRotate(){
                if(this.arot){
                    this.rotation = this.rotation+0.2;
                    //await new Promise(r => setTimeout(r, 202));
                    window.requestAnimationFrame(this._autoRotate);
                }

            },
            async rightArrow(){
                this.$emit("rightArrow");
            },
            async upArrow(){
                this.$emit("upArrow");
            },
            async leftArrow(){
                this.$emit("leftArrow");
            },
            async downArrow(){
                this.$emit("downArrow");
            },


            circleMouseDown(event){
                this.pickerCircleMouseDown(event);
                this.longpressed = false;
                this.pressTimer = setTimeout(() => {
                    this.longpressed = true;
                }, 100);

            },
            pickerCircleMouseUp(){
                if(!this.mousedown){
                    return;
                }
                document.body.style.cursor = null;
                this.mousedown = false;
            },
            pickerCircleMouseMove(event){
                if(!this.mousedown){
                    return;
                }
                this.rotation = this.rotate(event.x, event.y);
            },
            pickerCircleMouseDown(event){
                this.mousedown = true;
                document.body.style.cursor = 'move';
                // document.addEventListener('mousemove', mousemove);
                // document.addEventListener('mouseup', mouseup);
            },
            getCenter(){
                var circle = this.$refs.circle;
                var rect = circle.getBoundingClientRect();
                var center = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
                return center;
            },
            rotate(x, y){
                const c = this.getCenter();

                var deltaX = x - c.x;
                var deltaY = y - c.y;


                // The atan2 method returns a numeric value between -pi and pi representing the angle theta of an (x,y) point.
                // This is the counterclockwise angle, measured in radians, between the positive X axis, and the point (x,y).
                // Note that the arguments to this function pass the y-coordinate first and the x-coordinate second.
                // atan2 is passed separate x and y arguments, and atan is passed the ratio of those two arguments.
                // * from Mozilla's MDN

                // Basically you give it an [y, x] difference of two points and it give you back an angle
                // The 0 point of the angle is left (the initial position of the picker is also left)

                var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

                // Math.atan2(deltaY, deltaX) => [-PI +PI]
                // We must convert it to deg so...
                // / Math.PI => [-1 +1]
                // * 180 => [-180 +180]

                return angle + 90;
            }
        }
    };
</script>
<style>

</style>
