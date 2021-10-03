import { Prestataire } from './Prestataire';
import { Prestation } from './Prestation';

export class DemandeService{
    public   prestation : Prestation;
    public  phaseid : number;
    public prestataire : Prestataire[];
    public   nombreintervenant : number;
    public  hppmPpm:string;
}