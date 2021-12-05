import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Preset } from './interfaces/preset.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ptz-control';
  pan = 90;
  tilt = 90;
  zoomIN = 0;
  zommOUT = 0;
  presets: Preset[] = []
  currentPreset: Preset = {
    id: undefined,
    name: undefined,
    pan: undefined,
    tilt: undefined,
    created_at: undefined,
    updated_at: undefined
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.key == 'ArrowUp'){
      this.tilt++
      this.sendData()
    }
    if(event.key == 'ArrowLeft'){
      this.pan++
      this.sendData()
    }
    if(event.key == 'ArrowDown'){
      this.tilt--
      this.sendData()
    }
    if(event.key == 'ArrowRight'){
      this.pan--
      this.sendData()
    }
    if(event.key == '+'){
      this.zoomIn()
    }
    if(event.key == '-'){
      this.zoomOut()
    }
  }

  constructor(
    private http: HttpClient,
  ) {
    this.loadPresets()
   }

  getUrl() {
    return `http://192.168.15.50?pan=${this.pan}&tilt=${this.tilt}&zoomIn=${this.zoomIN}&zoomOut=${this.zommOUT}`;
  }

  setPreset(preset: Preset) {
    this.currentPreset = preset
    this.pan = preset.pan ?? this.pan
    this.tilt = preset.tilt ?? this.tilt
    this.sendData()
  }

  setPan(event: MatSliderChange) {
    this.pan = event.value ?? this.pan
    this.sendData()
  }

  setPanInput() {
    this.sendData()
  }

  arrowLeft() {
    this.pan++
    this.sendData()
  }

  arrowRight() {
    this.pan--
    this.sendData()
  }

  sendData() {
    this.http.get(this.getUrl()).subscribe(() => {
    })
  }

  setTilt(event: MatSliderChange) {
    this.tilt = event.value ?? this.tilt
    this.sendData()
  }

  setTiltInput() {
    this.sendData()
  }

  arrowUp() {
    this.tilt++
    this.sendData()
  }

  arrowDown() {
    this.tilt--
    this.sendData()
  }

  zoomIn() {
    this.zoomIN = 1
    this.sendData()
    this.zoomIN = 0
  }

  zoomOut() {
    this.zommOUT = 1
    this.sendData()
    this.zommOUT = 0
  }

  loadPresets() {
    this.http.get<Array<Preset>>(`http://localhost:3333/api/v1/presets`).subscribe((data) => {
      this.presets = data
    }, (error) => {
      console.log(error)
    })
  }

  createPreset() {
    if (this.currentPreset.name) {
      this.currentPreset.id = undefined
      this.currentPreset.pan = this.pan
      this.currentPreset.tilt = this.tilt
      this.http.post<Preset>(`http://localhost:3333/api/v1/presets`, this.currentPreset).subscribe((data) => {
        this.currentPreset = data
        this.loadPresets()
      }, (error) => {
        console.log(error)
      })
    }
  }

  updatePreset() {
    if (this.currentPreset && this.currentPreset.name) {
      this.currentPreset.pan = this.pan
      this.currentPreset.tilt = this.tilt
      this.http.patch<Preset>(`http://localhost:3333/api/v1/presets/${this.currentPreset.id}`, this.currentPreset).subscribe((data) => {
        this.currentPreset = data
        this.loadPresets()
      }, (error) => {
        console.log(error)
      })
    }
  }

  deletePreset() {
    this.http.delete(`http://localhost:3333/api/v1/presets/${this.currentPreset.id}`)
  }
}
