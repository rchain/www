$("#scholarshipSubmit").click(function (event) {
    event.preventDefault();
    var data = $("#scholarshipForm").serialize();
    $.ajax({
        type: "POST",
        url: "scholarship-submission",
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
                    scrollTop: ($("#applicationSection").offset().top - 100)
                });
            }
        } else {
            $("#submitFail").css("display", "none");
            $("#submitSuccess").css("display", "inline-block");
            $("#submitSuccess").append("<div class='success'>Thank you for submitting the application. All applicants will be notified  by August 1, 2018.</div>");
            $("#scholarshipForm").css("display", "none");
            $('html, body').animate({
                scrollTop: ($("#applicationSection").offset().top - 100)
            });
        }
    });
});