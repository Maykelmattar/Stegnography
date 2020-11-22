import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
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


  constructor(private camera: Camera, private fileChooser: FileChooser, private androidPermissions: AndroidPermissions, private filePath: FilePath, private base64ToGallery: Base64ToGallery, public loadingController: LoadingController) {

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
    var img = new Image();
    img.src = this.myphoto;
    var canvas = document.getElementById('canvas') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');
    let keyToFind = this.StringToBinary("#cyb560#" + this.imageKey.value + "#cyb560#")
    let key = this.key.value

    img.onload = function () {
      ctx.drawImage(img, 0, 0, img.width, img.height,
        0, 0, canvas.width, canvas.height);
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let Todecrypt = showImage(imageData.data, keyToFind).replace(keyToFind, '');
      if (Todecrypt !=="")
      decrypt(Todecrypt, key)

    };
    function showImage(imgData, text) {
      let i = 0, outputString = '';
      let rgbPixel = []
      while (!(outputString.replace(/ /g, "").indexOf(text.replace(/ /g, "")) > -1) && i * 3 < imgData.length) {
        let firstIndex = (i * 3)
        let currentPixel = [];
        currentPixel = [imgData[firstIndex], imgData[firstIndex + 1], imgData[firstIndex + 2]]
        let nextPixel = [imgData[(firstIndex + 3)], imgData[(firstIndex + 3) + 1], imgData[(firstIndex + 3) + 2]]
        outputString += Math.abs(((Number(getMax(nextPixel).max) - Number(getMax(currentPixel).max)) % 2))
        if (outputString.replace(/ /g, "").length % 8 === 0) {
          outputString += " "
        }
        i++;
        if (i * 3 >= imgData.length - 1) {
          outputString = ""
          alert("Wrong Key")
        }
      }
      return outputString;
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
