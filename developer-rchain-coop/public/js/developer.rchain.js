/* Top Nav [start] */
window.addEventListener("resize", navCheck);

function navCheck() {
    if (window.innerWidth > 767) {
        navOpen();
        expand();
    } else {
        navClose();
        //collapse();
    }
}

function navClose() {
    document.getElementById("nav").style.right = '100vw';
    document.getElementById("navOpen").style.display = 'block';
}

function navOpen() {
    document.getElementById("nav").style.right = '0';
    document.getElementById("navOpen").style.display = 'none';
}
/* Top Nav [end] */


/* Collapsing sections [START] */
if (window.innerWidth < 767) {
    collapse();
} else {
    expand();
}

function collapse() {
    var expandable = document.getElementsByClassName("expandable");
    var expandIcons = document.getElementsByClassName("expandIcon");
    var collapseIcons = document.getElementsByClassName("collapseIcon");
    var i;
    for (i = 0; i < expandable.length; i++) {
        expandable[i].style.maxHeight = 0;
        var header = expandable[i].previousElementSibling;
        header.classList.add("expander");
        expandIcons[i].style.display = "inline";
        header.addEventListener("click", this.clickHandler);
    }
}

function expand() {
    var expandable = document.getElementsByClassName("expandable");
    var expandIcons = document.getElementsByClassName("expandIcon");
    var i;
    var collapseIcons = document.getElementsByClassName("collapseIcon");
    for (i = 0; i < expandable.length; i++) {
        expandable[i].style.maxHeight = "initial";
        var header = expandable[i].previousElementSibling;
        header.classList.remove("expander");
        expandIcons[i].style.display = "none";
        collapseIcons[i].style.display = "none";
        header.removeEventListener("click", this.clickHandler);
    }
}

function clickHandler() {
    var expandable = this.nextElementSibling;
    var icons = this.childNodes;
    console.log(icons);
    if (expandable.style.maxHeight == "0px") {
        icons[1].style.display = "none";
        icons[2].style.display = "inline";
        expandable.style.maxHeight = (expandable.scrollHeight + 7) + "px";
    } else {
        icons[1].style.display = "inline";
        icons[2].style.display = "none";
        expandable.style.maxHeight = 0;
    }
}
/* Collapsing sections [END] */


function modalClose() {
    document.getElementById("frame1").style.display = 'block';
    document.getElementById("frame2").style.display = 'none';
    document.getElementById("modal").style.visibility = 'hidden';
    document.getElementById("ethForm").reset();
    $("#generalAdmissionCount2").html("");
    $("#generalAdmissionCost2").html("");
    $("#studentCount2").html("");
    $("#studentCost2").html("");
}

function modalOpen() {
    document.getElementById("frame2").style.display = 'none';
    document.getElementById("frame1").style.display = 'block';
    document.getElementById("modal").style.visibility = 'visible';
}

function frame2() {
    //document.getElementById("frame3").style.display = 'none';
    document.getElementById("frame1").style.display = 'none';
    document.getElementById("frame2").style.display = 'block';
    document.getElementById("ethForm").reset();
    displayTickets();
    document.getElementById("ethButton2").setAttribute("disabled", "disabled");
    document.getElementById("ethButton2").classList.add("disabled");
}

function frame3() {
    document.getElementById("frame2").style.display = 'none';
    document.getElementById("frame3").style.display = 'block';
    document.getElementById("frame3").style.width = '350px';
    document.getElementById("lightBox").style.width = 'auto';
    displayTicketsFrame2();
}

function displayTicketsFrame2() {
    //event.preventDefault();
    var generalAdmission = Number(document.getElementById("generalAdmission").value);
    var generalAdmissionTotal = generalAdmission * .75;
    var student = Number(document.getElementById("student").value);
    var studentTotal = student * .06;
    var email = document.getElementById("email").value;
    if (generalAdmission) {
        $("#generalAdmissionCount2").html(generalAdmission);
        $("#generalAdmissionCost2").html(generalAdmissionTotal + "ETH");
        document.getElementById("generalAdmissionLine").style.display = "block";
    }
    if (student) {
        $("#studentCount2").html(student);
        $("#studentCost2").html(studentTotal + "ETH");
        document.getElementById("studentLine").style.display = "block";
    }
    $("#totalCost2").html((earlyBirdTotal + generalAdmissionTotal + studentTotal) + "ETH");
    $("#emailLine").html(email);
}

function displayTickets() {
    //event.preventDefault();
    var generalAdmission = Number(document.getElementById("generalAdmission").value);
    var generalAdmissionTotal = generalAdmission * .75;
    var student = Number(document.getElementById("student").value);
    var studentTotal = student * .06;
    var email = validateEmail(document.getElementById("email").value);
    $("#generalAdmissionCount").html(generalAdmission);
    $("#generalAdmissionCost").html(generalAdmissionTotal + "&nbsp; ETH");
    $("#studentCount").html(student);
    $("#studentCost").html(studentTotal + "&nbsp; ETH");
    $("#totalCost").html((generalAdmissionTotal + studentTotal) + "&nbsp; ETH");
    if ((generalAdmission == 0 && student == 0) || (email == 0)) {
        document.getElementById("ethButton2").setAttribute("disabled", "disabled");
        document.getElementById("ethButton2").classList.add("disabled");
    } else {
        document.getElementById("ethButton2").removeAttribute("disabled");
        document.getElementById("ethButton2").classList.remove("disabled");
    }
}

function validateEmail(email){
    var emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return emailReg.test(email);
}


/* Side Nav Table of Contents scrolling [start] */
$(".scrollFooter").click(function () {
    $('html, body').animate({
        scrollTop: ($('#footer').offset().top - 100)
    }, 500);
});

$(".scroll").click(function () {
    var scrollId = $(this).attr("id");
    $('html, body').animate({
        scrollTop: ($("#" + scrollId + "Section").offset().top - 100)
    });
    return false;
});
/* Side Nav scrolling [end] */

