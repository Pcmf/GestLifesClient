import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.css']
})
export class CaptureComponent implements OnInit {
  [x: string]: any;
  public camera = false;
  public file = false;
  public docPedido: any = {};

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    width: { ideal: 1024 },
    height: { ideal: 576 }
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  public docSelected: any = {};
  public erro = '';
  public loaded = false;
  private doc: any = [];
  private filename: string;
  private obj: any = {};
  public showSpiner: boolean;

  constructor(private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private imageCompress: NgxImageCompressService) {
    this.showSpiner = true;
    this.route.queryParamMap.subscribe(
      params => {
        this.dataService.getData('cltdocped/' + params.get('lead') + '/' + params.get('linha')).subscribe(
          resp => {
            this.docPedido = resp[0];
            this.showSpiner = false;
          }
        );
      }
    );
  }


  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public useCamera() {
    this.camera = true;
    this.file = false;
  }
  public selectFile() {
    this.camera = false;
    this.file = true;
  }


  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public confirmaAnexarFoto() {
    this.showSpiner = true;
    this.imageCompress.compressFile(this.webcamImage.imageAsDataUrl, -2, 50, 80).then(
      resp => {
        const obj = { 'doc': this.docPedido, 'imagem': resp };
        this.dataService.saveData('cltupimg', obj).subscribe(
          res => {
            this.showSpiner = false;
            this.router.navigate(['/docs']);
          }
        );
      });
  }

  public tentarNovamente() {
    this.webcamImage = null;
    this.camera = true;
    this.file = false;
  }
  public cancelar() {
    this.webcamImage = null;
    this.camera = false;
    this.file = false;
    this.erro = '';
  }

  anexarDoc(doc) {
    this.docSelected = doc;
  }

  handleInputChange(e, doc) {
    this.doc = doc;
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.filetype = (file.type).substr((file.type).indexOf('/') + 1);
    this.filename = file.name;
    const pattern = /pdf-*/;
    const pattern2 = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern) && !file.type.match(pattern2)) {
      this.erro = 'Formato inválido. O ficheiro tem de ser PDF, JPG ou PNG!';
      // return;
    } else if (file.type.match(pattern) && file.size > 4000000) {
      this.erro = 'Ficheiro PDF demasiado grande. Tem que ser inferior a 4Mb';
      // return;
    } else if (file.type.match(pattern2) && file.size > 6000000) {
      this.erro = 'Ficheiro demasiado grande. Tem que ser inferior a 6Mb';
      // return;
    } else {
      this.erro = '';
    }

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);

  }
  _handleReaderLoaded(e) {
    const reader = e.target;
    if (this.filetype != 'pdf') {
      this.imageCompress.compressFile(reader.result, -2, 50, 80).then(
        resp => {
          this.obj = {
            'lead': this.docPedido.lead, 'doc': this.docPedido, 'nomeFx': this.filename, 'fxBase64': resp,
            'type': this.filetype
          };
          this.loaded = true;
        }
      );
    } else {
      this.obj = {
        'lead': this.docPedido.lead, 'doc': this.docPedido, 'nomeFx': this.filename, 'fxBase64': reader.result,
        'type': this.filetype
      };
      this.loaded = true;
    }
  }

  confirmaAnexar() {
    this.showSpiner = true;
    this.dataService.saveData('cltdocs', this.obj)
      .subscribe(resp => {
        console.log('Confirma anexar:' + resp);
        this.erro = '';
        this.loaded = false;
        setTimeout(() => {
          this.showSpiner = false;
          this.router.navigate(['/docs']);
        }, 1000);
      });
  }

  back() {
    window.history.back();
  }

}
