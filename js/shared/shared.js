var text = document.getElementById("brif");
let lenght;
function size() {
    lenght = text.value.length;
    if (lenght == 500) {
        document.getElementById("brifnum").style.color = "var(--E)";
        document.getElementById("brifnum").innerHTML = lenght + " /500";
    }
    else if (lenght >= 490 && lenght < 500) {
        document.getElementById("brifnum").style.color = "var(--invert)";
        document.getElementById("brifnum").innerHTML = lenght + " /500";
    }
    else {
        document.getElementById("brifnum").style.color = "var(--thirdtxt)";
        document.getElementById("brifnum").innerHTML = lenght + " /500";
    }

}



//--------------------------------
var dark = [{
    name: "--style",
    dark: "#3366FF",
    light: "#3366FF",
},
{
    name: "--style-d",
    dark: "#203864",
    light: "#203864",
},
{
    name: "--invert",
    dark: "#FFC000",
    light: "#FFC000"
},
{
    name: "--sitetxt",
    dark: "#ffffff",
    light: "#ffffff",
},
{
    name: "--thirdtxt",
    dark: "#7f7f7f",
    light: "#7F7F7F"
},
{
    name: "--secondtxt",
    dark: "#ffffff",
    light: "#595959",
},
{
    name: "--firsttxt",
    dark: "#ffffff",
    light: "#000000",
},
{
    name: "--bg",
    dark: "#3B3838",
    light: "#ffffff"
},
{
    name: "--bg-m",
    dark: "#262626",
    light: "#FAFAFA"
},
{
    name: "--elementbg",
    dark: "#767171",
    light: "#F2F2F2"
},
{
    name: "--iconbtn-d",
    dark: "#7F7F7F",
    light: "#7F7F7F"
},
{
    name: "--iconbtn-l",
    dark: "#BFBFBF",
    light: "#BFBFBF"
},
{
    name: "--dividor",
    dark: "#767171",
    light: "#D9D9D9"
},
{
    name: "--dividor2",
    dark: "#767171",
    light: "#F2F2F2"
},
{
    name: "--placeholder",
    dark: "#F2F2F2",
    light: "#F2F2F2"
},
{
    name: "--placeholder2",
    dark: "#BFBFBF",
    light: "#BFBFBF"
},
{
    name: "--notifydot",
    dark: "#c00000",
    light: "#c00000"
},
{
    name: "--love",
    dark: "#c00000",
    light: "#c00000"
},
{
    name: "--male",
    dark: "#3366FF",
    light: "#3366FF"
},
{
    name: "--female",
    dark: "#FF00FF",
    light: "#FF00FF"
},
{
    name: "--E",
    dark: "#ff0000",
    light: "#C00000"
},
{
    name: "--conborder",
    dark: "#767171",
    light: "#F2F2F2"
}];


// Get the root element
var r = document.querySelector(':root');

var mood = "light";
function Dark() {
    if (mood == "light") {
        dark.map(function (item) {
            r.style.setProperty(item.name, item.dark);
        })
        mood = "dark";
        console.log("done dark", "mood now is : ", mood);
    }
    else {
        dark.map(function (item) {
            r.style.setProperty(item.name, item.light);

        })
        mood = "light";
        console.log("done light", "mood now is : ", mood);
    }
    
    document.cookie = mood;
}
if (document.cookie.split(";")[0] == "dark") { 
    Dark();
}


//-------------------------------

function showpass(id,btn) { 
    const passinput = document.getElementById(id);
    if (passinput.getAttribute("type") == "password") { 
        btn.innerHTML = "&#xf2a8;";
        passinput.setAttribute("type", "text");
    } else {
        btn.innerHTML = "&#xf06e;";
        passinput.setAttribute("type", "password");
    }
}


