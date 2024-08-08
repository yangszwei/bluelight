
//存放量角器
var Angle_Point0 = [];
var Angle_Point1 = [];
var Angle_Point2 = [];
var Angle_Point3 = [];

//正在選取的Angle
var Angle_now_choose = null;
//正在繪製的Angle
var Angle_previous_choose = null;

function angle() {
    if (BL_mode == 'angle') {
        DeleteMouseEvent();

        angle.angle_ = "stop";
        set_BL_model.onchange = function () {
            displayMark();
            angle.angle_ = null;
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            if (angle.angle_ == "rotate") return; //angle.angle_ = "stop";
            if (!MouseDownCheck) return;
            angle_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
            Angle_previous_choose = null;
            if (Angle_now_choose) return;
            if (angle.angle_ == "stop" && !Angle_previous_choose) {
                Angle_Point0 = Angle_Point1 = rotateCalculation(e, true);
                var AngleMark = new BlueLightMark();

                AngleMark.setQRLevels(GetViewport().QRLevels);
                AngleMark.color = "#FF0000";
                AngleMark.hideName = AngleMark.showName = "ruler";
                AngleMark.type = "AngleRuler";

                PatientMark.push(AngleMark);
                Angle_previous_choose = AngleMark;
                angle.angle_ = "line";
            }
        });

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);

            let angle2point = rotateCalculation(e, true);
            if (angle.angle_ == "rotate") {
                Angle_Point2 = angle2point;

                if (!Angle_previous_choose) return;
                var AngleMark = Angle_previous_choose;

                AngleMark.pointArray = [];
                AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                AngleMark.setPoint2D(Angle_Point2[0], Angle_Point2[1]);
                AngleMark.Text = getAnglelValue(e);

                refreshMark(AngleMark);
                displayAllMark();
            }
            else if (MouseDownCheck && Angle_previous_choose) {
                if (angle.angle_ == "line") {
                    Angle_Point1 = angle2point;

                    var AngleMark = Angle_previous_choose;
                    AngleMark.pointArray = [];
                    AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                    AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                    AngleMark.Text = "";

                    refreshMark(AngleMark);
                    displayAllMark();
                }
            }
            else if (Angle_now_choose) {
                Angle_now_choose.pointArray[Angle_now_choose.order].x = angle2point[0];
                Angle_now_choose.pointArray[Angle_now_choose.order].y = angle2point[1];
                Angle_now_choose.dcm.Text = getAnglelValueBy2Point(Angle_now_choose.pointArray);
                refreshMark(Angle_now_choose.dcm);
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            if (openMouseTool && rightMouseDown) displayMark();
            if (Angle_now_choose) {
                Angle_now_choose.pointArray[Angle_now_choose.order].x = rotateCalculation(e, true)[0];
                Angle_now_choose.pointArray[Angle_now_choose.order].y = rotateCalculation(e, true)[1];
                Angle_now_choose.dcm.Text = getAnglelValueBy2Point(Angle_now_choose.pointArray);
                refreshMark(Angle_now_choose.dcm);
                angle.angle_ = "stop";
            }
            if (angle.angle_ == "rotate") {
                let angle2point = rotateCalculation(e, true);
                Angle_Point2 = angle2point;

                if (!Angle_previous_choose) return;
                var AngleMark = Angle_previous_choose;

                AngleMark.pointArray = [];
                AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                AngleMark.setPoint2D(Angle_Point2[0], Angle_Point2[1]);
                AngleMark.Text = getAnglelValue(e);
                refreshMark(AngleMark);
                displayAllMark();
                Mark_previous_choose = Angle_previous_choose;
            }
            if (MouseDownCheck == true) {
                if (angle.angle_ == "line") angle.angle_ = "rotate";
                else if (angle.angle_ == "rotate") angle.angle_ = "stop";
            }
            if (Angle_now_choose) {
                Angle_previous_choose = Angle_now_choose;
                Mark_previous_choose = Angle_now_choose;
            }
            Angle_now_choose = null;
        });

        BlueLightTouchstartList = [];
        BlueLightTouchstartList.push(function (e, e2) {
            angle_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
            Angle_previous_choose = null;
            if (Angle_now_choose) return;
            if (angle.angle_ == "rotate") angle.angle_ = "stop";
            if (angle.angle_ == "stop" && !Angle_previous_choose) {
                Angle_Point0 = Angle_Point1 = rotateCalculation(e, true);
                var AngleMark = new BlueLightMark();

                AngleMark.setQRLevels(GetViewport().QRLevels);
                AngleMark.color = "#FF0000";
                AngleMark.hideName = AngleMark.showName = "ruler";
                AngleMark.type = "AngleRuler";

                PatientMark.push(AngleMark);
                Angle_previous_choose = AngleMark;
                angle.angle_ = "line";
            }
        });

        BlueLightTouchmoveList = [];
        BlueLightTouchmoveList.push(function (e, e2) {
            if (rightTouchDown) scale_size(e, originalPoint_X, originalPoint_Y);

            let angle2point = rotateCalculation(e, true);
            if (angle.angle_ == "rotate") {
                Angle_Point2 = angle2point;

                if (!Angle_previous_choose) return;
                var AngleMark = Angle_previous_choose;

                AngleMark.pointArray = [];
                AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                AngleMark.setPoint2D(Angle_Point2[0], Angle_Point2[1]);
                AngleMark.Text = getAnglelValue(e);

                refreshMark(AngleMark);
                displayAllMark();
            }
            else if (TouchDownCheck && Angle_previous_choose) {
                if (angle.angle_ == "line") {
                    Angle_Point1 = angle2point;

                    var AngleMark = Angle_previous_choose;
                    AngleMark.pointArray = [];
                    AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                    AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                    AngleMark.Text = "";

                    refreshMark(AngleMark);
                    displayAllMark();
                }
            }
            else if (Angle_now_choose) {
                Angle_now_choose.pointArray[Angle_now_choose.order].x = angle2point[0];
                Angle_now_choose.pointArray[Angle_now_choose.order].y = angle2point[1];
                Angle_now_choose.dcm.Text = getAnglelValueBy2Point(Angle_now_choose.pointArray);
                refreshMark(Angle_now_choose.dcm);
            }
        });

        BlueLightTouchendList = [];
        BlueLightTouchendList.push(function (e, e2) {
            if (openMouseTool && rightTouchDown) displayMark();
            if (Angle_now_choose) {
                Angle_now_choose.pointArray[Angle_now_choose.order].x = rotateCalculation(e, true)[0];
                Angle_now_choose.pointArray[Angle_now_choose.order].y = rotateCalculation(e, true)[1];
                Angle_now_choose.dcm.Text = getAnglelValueBy2Point(Angle_now_choose.pointArray);
                refreshMark(Angle_now_choose.dcm);
                angle.angle_ = "stop";
            }
            if (angle.angle_ == "rotate") {
                /*let angle2point = rotateCalculation(e,true);
                Angle_Point2 = angle2point;

                if (!Angle_previous_choose) return;
                var AngleMark = Angle_previous_choose;

                AngleMark.pointArray = [];
                AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                AngleMark.setPoint2D(Angle_Point2[0], Angle_Point2[1]);
                AngleMark.Text = getAnglelValue(e);
                refreshMark(AngleMark);
                displayAllMark();*/
            }
            if (TouchDownCheck == true) {
                if (angle.angle_ == "line") angle.angle_ = "rotate";
                else if (angle.angle_ == "rotate") angle.angle_ = "stop";
            }
            if (Angle_now_choose) Angle_previous_choose = Angle_now_choose;
            Angle_now_choose = null;
        });

        AddMouseEvent();
    }

    if (BL_mode == 'angle2') {
        DeleteMouseEvent();

        angle.angle_ = "stop";
        set_BL_model.onchange = function () {
            displayMark();
            angle.angle_ = null;
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            if (!MouseDownCheck) return;
            if (angle.angle_ == "waitline2" && Angle_previous_choose) {
                Angle_Point2 = Angle_Point3 = rotateCalculation(e, true);
                var AngleMark = Angle_previous_choose;

                AngleMark.pointArray = [];
                AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                AngleMark.setPoint2D(Angle_Point2[0], Angle_Point2[1]);
                AngleMark.setPoint2D(Angle_Point3[0], Angle_Point3[1]);

                //PatientMark.push(AngleMark);
                Angle_previous_choose = AngleMark;
                angle.angle_ = "line2";
                return;
            }
            angle_pounch2(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);

            if (Angle_now_choose) {
                Angle_previous_choose = null;
                return;
            }

            //if (angle.angle_ == "line2") angle.angle_ = "stop";
            if (angle.angle_ == "stop"/*&& !Angle_previous_choose*/) {
                Angle_Point0 = Angle_Point1 = rotateCalculation(e, true);
                var AngleMark = new BlueLightMark();

                AngleMark.setQRLevels(GetViewport().QRLevels);
                AngleMark.color = "#FF0000";
                AngleMark.hideName = AngleMark.showName = "ruler";
                AngleMark.type = "AngleRuler2";

                PatientMark.push(AngleMark);
                Angle_previous_choose = AngleMark;
                angle.angle_ = "line";
            }
        });

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);

            let angle2point = rotateCalculation(e, true);
            if (angle.angle_ == "line2") {
                Angle_Point3 = angle2point;

                if (!Angle_previous_choose) return;
                var AngleMark = Angle_previous_choose;

                AngleMark.pointArray = [];
                AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                AngleMark.setPoint2D(Angle_Point2[0], Angle_Point2[1]);
                AngleMark.setPoint2D(Angle_Point3[0], Angle_Point3[1]);
                AngleMark.Text = getAnglelValueBy2Point(Angle_previous_choose.pointArray);

                refreshMark(AngleMark);
                displayAllMark();
            }
            else if (MouseDownCheck && Angle_previous_choose) {
                if (angle.angle_ == "line") {
                    Angle_Point1 = angle2point;

                    var AngleMark = Angle_previous_choose;
                    AngleMark.pointArray = [];
                    AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                    AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                    AngleMark.Text = "";

                    refreshMark(AngleMark);
                    displayAllMark();
                }
            }
            else if (Angle_now_choose) {
                Angle_now_choose.pointArray[Angle_now_choose.order].x = angle2point[0];
                Angle_now_choose.pointArray[Angle_now_choose.order].y = angle2point[1];
                Angle_now_choose.dcm.Text = getAnglelValueBy2Point(Angle_now_choose.pointArray);
                refreshMark(Angle_now_choose.dcm);
                displayAllMark();
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            if (openMouseTool && rightMouseDown) displayMark();
            if (Angle_now_choose) {
                Angle_now_choose.pointArray[Angle_now_choose.order].x = rotateCalculation(e, true)[0];
                Angle_now_choose.pointArray[Angle_now_choose.order].y = rotateCalculation(e, true)[1];
                Angle_now_choose.dcm.Text = getAnglelValueBy2Point(Angle_now_choose.pointArray);
                refreshMark(Angle_now_choose.dcm);
                angle.angle_ = "stop";
                Angle_previous_choose = Angle_now_choose;
                Mark_previous_choose = Angle_previous_choose;
                Angle_now_choose = null;
            }
            if (angle.angle_ == "line2") {
                let angle2point = rotateCalculation(e, true);
                Angle_Point3 = angle2point;

                if (!Angle_previous_choose) return;
                var AngleMark = Angle_previous_choose;

                AngleMark.pointArray = [];
                AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                AngleMark.setPoint2D(Angle_Point2[0], Angle_Point2[1]);
                AngleMark.setPoint2D(Angle_Point3[0], Angle_Point3[1]);
                AngleMark.Text = getAnglelValueBy2Point(Angle_previous_choose.pointArray);
                refreshMark(AngleMark);
                displayAllMark();
                Mark_previous_choose = Angle_previous_choose;
            }
            if (MouseDownCheck == true) {
                if (angle.angle_ == "line") angle.angle_ = "waitline2";
                else if (angle.angle_ == "line2") angle.angle_ = "stop";
            }
            //if (Angle_now_choose) Angle_previous_choose = Angle_now_choose;
            //Angle_now_choose = null;
        });

        AddMouseEvent();
    }
}

function angle_pounch(currX, currY) {
    let block_size = getMarkSize(GetViewportMark(), false) * 4;
    //if (GetViewport().VerticalFlip == true) currY = GetViewport().height - currY;
    //if (GetViewport().HorizontalFlip == true) currX = GetViewport().width - currX;

    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == GetViewport().sop) {
            if (PatientMark[n].type == "AngleRuler") {
                var tempMark = PatientMark[n].pointArray;

                var x1 = parseInt(tempMark[0].x), y1 = parseInt(tempMark[0].y);
                if (currY + block_size >= y1 && currY - block_size <= y1 && currX + block_size >= x1 && currX - block_size <= x1) {
                    Angle_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 0 };
                }

                var x2 = parseInt(tempMark[1].x), y2 = parseInt(tempMark[1].y);
                if (currY + block_size >= y2 && currY - block_size <= y2 && currX + block_size >= x2 && currX - block_size <= x2) {
                    Angle_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 1 };
                }

                var x3 = parseInt(tempMark[2].x), y3 = parseInt(tempMark[2].y);
                if (currY + block_size >= y3 && currY - block_size <= y3 && currX + block_size >= x3 && currX - block_size <= x3) {
                    Angle_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 2 };
                }
                /*if (currY + block_size >= y1 && currX + block_size >= x1 / 2 + x2 / 2 && currY < y1 + block_size && currX < x1 / 2 + x2 / 2 + block_size) {

                }*/
            }
        }
    }
}

function angle_pounch2(currX, currY) {
    let block_size = getMarkSize(GetViewportMark(), false) * 4;
    //if (GetViewport().VerticalFlip == true) currY = GetViewport().height - currY;
    //if (GetViewport().HorizontalFlip == true) currX = GetViewport().width - currX;

    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == GetViewport().sop) {
            if (PatientMark[n].type == "AngleRuler2") {
                var tempMark = PatientMark[n].pointArray;
                if (tempMark.length < 1) return;
                var x1 = parseInt(tempMark[0].x), y1 = parseInt(tempMark[0].y);
                if (currY + block_size >= y1 && currY - block_size <= y1 && currX + block_size >= x1 && currX - block_size <= x1) {
                    Angle_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 0 };
                }

                if (tempMark.length < 2) return;
                var x2 = parseInt(tempMark[1].x), y2 = parseInt(tempMark[1].y);
                if (currY + block_size >= y2 && currY - block_size <= y2 && currX + block_size >= x2 && currX - block_size <= x2) {
                    Angle_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 1 };
                }

                if (tempMark.length < 3) return;
                var x3 = parseInt(tempMark[2].x), y3 = parseInt(tempMark[2].y);
                if (currY + block_size >= y3 && currY - block_size <= y3 && currX + block_size >= x3 && currX - block_size <= x3) {
                    Angle_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 2 };
                }

                if (tempMark.length < 4) return;
                var x4 = parseInt(tempMark[3].x), y4 = parseInt(tempMark[3].y);
                if (currY + block_size >= y4 && currY - block_size <= y4 && currX + block_size >= x4 && currX - block_size <= x4) {
                    Angle_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 3 };
                }
                /*if (currY + block_size >= y1 && currX + block_size >= x1 / 2 + x2 / 2 && currY < y1 + block_size && currX < x1 / 2 + x2 / 2 + block_size) {

                }*/
            }
        }
    }
}

function drawAngleRuler(obj) {
    try {

        var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
        if (!Mark) return;
        if (Mark.type != "AngleRuler") return;
        var ctx = canvas.getContext("2d"), length = Mark.pointArray.length;

        viewport.drawLine(ctx, viewport, Mark.pointArray[0], Mark.pointArray[1], "#00FF00", 1.0);
        if (length > 2) viewport.drawLine(ctx, viewport, Mark.pointArray[1], Mark.pointArray[2], "#00FF00", 1.0);

        if (length > 0) viewport.fillCircle(ctx, viewport, Mark.pointArray[0], 3, "#FF0000", 1.0);
        if (length > 1) viewport.fillCircle(ctx, viewport, Mark.pointArray[1], 3, "#FF0000", 1.0);

        if (length > 2) viewport.fillCircle(ctx, viewport, Mark.pointArray[1], 3, "#FF0000", 1.0);
        if (length > 2) viewport.fillCircle(ctx, viewport, Mark.pointArray[2], 3, "#FF0000", 1.0);

        if (Mark.Text) viewport.drawText(ctx, viewport, Mark.lastMark, Mark.Text, 22, "#FF0000", alpha = 1.0);

    } catch (ex) { }
}
PLUGIN.PushMarkList(drawAngleRuler);

function getIntersectionPoint(x1, y1, x2, y2, x3, y3, x4, y4) {
    // 計算兩條線的斜率
    const m1 = (y2 - y1) / (x2 - x1);
    const m2 = (y4 - y3) / (x4 - x3);
    // 計算兩條線的截距
    const b1 = y1 - m1 * x1;
    const b2 = y3 - m2 * x3;
    // 計算交點的 X 座標
    const x = (b2 - b1) / (m1 - m2);
    // 計算交點的 Y 座標
    const y = m1 * x + b1;
    return new Point2D(x, y);
}

function drawAngleRuler2(obj) {
    try {
        var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
        if (!Mark) return;
        if (Mark.type != "AngleRuler2") return;


        var ctx = canvas.getContext("2d"), length = Mark.pointArray.length;

        viewport.drawLine(ctx, viewport, Mark.pointArray[0], Mark.pointArray[1], "#0000FF", 1.0);

        if (length > 3) {
            viewport.drawLine(ctx, viewport, Mark.pointArray[2], Mark.pointArray[3], "#0000FF", 1.0);

            var pointArray = Mark.pointArray;
            const intersectionPoint = getIntersectionPoint(pointArray[0].x, pointArray[0].y, pointArray[1].x, pointArray[1].y,
                pointArray[2].x, pointArray[2].y, pointArray[3].x, pointArray[3].y);

            if (isNaN(intersectionPoint[0]) || isNaN(intersectionPoint[1]) || intersectionPoint[0] > GetViewport().width * 10 || intersectionPoint[1] > GetViewport().height * 10) {

                if (Mark.Text && parseInt(Mark.Text) > 90 && parseInt(Mark.Text) < 270) {
                    viewport.drawLine(ctx, viewport, Mark.pointArray[1], Mark.pointArray[2], "#FF2222", 1.0, [10, 10]);
                } else if (Mark.Text) {
                    viewport.drawLine(ctx, viewport, Mark.pointArray[0], Mark.pointArray[2], "#FF2222", 1.0, [10, 10]);
                } else {
                    viewport.drawLine(ctx, viewport, Mark.pointArray[0], Mark.pointArray[2], "#FF2222", 1.0, [10, 10]);
                }
            } else {
                var x = intersectionPoint[0], y = intersectionPoint[1];
                var x1 = Mark.pointArray[0].x, y1 = Mark.pointArray[0].y;
                var x2 = Mark.pointArray[1].x, y2 = Mark.pointArray[1].y;
                var dist1 = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
                var dist2 = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
                if (dist1 < dist2) {
                    viewport.drawLine(ctx, viewport, Mark.pointArray[0], intersectionPoint, "#FFFFFF", 1.0, [10, 10]);
                } else {
                    viewport.drawLine(ctx, viewport, Mark.pointArray[1], intersectionPoint, "#FFFFFF", 1.0, [10, 10]);
                }

                var x = intersectionPoint[0], y = intersectionPoint[1];
                var x1 = Mark.pointArray[2].x, y1 = Mark.pointArray[2].y;
                var x2 = Mark.pointArray[3].x, y2 = Mark.pointArray[3].y;
                var dist1 = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
                var dist2 = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
                if (dist1 < dist2) {
                    viewport.drawLine(ctx, viewport, Mark.pointArray[2], intersectionPoint, "#FFFFFF", 1.0, [10, 10]);
                } else {
                    viewport.drawLine(ctx, viewport, Mark.pointArray[3], intersectionPoint, "#FFFFFF", 1.0, [10, 10]);
                }
                viewport.fillCircle(ctx, viewport, intersectionPoint, 5, "#FFFFFF", 1.0);
            }
        }


        if (length > 0) viewport.fillCircle(ctx, viewport, Mark.pointArray[0], 3, "#FF0000", 1.0);
        if (length > 1) viewport.fillCircle(ctx, viewport, Mark.pointArray[1], 3, "#FF0000", 1.0);
        if (length > 2) viewport.fillCircle(ctx, viewport, Mark.pointArray[2], 3, "#FF0000", 1.0);
        if (length > 3) viewport.fillCircle(ctx, viewport, Mark.pointArray[3], 3, "#FF0000", 1.0);
        if (length > 2) {
            viewport.fillCircle(ctx, viewport, Mark.pointArray[1], 3, "#FF0000", 1.0);
            viewport.fillCircle(ctx, viewport, Mark.pointArray[2], 3, "#FF0000", 1.0);
        }

        if (Mark.Text) viewport.drawText(ctx, viewport, Mark.lastMark, Mark.Text, 22, "#FF0000", alpha = 1.0);
    } catch (ex) { }
}
PLUGIN.PushMarkList(drawAngleRuler2);

function getAnglelValueBy2Point(pointArray) {
    //if (!angle.angle_) return;
    var getAngle = ({
        x: x1, y: y1
    }, {
        x: x2, y: y2
    }) => {
        const dot = x1 * x2 + y1 * y2
        const det = x1 * y2 - y1 * x2
        const angle = Math.atan2(det, dot) / Math.PI * 180
        return (angle + 360) % 360
    }
    if (BL_mode == 'angle') {
        var angle1 = getAngle({
            x: pointArray[1].x - pointArray[2].x,
            y: pointArray[1].y - pointArray[2].y,
        }, {
            x: pointArray[1].x - pointArray[0].x,
            y: pointArray[1].y - pointArray[0].y,
        });
    } else if (BL_mode == 'angle2') {
        const intersectionPoint = getIntersectionPoint(pointArray[0].x, pointArray[0].y, pointArray[1].x, pointArray[1].y,
            pointArray[2].x, pointArray[2].y, pointArray[3].x, pointArray[3].y);
        var x = intersectionPoint[0], y = intersectionPoint[1];
        var x1 = pointArray[0].x, y1 = pointArray[0].y;
        var x2 = pointArray[1].x, y2 = pointArray[1].y;
        var dist1 = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
        var dist2 = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
        var p1, p2;
        if (dist1 < dist2) {
            p1 = [pointArray[0].x, pointArray[0].y];
        } else {
            p1 = [pointArray[1].x, pointArray[1].y];
        }

        var x = intersectionPoint[0], y = intersectionPoint[1];
        var x1 = pointArray[2].x, y1 = pointArray[2].y;
        var x2 = pointArray[3].x, y2 = pointArray[3].y;
        var dist1 = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
        var dist2 = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));
        if (dist1 < dist2) {
            p2 = [pointArray[2].x, pointArray[2].y];
        } else {
            p2 = [pointArray[3].x, pointArray[3].y];
        }
        var angle1 = getAngle({
            x: intersectionPoint[0] - p2[0],
            y: intersectionPoint[1] - p2[1],
        }, {
            x: intersectionPoint[0] - p1[0],
            y: intersectionPoint[1] - p1[1],
        });
    }

    if (angle1 > 180) angle1 = 360 - angle1;
    return parseInt(angle1) + "°";
}

window.addEventListener('keydown', (KeyboardKeys) => {
    var key = KeyboardKeys.which

    if ((BL_mode == 'angle' || BL_mode == 'angle2') && Angle_previous_choose && (key === 46 || key === 110)) {
        PatientMark.splice(PatientMark.indexOf(Angle_previous_choose.dcm), 1);
        displayMark();
        Angle_previous_choose = null;
        refreshMarkFromSop(GetViewport().sop);
    }
    Angle_previous_choose = null;
});

function getAnglelValue(e) {
    if (!angle.angle_) return;
    var getAngle = ({
        x: x1, y: y1
    }, {
        x: x2, y: y2
    }) => {
        const dot = x1 * x2 + y1 * y2
        const det = x1 * y2 - y1 * x2
        const angle = Math.atan2(det, dot) / Math.PI * 180
        return (angle + 360) % 360
    }
    var angleV = getAngle({
        x: Angle_Point1[0] - Angle_Point2[0],
        y: Angle_Point1[1] - Angle_Point2[1],
    }, {
        x: Angle_Point1[0] - Angle_Point0[0],
        y: Angle_Point1[1] - Angle_Point0[1],
    });
    if (angleV > 180) angleV = 360 - angleV;
    return parseInt(angleV) + "°";
}

onloadFunction.push2Last(function () {
    getByid("AngleRuler").onclick = function () {
        if (this.enable == false) return;
        //cancelTools();
        set_BL_model('angle');
        angle();
        drawBorder(getByid("openMeasureImg"));
        hideAllDrawer();
    }

    getByid("AngleRuler2").onclick = function () {
        if (this.enable == false) return;
        //cancelTools();
        set_BL_model('angle2');
        angle();
        drawBorder(getByid("openMeasureImg"));
        hideAllDrawer();
    }
});
