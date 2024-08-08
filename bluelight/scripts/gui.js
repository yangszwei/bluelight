
//表示目前icon圖示的RWD收合功能為開啟狀態
var openRWD = true;
//邊框寬度
var bordersize = 5;

//表示左側的影像可以點擊
var openLeftImgClick = true;

let leftLayout, Pages;
onloadFunction.push2First(
    function () {
        leftLayout = new LeftLayout();
        Pages = new BlueLightPage();
    }
);

onloadFunction.push2Last(
    //載入延遲載入的影像
    function () {
        var imgs = document.querySelectorAll('.img,.innerimg');//className is img or innerimg
        for (img of imgs) {
            if (img.loading && img.loading == "lazy") img.loading = "eager";
        }
    }
);

function HideElemByID(Elem) {
    if (Elem.constructor.name == "Array") {
        for (elem of Elem) getByid(elem).style.display = "none";
    }
    else if (Elem.constructor.name == "String") {
        getByid(Elem).style.display = "none";
    }
}

function ShowElemByID(Elem) {
    if (Elem.constructor.name == "Array") {
        for (elem of Elem) getByid(elem).style.display = "";
    }
    else if (Elem.constructor.name == "String") {
        getByid(Elem).style.display = "";
    }
}

function addIconSpan(span) {
    getByid("icon-list").appendChild(span);
    getByid("container").style.height = `calc(100vh - ${getByid("container").offsetTop}px)`;
}

function invertDisplayById(id) {
    if (!id && !getByid(id)) return;
    if (getByid(id).style.display == "none") getByid(id).style.display = "";
    else getByid(id).style.display = "none";
}

function refleshGUI() {
    var viewport = GetViewport();
    if (!viewport) return;

    //Viewport Border Color
    viewport.div.classList.add("SelectedViewport");
    for (var z = 0; z < Viewport_Total; z++) {
        if (z != viewportNumber) GetViewport(z).div.classList.remove("SelectedViewport");
    }
    if (GetViewport().Sop) leftLayout.setAccent(GetViewport().Sop.parent.SeriesInstanceUID);

    if (viewport.invert) getByid("color_invert").classList.add("activeImg");
    else getByid("color_invert").classList.remove("activeImg");
    if (viewport.HorizontalFlip) getByid("horizontal_flip").classList.add("activeImg");
    else getByid("horizontal_flip").classList.remove("activeImg");
    if (viewport.VerticalFlip) getByid("vertical_flip").classList.add("activeImg");
    else getByid("vertical_flip").classList.remove("activeImg");
    if (viewport.rotate != 0) getByid("MouseRotate").classList.add("activeImg");
    else getByid("MouseRotate").classList.remove("activeImg");
}

class BlueLightPage {
    constructor() {
        this.type = "DicomPage";
        this.pages = getByid("pages");
    }

    displayPage(PageID) {
        if (this.type == PageID || !PageID) return;
        for (var page of getClass("page")) {
            if (page.id == PageID) page.style.display = "";
            else page.style.display = "none";
        }
        this.type = PageID;
    }
}

class LeftLayout {
    constructor() { }

    findPatienID(PatientId) {
        for (var Patient_div of getClass("OutLeftImg")) {
            if (Patient_div.PatientId == PatientId) return Patient_div;
        }
        return null;
    }

    findSeries(series) {
        for (var series_div of getClass("LeftImgAndMark")) {
            if (series_div.series == series) return series_div;
        }
        return null;
    }

    setAccent(series) {
        for (var series_div of getClass("LeftImgAndMark")) {
            series_div.style.border = "5px groove rgb(211, 217, 255)";
        }
        if (!series) return;
        if (getClass("LeftImgAndMark").length <= 1) return;
        for (var series_div of getClass("LeftImgAndMark")) {
            if (series_div.series == series) series_div.style.border = "5px solid rgb(255, 255, 255)";
        }
    }

    getCheckboxBySeriesAndHideName(series, hideName) {
        var MarkDiv = getByid("menu" + series);
        if (!MarkDiv) return;
        var checkboxList = MarkDiv.getElementsByTagName("input");
        for (var checkbox of checkboxList) {
            if (checkbox.name == hideName) return checkbox;
        }
        return null;
    }

    setImg2Left(QRLevel, patientID) {
        var pic = getByid("LeftPicture");
        var Patient_div = document.createElement("DIV");
        Patient_div.className = "OutLeftImg";
        //Patient_div.id = "OutLeftImg" + patientID;
        Patient_div.PatientId = patientID;
        if (!this.findPatienID(patientID)) pic.appendChild(Patient_div);
        else {
            for (elem of getClass("OutLeftImg"))
                if (elem.PatientId == patientID) Patient_div = elem;
        }

        if (this.findSeries(QRLevel.series)) return;
        var series_div = document.createElement("DIV");
        series_div.className = "LeftImgAndMark";
        series_div.style = "width:" + 65 + "px;height:" + 65 + "px;border:" + bordersize + "px #D3D9FF groove;";
        series_div.series = QRLevel.series;
        series_div.style.touchAction = 'none';

        var ImgDiv = document.createElement("DIV");
        ImgDiv.className = "LeftImgDiv";
        ImgDiv.series = QRLevel.series;
        ImgDiv.draggable = "true";
        ImgDiv.QRLevel = QRLevel;
        ImgDiv.onclick = function () {
            PictureOnclick(this.QRLevel);
        };

        ImgDiv.ondrag = function () {
            event.preventDefault();
            dragged = this;
        }

        ImgDiv.canvas = function () {
            if (!this.getElementsByClassName("LeftCanvas")[0]) return null;
            else return this.getElementsByClassName("LeftCanvas")[0];
        }

        series_div.appendChild(ImgDiv);
        series_div.ImgDiv = ImgDiv;
        //series_div.appendChild(smallDiv);
        Patient_div.appendChild(series_div);
        //應該會return一個DIV供Display Canvas
    }

    appendCanvasBySeries(series, image, pixelData) {
        var series_div = this.findSeries(series);
        if (!series_div) return;
        var ImgDiv = series_div.ImgDiv;

        if (ImgDiv.canvas()) {
            return;
            displayLeftCanvas(ImgDiv.canvas(), image, pixelData);
        } else {
            var leftCanvas = document.createElement("CANVAS");
            leftCanvas.className = "LeftCanvas";
            ImgDiv.appendChild(leftCanvas);
            displayLeftCanvas(leftCanvas, image, pixelData);
        }
    }

    refleshMarkWithSeries(series) {
        var series_div = this.findSeries(series);
        if (!series_div) return;
        if (getByid("menu" + series)) {
            getByid("menu" + series).innerHTML = "";
            series_div.style.height = 65 + "px";
        }

        var showNameList = [];
        var colorList = [];
        var hideNameList = [];
        var Series = ImageManager.findSeries(series);
        for (var k = 0; k < Series.Sop.length; k++) {
            for (var n = 0; n < PatientMark.length; n++) {
                if (PatientMark[n].sop == Series.Sop[k].SOPInstanceUID) {
                    if (showNameList.length == 0) {
                        showNameList.push(PatientMark[n].showName);
                        colorList.push(PatientMark[n].color);
                        hideNameList.push(PatientMark[n].hideName);
                    } else {
                        var check = 0;
                        for (var o = 0; o < showNameList.length; o++) {
                            if (hideNameList[o] == PatientMark[n].hideName) {
                                check = 1;
                            }
                        }
                        if (check == 0) {
                            hideNameList.push(PatientMark[n].hideName);
                            showNameList.push(PatientMark[n].showName);
                            colorList.push(PatientMark[n].color);
                        }
                    }
                }
            }
        }

        for (var o = 0; o < showNameList.length; o++) {
            series_div.style.height = parseInt(series_div.style.height) + 35 + "px";
            var label = document.createElement('LABEL');
            label.innerText = "" + showNameList[o];
            label.name = "" + hideNameList[o];
            label.className = "LeftShadowLabel";
            label.style.color = colorList[o];
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";

            checkbox.checked = true;
            checkbox.name = "" + hideNameList[o];

            label.oncontextmenu = function (e) { e.preventDefault(); };
            //設定滑鼠按鍵事件
            label.onmousedown = function (e) {
                if (e.button == 2) jump2Mark(this.name);
            }
            checkbox.onchange = function () {
                for (var i = 0; i < Viewport_Total; i++) displayMark(i)
            };
            label.appendChild(checkbox);

            if (getByid("menu" + series)) {
                getByid("menu" + series).appendChild(label);
                getByid("menu" + series).appendChild(document.createElement("br"));
            } else {
                var smallDiv = document.createElement("DIV");
                smallDiv.id = "menu" + series;
                smallDiv.appendChild(label);
                smallDiv.appendChild(document.createElement("br"));
                series_div.appendChild(smallDiv);
            }
        }
    }

    reflesh() {

    }
}

//此段原有Bug，若沒有載入滿Series，便載入最後一個，現在已修復
function PictureOnclick(QRLevel) {
    if (!openLeftImgClick || !QRLevel) return;
    WindowOpen = false;
    cancelTools();
    resetViewport();
    //drawBorder(getByid("MouseOperation"));

    if (QRLevel.series) GetViewport().loadImgBySop(ImageManager.findSeries(QRLevel.series).Sop[0])
    else if (QRLevel.sop) GetViewport().loadImgBySop(ImageManager.findSop(QRLevel.sop).parent.Sop[0]);
    //if (QRLevel.series) GetViewport().loadFirstImgBySeries(QRLevel.series);
    //else if (QRLevel.sop) GetViewport().loadFirstImgBySop(QRLevel.sop);
}

function displayLeftCanvas(DicomCanvas, image, pixelData) {
    DicomCanvas.width = image.width;
    DicomCanvas.height = image.height
    DicomCanvas.style.width = 66 + "px";
    DicomCanvas.style.height = 66 + "px";
    if (pixelData) renderPixelData2Cnavas(image, pixelData, DicomCanvas);
    else {
        var ctx = DicomCanvas.getContext("2d");
        var imgData = ctx.createImageData(66, 66);
        new Uint32Array(imgData.data.buffer).fill(0xFF000000);
        ctx.putImageData(imgData, 0, 0);
    }
}

//當視窗大小改變
window.onresize = function () {
    if (Pages.type == "DicomPage") {
        //刷新每個Viewport
        for (var i = 0; i < Viewport_Total; i++) {
            try {
                GetViewport(i).scale = null;
                GetViewport(i).loadImgBySop(GetViewport(i).Sop);
            } catch (ex) { console.log(ex) }
        }

        //關閉抽屜
        for (var obj of getClass("drawer")) obj.style.display = "none";

        EnterRWD();
        for (var i = 0; i < Viewport_Total; i++) {
            try { setTransform(i); }
            catch (ex) { console.log(ex) }
        }
    } else {
        getByid("container").style.height = `calc(100vh - ${getByid("container").offsetTop}px)`;
    }
}

//執行icon圖示的摺疊效果
function EnterRWD() {
    //刷新Viewport窗格
    SetTable();
    //刷新ScrollBar的Style
    //for (var slider of getClass("rightSlider")) slider.setStyle();
    if (GetViewport(0)) for (var i = 0; i < Viewport_Total; i++) GetViewport(i).ScrollBar.reflesh();
}

function SetTable(row0, col0) {
    getByid("container").style.height = `calc(100vh - ${getByid("container").offsetTop}px)`;

    //取得Viewport的row與col數量
    let row = Viewport_row,
        col = Viewport_col;
    //如果有傳入row與col的參數，則優先使用傳入的
    if (row0 && col0) {
        row = row0;
        col = col0
    }

    if (VIEWPORT.fixRow) row = VIEWPORT.fixRow;
    if (VIEWPORT.fixCol) col = VIEWPORT.fixCol;

    //重置各個Viewport的長寬大小(有顯示時)
    try {
        for (var r = 0; r < row; r++) {
            for (var c = 0; c < col; c++) {
                GetViewport(r * col + c).div.style.width = `calc(${100 / col}% - ${bordersize * 2}px)`;
                GetViewport(r * col + c).div.style.height = `calc(${100 / row}% - ${bordersize * 2}px)`;
            }
        }
    } catch (ex) { }
    //重置各個Viewport的長寬大小(不顯示時)

    for (var i = 0; i < row * col; i++) {
        GetViewport(i).div.style.display = "";
        GetViewport(i).enable = true;
    }
    for (var i = row * col; i < Viewport_Total; i++) {
        GetViewport(i).div.style.display = "none";
        GetViewport(i).enable = false;
    }
    
    //if (viewportNumber >= row * col) viewportNumber = 0;

    refleshGUI();
    // window.onresize();
}