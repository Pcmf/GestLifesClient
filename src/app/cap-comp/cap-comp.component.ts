import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-cap-comp',
  templateUrl: './cap-comp.component.html',
  styleUrls: ['./cap-comp.component.css']
})
export class CapCompComponent implements OnInit {
  public camera = false;
  public file = false;
  public docPedido: any = {};

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
     width: {ideal: 1024},
     height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  public docSelected: any = {};
  public erro = '';
  public loaded = false;
  private doc: any = [];
  private filename: string;
  private obj: any = {};

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router) {
    this.route.queryParamMap.subscribe(
      params => {
        /* console.log('Parametro doc: ' + params.get('lead') + params.get('linha')); */
        this.dataService.getData('cltcomp/' + params.get('lead') + '/' + params.get('linha') ).subscribe(
          resp => {
            this.docPedido = resp[0];
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

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
   // console.log('received webcam image', webcamImage.imageAsDataUrl);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  public confirmaAnexarFoto () {
    const obj = { 'doc': this.docPedido, 'imagem': this.webcamImage.imageAsDataUrl};
    this.dataService.saveData('cltupcomp', obj).subscribe(
      resp => {
        setTimeout(() => {
          this.router.navigate(['/docs']);
        }, 1000);

      }
    );
  }

  public tentarNovamente () {
    this.webcamImage = null;
    this.camera = true;
    this.file = false;
  }
  public cancelar () {
    this.webcamImage = null;
    this.camera = false;
    this.file = false;
    this.erro = '';
  }

  anexarDoc (doc) {
    this.docSelected = doc;
  }

  handleInputChange(e, doc) {
    this.doc = doc;
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    this.filename = file.name;
    const pattern = /pdf-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.erro = 'Formato inválido. O ficheiro tem de ser PDF!';
      // return;
    } else if ( file.size > 4000000 ) {
      this.erro = 'Ficheiro demasiado grande. Tem que ser inferior a 4Mb';
      // return;
    } else {
      this.erro = '';
    }

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);

  }
  _handleReaderLoaded(e) {
    const reader = e.target;
    this.obj = {'lead': this.docPedido.lead, 'doc': this.docPedido, 'nomeFx': this.filename, 'fxBase64': reader.result};
    this.loaded = true;
  }

  confirmaAnexar () {
    this.dataService.saveData('cltdocs', this.obj)
      .subscribe( resp => {
        if (resp) {
          console.log(resp);
          this.erro = '';
          this.loaded = false;
          window.history.back();
        }
      });
  }
}
