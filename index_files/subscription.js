
$(document).ready(function () {
    $('#noti_Button').click(function () {
        // TOGGLE (SHOW OR HIDE) NOTIFICATION WINDOW.
        $('#notifications').fadeToggle('fast', 'linear', function () {
            if ($('#notifications').is(':hidden')) {
                $('#noti_Button').css('color', '#FFF');
            }
            else $('#noti_Button').css('color', 'rgb(255, 86, 86)');        // CHANGE BACKGROUND COLOR OF THE BUTTON.
        });
        $('#noti_Counter').fadeOut('slow');                 // HIDE THE COUNTER.
        return false;
    });
    // HIDE NOTIFICATIONS WHEN CLICKED ANYWHERE ON THE PAGE.
    $(document).click(function (e) {
        if (!$(e.target).is(".removeElement") || $(".removeElement").has(e.target).length ) {
            $('#notifications').hide();
        }
        if ($('#noti_Counter').is(':hidden')) {
            // CHANGE BACKGROUND COLOR OF THE BUTTON.
            $('#noti_Button').css('color', '#FFF');
        }
    });
    $('.notifi_click').click(function () {
        return false;       // DO NOTHING WHEN CONTAINER IS CLICKED.
    });
});
