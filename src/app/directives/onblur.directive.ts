import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MapsAPILoader } from "@agm/core";

declare var google;

@Directive({
    selector: '[appOnblur]'
})

export class OnblurDirective {
    private _el: HTMLElement;
    @Input('appOnblur') address: any;
    @Input() isAutofillEnabled: any;
    @Input() index : any;
    @Output() triggerAutoSelect = new EventEmitter();
    constructor(private elementRef: ElementRef, private mapsAPILoader: MapsAPILoader) {
        this._el = this.elementRef.nativeElement;
    }

    @HostListener('ngModelChange', ["$event"])
    ngOnChanges(event) {
        if ((!!event.address) && (!!event.address.currentValue) && (event.address.currentValue.length > 0) && this.isAutofillEnabled ==="true") {
            
            this.mapsAPILoader.load().then(() => {
                // google api has per sec call limit
                // delaying the calls to resolve the issue
                setTimeout(() => {
                    
                    if (this.isAutofillEnabled === "true") {
                        const service = new google.maps.places.AutocompleteService();
                        const placeService = new google.maps.places.PlacesService(this._el);
                        service.getPlacePredictions({ input: this.address }, async (predictions, status) => {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                if (predictions.length > 1) {
                                    console.log(predictions);
                                }
                                await placeService.getDetails({ placeId: predictions[0].place_id }, async (PlaceResult, PlacesServiceStatus) => {
                                    if (PlaceResult && PlaceResult.geometry) {
                                        await this.triggerAutoSelect.emit(PlaceResult);
                                    }
                                })
                            }
                            else {
                                if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
                                    console.log(this.index);
                                    const service = new google.maps.places.AutocompleteService();
                                    const placeService = new google.maps.places.PlacesService(this._el);
                                    service.getPlacePredictions({ input: this.address }, async (predictions, status) => {
                                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                                            if (predictions.length > 1) {
                                                console.log(predictions);
                                            }
                                            await placeService.getDetails({ placeId: predictions[0].place_id }, async (PlaceResult, PlacesServiceStatus) => {
                                                if (PlaceResult && PlaceResult.geometry) {
                                                    await this.triggerAutoSelect.emit(PlaceResult);
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        });
                    }
                }, (this.index/10)*2000);
            })
        }
    }
}
