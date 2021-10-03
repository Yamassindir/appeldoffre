import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'; 

@Pipe({
  name: 'unique',
  pure: false
})

export class UniquepipePipe implements PipeTransform {
    transform(value: any, args :string): any{
        if(value!== undefined && value!== null){
            return _.uniqBy(value, args);
        }
        return value;
    }
}