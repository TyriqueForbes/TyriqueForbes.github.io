const track = document.getElementById("image-track");

const container = document.getElementById("enlargedImageContainer");
const numEntries = 6.0;

let firstEntry = false;

let backimg = null;

function expandImage(image)
{
    if(image.dataset.expanded === "true")
    {
        console.log("not expanded")
        resetImage(image)
        return;
    }
    resetBackImage(image);
    var img = document.createElement("img");
    //var title = document.createElement("h1");
    //title.textContent = "title";
    img.src = image.src;
    img.id = image.id;
    img.draggable = false;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.objectFit = "cover";
    img.style.userSelect = "none";
    const infoPage = ""+image.dataset.linkedto+"";
    backimg = img;
    backimg.addEventListener('click', () => {loadInfoPage(infoPage)});
    //track.insertAdjacentElement("afterend", backimg);
    container.appendChild(backimg);
    console.log("expanded")
    //track.style.transform = "scale(1.5)";
    image.style.width = "100vh";
    image.style.height = "100vh";
    image.style.transition = "width 0.5s ease";
    image.style.transition = "height 0.5s ease";
    image.dataset.expanded = "true";
    track.style.scale = "20%";
    track.style.top = "50%";
    track.style.left = "0%";
    track.style.transition = "scale 0.25s ease";
    track.style.transition = "top 0.25s ease";
    track.style.transition = "left 0.25s ease";
    track.dataset.prevPercentage = 0;
    const percentage = (parseFloat(img.id) / numEntries) * -100,
    nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, {duration: 1200, fill: "forwards"});
    for (const element of track.children) {
        if(element.id != img.id) resetImage(element);
        element.animate({
            objectPosition: `${nextPercentage + 100}% 50%`
        }, {duration: 1200, fill: "forwards"});
    }
    firstEntry = true;
}
function resetImage(image)
{
    if(image === null)return;
    image.style.width = "40vmin";
    image.style.height = "30vmax";
    image.style.objectFit = "cover";
    image.style.objectPosition = "100% 50%";
    image.dataset.expanded = "false";
}

function resetTrack()
{
    track.style.scale = "100%";
    track.style.top = "50%";
    track.style.left = "50%";
    track.style.transform = "translate(0%, -50%)";
    track.style.transition = "scale 0.25s ease";
    track.style.transition = "top 0.25s ease";
    track.style.transition = "left 0.25s ease";
}

function resetBackImage(image)
{
    if(backimg === null)return;
    container.removeChild(backimg);
    backimg = null;
}

const handleOnDown = e => {
    track.dataset.mouseDownAt = e.clientX;
}

const handleOnUp = () => {
    console.log("mouseup");
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
}

const handleOnMove = e => {
    console.log(track.dataset.mouseDownAt);
    if(track.dataset.mouseDownAt === "0") return;
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
    track.dataset.percentage = nextPercentage;
    console.log(percentage);
    console.log(track.dataset.prevPercentage);
    console.log(nextPercentageUnconstrained);
    console.log(nextPercentage);
    resetTrack();
    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, {duration: 1200, fill: "forwards"});
    for (const element of track.children) {
        resetImage(element);
        resetBackImage(element);
        element.animate({
            objectPosition: `${nextPercentage + 100}% 50%`
        }, {duration: 1200, fill: "forwards"});
    }
    firstEntry = true;
}

function loadInfoPage(url){
    window.location.href = url;
}

window.onmousedown = e => handleOnDown(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = e => handleOnUp(e);

window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);

