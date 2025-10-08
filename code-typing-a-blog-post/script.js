document.getElementsByTagName("p")[1].innerHTML =
    "<span class='comment'>/* ---------- <br/>img: src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-1/cherry-blossoms-unsplash.jpg'<br/>alt='cherry blossoms'</br> -------- */</span></br></br>";

var str = document.body.innerHTML.toString();
var i = 0;
document.body.innerHTML = "";

setTimeout(function() {
    var se = setInterval(function() {
        i++;
        document.body.innerHTML = str.slice(0, i) + "|";
        if (i == str.length) {
            clearInterval(se);
            document.body.innerHTML = str;
        }
    }, 10);
});