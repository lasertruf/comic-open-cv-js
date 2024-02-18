import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
declare const cv: any; // Define cv as any


@Component({
  selector: 'app-face-detection',
  templateUrl: './face-detection.component.html',
  styleUrls: ['./face-detection.component.scss']
})
export class FaceDetectionComponent {
  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;

  video: any;
  classifier : any ;
  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    // this.video = this.videoElement.nativeElement;

    // Ensure that getUserMedia is supported by the browser
    // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //   navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    //     this.video.srcObject = stream;
    //     this.video.play();
    //   }).catch(err => console.error('Error accessing camera: ', err));
    // }


    navigator.mediaDevices
    .getUserMedia({
      video: {
        width: 360
      }
    })
    .then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
    });
  }

  detectFace() {
    const video = this.videoElement.nativeElement;
    const cap = new cv.VideoCapture(video);

    const frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);

    const faces = new cv.RectVector();

    // Load pre-trained face detection model

    this.http.get('assets/haarcascade_frontalface_default.xml', { responseType: 'text' }).subscribe(
    {  
      next:  (data) => {
        this.classifier = new cv.CascadeClassifier();
        let path = 'haarcascade_frontalface_default.xml'

        cv.FS_createDataFile('/', path, data, true, false, false);
    
        this.classifier.load(path)
        
        
        const gray = new cv.Mat();
        const facesMat = new cv.MatVector();
    
        // Detect faces in the video stream
        const detectFaces = () => {
          cap.read(frame);
          cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY, 0);
          this.classifier.detectMultiScale(gray, faces);
          for (let i = 0; i < faces.size(); ++i) {
            const face = faces.get(i);
            facesMat.push_back(gray.roi(face));
            cv.rectangle(frame, {x: face.x, y: face.y}, {x: face.x + face.width, y: face.y + face.height}, [255, 0, 0, 255]);
          }
          cv.imshow(this.canvas.nativeElement, frame);
          requestAnimationFrame(detectFaces);
        };
    
        detectFaces();
      },  
      error: err => console.error('An error occurred :', err) 
    })
      
      
  }

}
