
var openCalibration = false;
var Calibration_previous_choose = null;
//紀錄測量工具座標
var Calibration_Point1 = [0, 0];
var Calibration_Point2 = [0, 0];

function loadCalibration() {
    var span = document.createElement("SPAN")
    span.innerHTML =
        ` <img class="img Calibration" alt="Calibration" id="Calibration" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/b_DistanceMeasurement.png" width="50" height="50">`;
    addIconSpan(span); 

    var span = document.createElement("SPAN")
    span.innerHTML =
        `<div id="CalibrationDiv" style="background-color:#30306044;">
                <font color="white">Calibration (mm):</font>
                <input type="text" id="CalibrationValue" value="null" size="8" />
                <button id="CalibrationButton">assign</button>
        </div>`
    getByid("page-header").appendChild(span);
    getByid("CalibrationDiv").style.display = "none";
}

loadCalibration();

getByid("CalibrationButton").onclick = function () {
    if (Calibration_previous_choose && !isNaN(Calibration_previous_choose.value) && !isNaN(CalibrationValue.value)) {
        GetViewport().transform.PixelSpacingX = Calibration_previous_choose.value / CalibrationValue.value;
        GetViewport().transform.PixelSpacingY = Calibration_previous_choose.value / CalibrationValue.value;

        for (var mark of PatientMark) {
            if (mark.type == 'CalibrationRuler') {
                mark.Text = parseInt(Math.sqrt(
                    Math.pow(mark.Calibration_Point2[0] / GetViewport().transform.PixelSpacingX - mark.Calibration_Point1[0] / GetViewport().transform.PixelSpacingX, 2) +
                    Math.pow(mark.Calibration_Point2[1] / GetViewport().transform.PixelSpacingY - mark.Calibration_Point1[1] / GetViewport().transform.PixelSpacingY, 2), 2)) +
                    "mm";
            }
        }
        displayAllRuler();
        displayAllMark();
    }
}

getByid("Calibration").onclick = function () {
    /*if (!GetViewport() || GetViewport().tags.PixelSpacing){
        alert("For use only in cases where pixel spacing is not available.");
        return;
    }*/
    openCalibration = !openCalibration;
    img2darkByClass("Calibration", !openCalibration);
    getByid("CalibrationValue").style.display = "none";
    getByid("CalibrationButton").style.display = "none";
    getByid("CalibrationValue").value = "null";
    removeCalibrationMark();
    if (!openCalibration) {
        openLeftImgClick = true;
        getByid("CalibrationDiv").style.display = "none";
        exit_calibration();
    } else {
        openLeftImgClick = false;
        getByid("CalibrationDiv").style.display = "";
        set_BL_model('Calibration');
        write_calibration();
    }
    SetTable();
}

BorderList_Icon.push("Calibration");

function exit_calibration() {
    img2darkByClass("Calibration", !openCalibration);
    displayMark();
    getByid('MouseOperation').click();
}

function removeCalibrationMark() {
    for (var mark of PatientMark) {
        if (mark.type == 'CalibrationRuler') {
            PatientMark.splice(PatientMark.indexOf(mark), 1);
        }
    }
    refreshMarkFromSop(GetViewport().sop);
}

function write_calibration() {
    if (BL_mode == 'Calibration') {
        DeleteMouseEvent();
        cancelTools();
        openCalibration = true;
        set_BL_model.onchange = function () {
            displayMark();
            openCalibration = false;
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            Calibration_previous_choose = null;
            if (!MouseDownCheck) return;
            removeCalibrationMark();

            var MeasureMark = new BlueLightMark();

            MeasureMark.setQRLevels(GetViewport().QRLevels);
            MeasureMark.color = "#FF0000";
            MeasureMark.hideName = MeasureMark.showName = "ruler";
            MeasureMark.type = "CalibrationRuler";

            Calibration_previous_choose = MeasureMark;
            PatientMark.push(MeasureMark);
            getByid("CalibrationValue").style.display = "none";
            getByid("CalibrationButton").style.display = "none";
            getByid("CalibrationValue").value = "null";

            Calibration_Point1 = Calibration_Point2 = rotateCalculation(e, true);
            displayAllMark();
        });

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
            let angle2point = rotateCalculation(e, true);
            if (MouseDownCheck) {
                Calibration_Point2 = angle2point;
                if (Calibration_previous_choose) {
                    var MeasureMark = Calibration_previous_choose;

                    MeasureMark.pointArray = [];
                    MeasureMark.setPoint2D(Calibration_Point1[0], Calibration_Point1[1]);
                    MeasureMark.setPoint2D(Calibration_Point2[0], Calibration_Point2[1]);

                    MeasureMark.Text = getCalibrationValue(e);
                    refreshMark(MeasureMark);
                    displayAllMark();
                }
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            let angle2point = rotateCalculation(e, true);
            Calibration_Point2 = angle2point;

            if (Calibration_previous_choose) {
                var MeasureMark = Calibration_previous_choose;

                MeasureMark.pointArray = [];
                MeasureMark.setPoint2D(Calibration_Point1[0], Calibration_Point1[1]);
                MeasureMark.setPoint2D(Calibration_Point2[0], Calibration_Point2[1]);

                MeasureMark.Text = getCalibrationValue(e);
                MeasureMark.Calibration_Point2 = Calibration_Point2;
                MeasureMark.Calibration_Point1 = Calibration_Point1;
                MeasureMark.value = parseInt(Math.sqrt(
                    Math.pow(Calibration_Point2[0] - Calibration_Point1[0], 2) +
                    Math.pow(Calibration_Point2[1] - Calibration_Point1[1], 2), 2));

                refreshMark(MeasureMark);
                getByid("CalibrationValue").style.display = "";
                getByid("CalibrationButton").style.display = "";
            }

            displayAllMark();

            if (openMouseTool == true && rightMouseDown == true) displayMark();

            if (openLink) displayAllRuler();
        });

        AddMouseEvent();
    }
}

function getCalibrationValue(e) {
    if (GetViewport().transform.PixelSpacingX && GetViewport().transform.PixelSpacingY) {
        var value = parseInt(Math.sqrt(
            Math.pow(Calibration_Point2[0] / GetViewport().transform.PixelSpacingX - Calibration_Point1[0] / GetViewport().transform.PixelSpacingX, 2) +
            Math.pow(Calibration_Point2[1] / GetViewport().transform.PixelSpacingY - Calibration_Point1[1] / GetViewport().transform.PixelSpacingY, 2), 2)) +
            "mm";
        return value;
    } else {
        var value = parseInt(Math.sqrt(
            Math.pow(Calibration_Point2[0] - Calibration_Point1[0], 2) +
            Math.pow(Calibration_Point2[1] - Calibration_Point1[1], 2), 2)) +
            "px";
        return value;
    }
}

function drawCalibrationRuler(obj) {
    try {
        var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
        if (!Mark) return;
        if (viewport != GetViewport()) return;
        if (!Mark || Mark.type != "CalibrationRuler" || Mark.pointArray.length < 2) return;
        var ctx = canvas.getContext("2d");

        var x1 = Mark.pointArray[0].x * 1, y1 = Mark.pointArray[0].y * 1;
        var x2 = Mark.pointArray[1].x * 1, y2 = Mark.pointArray[1].y * 1;
        if (Mark.RotationAngle && Mark.RotationPoint) {
            [x1, y1] = rotatePoint([x1, y1], Mark.RotationAngle, Mark.RotationPoint);
            [x2, y2] = rotatePoint([x2, y2], Mark.RotationAngle, Mark.RotationPoint);
        }
        viewport.drawLine(ctx, viewport, new Point2D(x1, y1), new Point2D(x2, y2), Mark.color, 1.0);

        viewport.fillCircle(ctx, viewport, Mark.pointArray[0], 3, "#00FF00", 1.0);
        viewport.fillCircle(ctx, viewport, Mark.lastMark, 3, "#00FF00", 1.0);

        if (Mark.Text) viewport.drawText(ctx, viewport, Mark.lastMark, Mark.Text, 22, "#FF0000", alpha = 1.0);

    } catch (ex) { console.log(ex) }
}
PLUGIN.PushMarkList(drawCalibrationRuler);