$(function(){

    $('#showToast').toast('show');
    $('#showToast').toast({autohide: false});
    $('#clearSearch').click(function(){
        location.reload();
    })


    $('.index-table').delay(2000).each(function(){
        $(this).find('td').each(function(){
            console.log($(this).text())
            if($(this).text() == "  admitted "){
                console.log($(this).text())
                $(this).css({"color":"green"});
            }else if($(this).text() == "  undecided "){
                $(this).css({"color":"red"});
            }
        })
    })


    
    // POPULATING STATES AND LGAS
    let states = $('#state');
    let lgas = $('#lga');
    $("form#portalForm").find(':input', ':select').after(`<div class="form-text text-danger"></div>`);

    states.empty();
    lgas.empty();

    states.append("<option selected='true' disabled>Choose State</option>");
    states.prop('selectedIndex', 0);

    lgas.append("<option selected='true' disabled>Choose Local Government</option>");
    lgas.prop('selectedIndex', 0);

    const url = 'static/json/states-localgovts.json'

    // Populate states with json
    $.getJSON(url, function(data){
        $.each(data, function(key, value){
            states.append($('<option></option>').attr('value', value.state).text(value.state));
        });
    });


    // Populate lga with json
    $('#state').change(function(){
        lgas.empty();
        lgas.append("<option selected='true' disabled>Choose Local Government</option>");
        lgas.prop('selectedIndex', 0);

        let stat = $('#state').val()

        $.getJSON(url, function(data){
            $.each(data, function(key, value){
                if (value.state == stat){
                    for(let i=0; i < value.local.length; i++)
                        lgas.append($('<option></option>').attr('value', value.local[i]).text(value.local[i]));
                }
            });
        });
    });





    // VALIDATOR FOR SIGN UP FORM
    // EMAIL CHECKER, PHONE, JAMB
    // $("form#portalForm").each(function(){

    //     $(this).find(':input', ':select').blur(function(e){
    //         if ($(this).val() == ''){

    //             if ($(this).next().text() == ''){
    //             $(this).next().text('Please fill this field');}
    //             $(this).css({"border-color":"red"});
                
    //         }else if(($(this).attr("name") == 'email') && (/^[\w.]+@[\w.]+$/ig.test($(this).val()) == false)){

    //                 $(this).next().empty();
    //                 $(this).next().text('Please add correct email format');
    //                 $(this).css({"border-color":"red"});

    //         }else if(($(this).attr("name") == 'phone') && (/[^\d]+/g.test($(this).val()) == true)){

    //                 $(this).next().empty();
    //                 $(this).next().text('No letters in number');
    //                 $(this).css({"border-color":"red"});
                    
    //         }else if(($(this).attr("name") == 'phone') && ($(this).val().length > 11)){

    //             $(this).next().empty();
    //             $(this).next().text('Phone number cannot be more than 11 digits');
    //             $(this).css({"border-color":"red"});
                
    //         }else if(($(this).attr("name") == 'jamb') && (/[^\d]+/g.test($(this).val()) == true)){

    //         $(this).next().empty();
    //         $(this).next().text('Jamb score should not contain letters');
    //         $(this).css({"border-color":"red"});
            
    //         }else if(($(this).attr("name") == 'jamb') && ($(this).val().length > 3)){

    //             $(this).next().empty();
    //             $(this).next().text('Jamb score should not be more than 3 figures');
    //             $(this).css({"border-color":"red"});
                
    //             }else{
    //             $(this).next().text('');
    //             $(this).css({"border-color":"green"});
    //         }
    //     });
    // });


        

    // AJAX FOR CHANGING STATUS
    $('#status').change(function(){
        let studentStatus = $('#status').val();
        let id = $('input[name="studentId"]').val();

        $.ajax({
            url: '/changeStatus',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                'id': id,
                'studentStatus': studentStatus
            }),
            contentType: 'application/json, charset=UTF-8',
            success: function(data){
                $('#showToast').toast('show');
                // $('#showToast').toast({autohide: false});
                // $('.showErrors').text('Status changed successfully');
                $('#statusEl').text(data);
            },
            error: function(err){
                console.log(err)
            }
        });
    });
















    $("form#portalForm").each(function(){

            $(this).find(':input', ':select').blur(function(e){
                if ($(this).val() == ''){
    
                    if ($(this).next().text() == ''){
                    $(this).next().text('Please fill this field');}
                    $(this).css({"border-color":"red"});
                }else{
                    $(this).next().text('');
                    $(this).css({"border-color":"green"});
                }
            });
        });




    function validator(){
        let sign
        $("form#portalForm").each(function(){
            $(this).find(':input', ':select').each(function(){
                // console.log($(this).attr('name'))
                if (($(this).val() == '') || ($(this).val() == null)){
                    console.log($(this).attr('name'))
                    console.log($(this).val())
                    console.log(false)
                    if ($(this).next().text() == ''){
                        
                        $(this).next().text('Please fill this field');}
                        $(this).css({"border-color":"red"});
                        sign = false;
                    // console.log('false')
                    // return false
                }else{
                    console.log($(this).attr('name'))
                    console.log($(this).val())
                    console.log(true)
                    $(this).next().text('');
                    $(this).css({"border-color":"green"});
                    sign = true;
                    // console.log('true')
                    // return true
                }
            });
        });

        // console.log(sign)
        // return sign
    }



    // function validator(){
        //     $("form#portalForm").each(function(){
    
        //         $(this).find(':input', ':select').each(function(e){
        //             if ($(this).val() == ''){
        //                 console.log('here1')
        //                 if ($(this).next().text() == ''){
        //                 console.log('here2')
        //                     $(this).next().text('Please fill this field');}
        //                     $(this).css({"border-color":"red"});
        //                 return false;
        //             }else{
        //                 console.log('here3')
        //                 $(this).next().text('');
        //                 $(this).css({"border-color":"green"});
        //                 return true
        //             }
        //         });
        //     });
        // }








// AJAX FOR FORM SUBMISSION
$('form#portalForm').submit(function(e){
    let check = validator()
    if (check == true){
        console.log('true')
    }else if(check == false){
        console.log('false')
    }



    // let data = new FormData(this);

    // $.ajax({
    //     url: '/portalHandler',
    //     type: 'POST',
    //     cache: false,
    //     data: data,
    //     processData: false,
    //     contentType: false,
    //     success: function(data){
    //         // window.location.replace('/index')
    //         console.log(data)
                // parse data before checking since its in json
    //         if(data == '"error"'){
    //             // console.log("error data received")
    //             location.reload()
    //         }else if(data == '"success"'){
    //             // console.log("data received")
    //             window.location.replace('/index')
    //         }
    //     },
    //     error: function(err){
    //         console.log(err)
    //     }
    // });

});



















});