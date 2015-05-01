<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>jQuery File Upload Example</title>
</head>
<body>
<input id="fileupload" type="file" name="files[]" data-url="server/php/" multiple>
<script type="text/javascript" src="assets/jquery/jquery.js"></script>
<script type="text/javascript" src="assets/jquery-file-upload/js/vendor/jquery.ui.widget.js"></script>
<script type="text/javascript" src="assets/jquery-file-upload/js/jquery.iframe-transport.js"></script>
<script type="text/javascript" src="assets/jquery-file-upload/js/jquery.fileupload.js"></script>
<script>
$(function () {
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo(document.body);
            });
        }
    });
});
</script>
</body> 
</html>