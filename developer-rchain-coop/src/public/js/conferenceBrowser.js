window.onscroll = function () {
    myFunction()
};

function myFunction() {
    if (window.innerWidth > 1500) {
        if (document.body.scrollTop > 700 || document.documentElement.scrollTop > 700) {
            document.getElementById("sideNav").className = "fixed";
        } else {
            document.getElementById("sideNav").className = "absolute";
        }
    } else if (window.innerWidth > 1200) {
        if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
            document.getElementById("sideNav").className = "fixed";
        } else {
            document.getElementById("sideNav").className = "absolute";
        }
    } else if (window.innerWidth > 960) {
        if (document.body.scrollTop > 380 || document.documentElement.scrollTop > 380) {
            document.getElementById("sideNav").className = "fixed";
        } else {
            document.getElementById("sideNav").className = "absolute";
        }
    } else {
        if (document.body.scrollTop > 280 || document.documentElement.scrollTop > 280) {
            document.getElementById("sideNav").className = "fixed";
        } else {
            document.getElementById("sideNav").className = "absolute";
        }
    }
}
