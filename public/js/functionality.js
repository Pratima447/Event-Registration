$(document).ready(function () {
    $('#res_type').on('change', function () {
        console.log(this.value);
        if (this.value != 'self') {
            $('#ticket_no').val('');
            $('#ticket_no').removeAttr('disabled');
        } else {
            $('#ticket_no').val('1');
            $('#ticket_no').prop('disabled', 'true');
        }
    })
})

function checkMobValidation() {
    var mobile = $('#mobile').val();

    if ( ! validate_mobile(mobile)) {
        $('#invalid_mob_msg').removeClass('display_n');
    } else {
        $('#invalid_mob_msg').addClass('display_n');
    }
}

function checkEmailValidation() {
    var email = $('#email').val();
    if (!validate_email(email)) {
        $('#invalid_email_msg').removeClass('display_n');
    } else {
        $('#invalid_email_msg').addClass('display_n');
    }
}
function validate_mobile(mobile)
{
    return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(mobile);
}
function validate_email(email)
{
    return  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

jQuery("input#id_card").change(function () {

    let fileInput = document.getElementById('id_card');

    let img_file = fileInput.files[0];

    if (Math.round(img_file.size / 1024) > 1000)
    {
        alert("Image Size is greater than 1 MB, Try to upload less than 1 MB");
        return false;
    }

    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    sessionStorage.setItem("pic", '');

    var file = this.files[0];
    var filetype = file["type"];
    var valid_image_types = ["image/png", "image/jpeg"];

    if ($.inArray(filetype, valid_image_types) < 0) {
        alert('Image should be either png or jpeg');
        return false;
    }

    draw_on_canvas();
    store_my_pic();
})

function draw_on_canvas() {
    let fileInput = document.getElementById('id_card');

    let file = fileInput.files[0];

    var reader = new FileReader();
    reader.readAsDataURL(file);

    //let img load
    reader.onloadend = function (e) {
        var image = new Image();
        image.src = e.target.result;

        image.onload = function () {
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image,0,0);
        }
    }
}

function store_my_pic() {
    var file_data = $("#id_card").prop("files")[0]; 
    console.log(file_data);
    var form_data = new FormData(); 
    form_data.append("pic", file_data);
    console.log('calling API...');
    $.ajax({
        url: "/upload_pic",
        type: 'POST',
        dataType: 'script',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        success: function (result) {
            alert('saved img');
            console.log(result);
        }
    })
}

function get_64_base_img() {
    var canvas = document.getElementById('canvas');
    var data_url = canvas.toDataURL("image/png");

    return data_url.replace(/^data:image\/(png|jpg);base64,/, "");
}

$('#preview').on('click', function () {
    var name = $('#name').val();
    var mobile = $('#mobile').val();
    var email  = $('#email').val();
    var registration_type = $('#res_type').val();
    var ticket_no = $('#ticket_no').val();

    var pic_name = $('#id_card').val();
    pic_name = pic_name.substring(0);

    var pic = get_64_base_img();

    if (!name || !mobile || !email || !registration_type || !ticket_no || !pic_name) {
        alert("Please fill all required fields");
        return false;
    }

    if (!validate_email(email)) {
        alert('Please enter valid email');
        return false;
    }
    if (!validate_mobile(mobile)) {
        alert('Please enter valid mobile');
        return false;
    }

    sessionStorage.setItem("name", name);
    sessionStorage.setItem("mobile", mobile);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("res_type", registration_type);
    sessionStorage.setItem("ticket_no", ticket_no);
    sessionStorage.setItem("pic", pic);

    window.open("/preview","_blank");

})

$('#submit').on('click', function () {
    var name = $('#name').val();
    var mobile = $('#mobile').val();
    var email  = $('#email').val();
    var registration_type = $('#res_type').val();
    var ticket_no = $('#ticket_no').val();
    var pic_name = $('#id_card').val();
    pic_name = pic_name.substring(12);

    if (!name || !mobile || !email || !registration_type || !ticket_no || !pic_name) {
        alert("Please fill all required fields");
        return false;
    }

    console.log('calling api')
    $.post('/submit', { name: name, mobile: mobile, email: email, registration_type: registration_type, ticket_no: ticket_no, pic_name : pic_name})
        .done(function (result) {
            console.log(result);
            $('#register_form').addClass('display_n');
            $('#thanku_form').removeClass('display_n');
            $('#res_id').html(result.id);
            // alert('Thank you for Registering your registration id is :-'+result.id);
        })
})



$(window).on('load', function () {
    var url = window.location.href;
    var params = url.split("/");

    if (params.includes("preview")) {
        //get data from session storage
        $('#name').html(sessionStorage.getItem("name"));
        $('#mobile').html(sessionStorage.getItem("mobile"));
        $('#email').html(sessionStorage.getItem("email"));
        $('#res_type').html(sessionStorage.getItem("res_type"));
        $('#ticket_no').html(sessionStorage.getItem("ticket_no"));

        var pic = sessionStorage.getItem("pic");
        var src = "data:image/png;base64," + pic;
        var preview = document.getElementById("user_pic");
        preview.src = src;

    }

})