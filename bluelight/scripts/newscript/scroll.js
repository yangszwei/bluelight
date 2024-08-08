//表示現在為開放用拖曳切換影像
var openChangeFile = false;

function scroll() {
    if (BL_mode == 'scroll') {
        DeleteMouseEvent();

        openChangeFile = true;
        set_BL_model.onchange = function () {
            openChangeFile = false;
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            switch (e.which) {
                case 1: MouseDownCheck = true; break;
                case 2: break;
                case 3: rightMouseDown = true; break;
                default: break;
            }
        });

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
            if (MouseDownCheck) {
                var nextBool = null;
                if (Math.abs(windowMouseDiffY) < Math.abs(windowMouseDiffX)) {
                    if (windowMouseDiffX < - 3) nextBool = true;
                    else if (windowMouseDiffX > 3) nextBool = false;
                } else {
                    if (windowMouseDiffY < - 3) nextBool = true;
                    else if (windowMouseDiffY > 3) nextBool = false;
                }

                if (nextBool != null && openLink == false) GetViewport().nextFrame(nextBool);
                else if (nextBool != null && openLink == true) {
                    for (var z = 0; z < Viewport_Total; z++)
                        GetViewport(z).nextFrame(nextBool);
                }
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            if (openMouseTool && rightMouseDown) displayMark();
            if (openLink) displayAllRuler();
        });

        BlueLightTouchstartList = [];

        BlueLightTouchmoveList = [];
        BlueLightTouchmoveList.push(function (e, e2) {
            if ((getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;

            if (TouchDownCheck == true && rightTouchDown == false) {
                if (Math.abs(windowMouseDiffY) < Math.abs(windowMouseDiffX)) {
                    if (windowMouseDiffX < - 3) GetViewport().nextFrame(true);
                    else if (windowMouseDiffX > 3) GetViewport().nextFrame(false);
                } else {
                    if (windowMouseDiffY < - 3) GetViewport().nextFrame(true);
                    else if (windowMouseDiffY > 3) GetViewport().nextFrame(false);
                }
            }
        });

        AddMouseEvent();
    }
};


class ScrollBar {
    constructor(viewport) {
        this.viewport = viewport;
        this.total = 0;
        this.index = 0;
        this.width = 15;
        this.outerDIV = document.createElement("DIV");
        this.innerDIV = document.createElement("DIV");

        this.outerDIV.style.backgroundColor = "rgb(241,241,241)";
        this.innerDIV.style.backgroundColor = "rgb(193,193,193)";

        this.outerDIV.style.position = "absolute";
        this.innerDIV.style.position = "absolute";

        this.outerDIV.style.top = "0px";
        this.innerDIV.style.top = "0px";

        this.outerDIV.style.right = "0px";
        this.innerDIV.style.right = "0px";

        this.outerDIV.style.zIndex = "9";
        this.innerDIV.style.zIndex = "10";

        this.outerDIV.appendChild(this.innerDIV);
        this.viewport.appendChild(this.outerDIV);
        this.reflesh();
    }
    setTotal(num) {
        this.total = num;
    }
    setIndex(num) {
        this.index = num;
    }
    reflesh() {
        this.outerDIV.style.width = this.width + "px";
        this.innerDIV.style.width = this.width + "px";

        this.outerDIV.style.height = "100%";//this.viewport.clientHeight + "px";
        if (this.total <= 1) this.innerDIV.style.height = "0%";//this.viewport.clientHeight + "px";
        else {
            this.innerDIV.style.height = this.total >= 100 ? "1%" : parseInt(100 / this.total) + "%";
            this.innerDIV.style.top = ((((this.index) / this.total) * 100)) + "%";
        }
        //避免擋到Label
        if (rightLabelPadding < this.width) rightLabelPadding = this.width + 2;
    }
}
onloadFunction.push(
    function () {
        getByid("b_Scroll").onclick = function () {
            if (this.enable == false) return;
            //BL_mode = 'scroll';
            hideAllDrawer();
            set_BL_model('scroll');
            scroll();
            drawBorder(this);
        }
    });
