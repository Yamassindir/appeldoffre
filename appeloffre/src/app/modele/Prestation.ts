import { Prestataire } from './Prestataire';

export class Prestation{

    public prestationid : number;
    public   prestationref : string;
    public  designation : string;
    public phaseid : number;
    public prestataire : Prestataire[];
    public prix : number;
    
}