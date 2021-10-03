import { Produit } from './produit';

export class Demande{

    public   demandeid : number;
    public quantite: number;
    public produit : Produit;
    public   reference : string;
    public  catalogueid:number;
    public  marcheid:number;
    public datedemande:Date;
}