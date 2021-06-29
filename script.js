let video = document.querySelector("video");
let recBtn = document.querySelector("#record");
let capBtn = document.querySelector("#capture");
let recDiv = recBtn.querySelector("div");
let capDiv = capBtn.querySelector("div");
let body = document.querySelector("body");
let zoomIn = document.querySelector(".zoom-in");
let zoomOut = document.querySelector(".zoom-out");
let galleryBtn = document.querySelector("#gallery");
let mediaRecorder;
let chunks = [];
let appliedFilter;
let isRecording = false;
let minZoom = 1;
let maxZoom = 3;
let currZoom = 1;

galleryBtn.addEventListener("click", function () {
    location.assign("gallery.html");
})

zoomIn.addEventListener("click", function (e) {
    if (currZoom < maxZoom)
        currZoom += 0.1;
    video.style.transform = `scale(${currZoom})`;
});

zoomOut.addEventListener("click", function (e) {
    if (currZoom > minZoom)
        currZoom -= 0.1;
    video.style.transform = `scale(${currZoom})`;
});
let filters = document.querySelectorAll(".filter");
for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", function (e) {
        removeFilter();
        appliedFilter = e.currentTarget.style.backgroundColor;
        let div = document.createElement("div");
        div.style.backgroundColor = appliedFilter;
        div.classList.add("filter-div");
        body.append(div);
    });
}
recBtn.addEventListener("click", function (e) {
    if (isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        // e.currentTarget.innerText="Start";
        recDiv.classList.remove("record-animation");

    } else {
        mediaRecorder.start();
        isRecording = true;
        appliedFilter = "";
        removeFilter();
        // e.currentTarget.innerText="Recording";
        recDiv.classList.add("record-animation");
    }
});

capBtn.addEventListener("click", function () {
    if (isRecording) return;
    capDiv.classList.add("capture-animation");
    setTimeout(function () {
        capDiv.classList.remove("capture-animation");
    }, 1000)
    let canvas = document.createElement("canvas");
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    let tool = canvas.getContext("2d");
    tool.translate(canvas.width / 2, canvas.height / 2);
    tool.scale(currZoom, currZoom);
    tool.translate(-canvas.width / 2, -canvas.height / 2);
    tool.drawImage(video, 0, 0);
    if (appliedFilter) {
        tool.fillStyle = appliedFilter;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }

    let link = canvas.toDataURL();
    addMedia(link, "image");
    // let a= document.createElement("a");
    // a.href=link;
    // a.download="img.png";
    // a.click();
    // a.remove();
    // canvas.remove();
});
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (mediaStream) {
    //    let options= {mimeType: "video/webm"};
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.addEventListener("dataavailable", function (e) {
        chunks.push(e.data);
    });
    mediaRecorder.addEventListener("stop", function (e) {
        let blob = new Blob(chunks, { type: "video/mp4" });
        chunks = [];
        addMedia(blob, "video");
        // let a= document.createElement("a");
        // let url= window.URL.createObjectURL(blob);
        // a.href=url;
        // a.download="video.mp4";
        // a.click();
        // a.remove();
    });
    video.srcObject = mediaStream;
}).catch(function (err) {
    console.log(err);
});

function removeFilter() {
    let Filter = document.querySelector(".filter-div");
    if (Filter) Filter.remove();
}