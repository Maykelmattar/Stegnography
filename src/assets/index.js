var imgdatauri;

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            document.querySelector("#image1").src = e.target.result;
            imgdatauri = e.target.result;

        };
    }
    reader.readAsDataURL(input.files[0]);

}

function read() {
    var img = document.getElementById("image1");
    console.log(img)
    if (img) {
        const revealed = steg.decode(img);
        document.getElementById("revealed").value = revealed;
    }
}

function decode(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            console.log(steg.decode(e.target.result));

            document.querySelector('#decoded').innerText = steg.decode(e.target.result);
        };
    }
    reader.readAsDataURL(input.files[0]);
}

function getArrayBuffer(input) {
    const fr = new FileReader();
    fr.onload = () => {
        // It worked
        const array = new Uint8Array(fr.result);
        // ...use the array here...
    };
    fr.onerror = () => {
        // The read failed, handle/report it
    };
    fr.readAsArrayBuffer(input);
}

function hideText() {
    document.querySelector("#image2").src = steg.encode(document.querySelector('#text').value, imgdatauri);
    document.querySelector("#downloadSrc").href = document.querySelector("#image2").src
    document.querySelector("#downloadSrc").className = ""

}