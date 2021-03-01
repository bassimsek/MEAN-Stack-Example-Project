import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from 'rxjs';


// Image Uploading icin async validator


export const mimeType = (
  control: AbstractControl
): Promise<{[ key: string ]: any}> | Observable<{[ key: string ]: any}> => {
  if (typeof(control.value) === 'string') {
    return of(null);
    /* eğer form'un image value'su string'se kısa yoldan of observable'ini dönduruyoruz.
     burda null demek valid demek. asagıda oldugu gibi */
  } else if (control.value) {
    const file = control.value as File;
    const fileReader = new FileReader();  // frObs = fileReaderObservable anlaminda
    const frObs = Observable.create((observer: Observer<{[ key: string ]: any}>) => {
      fileReader.addEventListener("loadend", () => {
        const arr = new Uint8Array(fileReader.result).subarray(0, 4);
        let header = "";
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        switch (header) {
          case "89504e47":
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    });
    return frObs;

  } else {
    return of(null);
  }
};
