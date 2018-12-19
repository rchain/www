

/* Token Swap form submission */
$("#tokenSwapFormSubmit").click(function (event) {
    event.preventDefault();
    var data = $("#tokenSwapForm").serialize();
    $.ajax({
        type: "POST",
        url: "tokenswap-submission",
        data: data,
        dataType: "json"
    }).done(function (data) {
        if (!(data[0] == "success")) {
            $("#submitFail").html("");
            for (var item in data) {
                $("#submitFail").css("display", "inline-block");
                $("#submitFail").append('<div class="errors">' + data[item] + "</div>");
            }
        } else {
            $("#submitFail").css("display", "none");
            $("#submitSuccess").css("display", "inline-block");
            $("#submitSuccess").append("<div class='success'>Thank you for your submission</div>");
            $("#tokenSwapForm").css("display", "none");
        }
    });
});