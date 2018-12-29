/**
 * Created by Zaman on 23/12/2018.
 */

// Display Record Exist
function isExistMessageDisplay(response){
    $.smallBox({
        title: response,
        content: "<i class='fa fa-clock-o'></i> <i>Please recheck</i>",
        color: "#C79121",
        timeout: 5000,
        icon: "fa fa-search fadeInRight animated"
    });
}

// Display SUCCESS Message
function SuccessMessageDisplay(response){
    $.smallBox({
        title: "New Record Created Successfully.",
        content: "<i class='fa fa-clock-o'></i> <i> . </i>",
        color: "#659265",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 3000
    });
}

// Display UPDATE Message
function UpdatedMessageDisplay(response){
    $.smallBox({
        title: "Updated Successfully.",
        content: "<i class='fa fa-clock-o'></i> <i> . </i>",
        color: "#659265",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 3000
    });
}

// Display DELETE Message
function DeleteMessageDisplay(response){
    $.smallBox({
        title: "Deleted Successfully.",
        content: "<i class='fa fa-clock-o'></i> <i> . </i>",
        color: "#C46A69",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 4000
    });
}

// Display DISPOSE Message
function DisposeMessageDisplay(response){
    $.smallBox({
        title: "Card Dispose Successfully. You can Assign now.",
        content: "<i class='fa fa-clock-o'></i> <i> . </i>",
        color: "#C79121",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 3000
    });
}

// Display FAILED Message
function FailedMessageDisplay(response){
    if (response.status === 401) {
        //console.error('You need to login first!');
        $.bigBox({
            title: "Session Ended!",
            content: "Your current login session ended. Please login again. Thank You.",
            color: "#C79121",
            timeout: 5000,
            icon: "fa fa-shield fadeInLeft animated"
            //number: "3"
        });
    }else{
        $.smallBox({
            title: "Failed to get data. Please try again.",
            content: "<i class='fa fa-clock-o'></i> <i>Please contact with System Admin</i>",
            color: "#C46A69",
            iconSmall: "fa fa-times fa-2x fadeInRight animated",
            timeout: 3000
        });
    }
}

// Display ERROR Message
function ErrorMessageDisplay(response){
    $.smallBox({
        title: "Bad Request or Internal Server Error.",
        content: "<i class='fa fa-clock-o'></i> <i> . </i>",
        color: "#659265",
        iconSmall: "fa fa-check fa-2x fadeInRight animated",
        timeout: 3000
    });
}
