import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loaderStatus = new BehaviorSubject<boolean>(false);
  loaderStatus$ = this.loaderStatus.asObservable()

  loaderText = new BehaviorSubject<string>("");
  loaderText$ = this.loaderText.asObservable()
  constructor() { }
}
