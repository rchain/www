$("#validationSubmit").click(function (event) {
    event.preventDefault();
    var data = $("#validationForm").serialize();
    $.ajax({
        type: "POST",
        url: "validation-submission",
        data: data,
        dataType: "json"
    }).done(function (data) {
        if (!(data[0] == "success")) {
            $("#submitFail").html("");
            $("#submitFail").append('<div class="errorsTitle">The following fields did not contain valid information: </div>');
            for (var item in data) {
                $("#submitFail").css("display", "inline-block");
                $("#submitFail").append('<div class="errors">- ' + data[item] + "</div>");
                $('html, body').animate({
                    scrollTop: ($("#registrationSection").offset().top - 100)
                });
            }
        } else {
            $("#submitFail").css("display", "none");
            $("#submitSuccess").css("display", "inline-block");
            $("#submitSuccess").append("<div class='success'>Thank you for your registration. We will send any updates related to RChain validation to you via email.</div>");
            $("#validationForm").css("display", "none");
            $('html, body').animate({
                scrollTop: ($("#registrationSection").offset().top - 100)
            });
        }
    });
});