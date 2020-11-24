import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-decrypt',
  templateUrl: './decrypt.page.html',
  styleUrls: ['./decrypt.page.scss'],
})
export class DecryptPage implements OnInit {

  myphoto: any;
  Todecrypt: '';
  @ViewChild("key") key;
  @ViewChild("imageKey") imageKey;


  constructor(private camera: Camera, private androidPermissions: AndroidPermissions,  public loadingController: LoadingController) {

  }
  handleFileSelect(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }
  StringToBinary(string) {
    //Convert the string to a set of binary 
    let returnValueBinary = "";
    for (var i = 0; i < string.length; i++) {
      returnValueBinary += ' ' + ("00000000" + Number(string[i].charCodeAt(0)).toString(2)).slice(-8)
    }
    return returnValueBinary
  }
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    this.myphoto = 'data:image/png;base64,' + base64textString
    //Get the image base64
    var img = new Image();
    img.src = this.myphoto;
    var canvas = document.getElementById('canvas') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');
    //Get the key to find to stop
    let keyToFind = this.StringToBinary("#cyb560#" + this.imageKey.value + "#cyb560#")
   //Decryption key
    let key = this.key.value
    img.onload = function () {
      ctx.drawImage(img, 0, 0, img.width, img.height,
        0, 0, canvas.width, canvas.height);
        //Get the pixel array
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            let Todecrypt = showImage(imageData.data, keyToFind).replace(keyToFind, '');
      if (Todecrypt !=="")
      //Decrypt the output string 
      decrypt(Todecrypt, key)

    };
    function showImage(imgData, text) {
      let i = 0, outputString = '';
      let rgbPixel = []
      //Loop until the text is found 
      while (!(outputString.replace(/ /g, "").indexOf(text.replace(/ /g, "")) > -1) && i * 3 < imgData.length) {
        let firstIndex = (i * 3)
        let currentPixel = [];
        currentPixel = [imgData[firstIndex], imgData[firstIndex + 1], imgData[firstIndex + 2]]
        let nextPixel = [imgData[(firstIndex + 3)], imgData[(firstIndex + 3) + 1], imgData[(firstIndex + 3) + 2]]
        //Add the difference to the output string 
        outputString += Math.abs(((Number(getMax(nextPixel).max) - Number(getMax(currentPixel).max)) % 2))
        //Add space after each 8 characters
        if (outputString.replace(/ /g, "").length % 8 === 0) {
          outputString += " "
        }
        i++;
        //If the key is not found alert that the key is wrong 
        if (i * 3 >= imgData.length - 1) {
          outputString = ""
          alert("Wrong Key")
        }
      }
      return outputString;
      //Get the maximum
      function getMax(array) {
        let max = 0, maxIndex = 0
        for (let i = 0; i < array.length; i++) {
          if (max < array[i]) {
            max = array[i]
            maxIndex = i;
          }
        }
        return { 'max': max, 'maxIndex': maxIndex }
      }

    }
    function decrypt(textToDecrypt, key) {
      let s = [];
      let T = [];
      var rkey = key;
      var ciphertext = textToDecrypt.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
      console.log(textToDecrypt)
      console.log(ciphertext)
      if (rkey != '') {
        let result = "";
        //first step 
        for (var i = 0; i < 256; i++) {
          s[i] = i;
          T[i] = rkey.charCodeAt(i % rkey.length);
        }
        console.log('First Step Result');
        //second step 
        var j = 0;
        var temp;
        for (var i = 0; i < 256; i++) {
          j = (j + s[i] + T[i]) % 256;
          temp = s[i];
          s[i] = s[j];
          s[j] = temp;
        }
        console.log('Second step result');
        //Third Step 
        var i = 0; var j = 0; var temp; var t; var k;
        for (var c = 0; c < ciphertext.length - 1; c++) {
          i = (i + 1) % 256;
          j = (j + s[i]) % 256;
          temp = s[i];
          s[j] = s[i];
          s[i] = temp;
          t = (s[i] + s[j]) % 256;
          k = s[t];
          //XOR with the key 
          result += String.fromCharCode(k ^ ciphertext.charCodeAt(c));


        }
        alert(result)
        document.getElementById("result").innerHTML = "Result: " + result;
      }
    }

  }


  loadImage() {
    document.getElementById("filePicker").click();
  }

  ngOnInit() {
  }

}
