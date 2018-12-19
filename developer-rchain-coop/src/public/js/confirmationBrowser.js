if (document.getElementById("paymentUnpaid").innerHTML == "Payment Pending") {
    document.getElementById("eventbrite-widget-modal-trigger-46303100821").style.display = "none";
    document.getElementById("discountLine").classList.remove("paid");
} else {
    document.getElementById("eventbrite-widget-modal-trigger-46303100821").style.display = "block";
    document.getElementById("ethereumLine").style.display = "none";
    document.getElementById("discountLine").classList.add("paid");
}

if (document.getElementById("generalAdmissionCount2").innerHTML == 0) {
    document.getElementById("generalAdmissionLine").style.display = "none";
}

if (document.getElementById("studentCount2").innerHTML == 0) {
    document.getElementById("studentLine").style.display = "none";
}



