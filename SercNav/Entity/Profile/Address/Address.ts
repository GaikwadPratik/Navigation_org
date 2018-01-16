import { AddressType } from './AddressType';
import { City } from './City';
import { Country } from './Country';
import { State } from './State';

export class Address {

    /*
     * Gets or Sets person id of the address
     */
    public PersonId: number = 0;

    /*
     * Gets or Sets address id of the address
     */
    public AddressId: number = 0;

    /*
     * Gets or Sets address line 1 of the address
     */
    public AddressLine1: string = '';

    /*
     * Gets or Sets address line 2 of the address
     */
    public AddressLine2: string = '';

    /*
     * Gets or Sets City the address
     */
    public City: City = null;

    /*
     * Gets or Sets State of the address
     */
    public State: State = null;    

    /*
     * Gets or Sets country of the address
     */
    public Country: Country = null;

    /*
     * Gets or Sets zip of the address
    */
    public Zip: number = 0;

    /*
     * Gets or Sets From date of the address
     */
    public FromDate: Date = null;

    /*
     * Gets or Sets To date of the address
     */
    public ToDate: Date = null;

    /*
     * Gets or Sets address type of the address
     */
    public AddressType: AddressType = null;

    /*
     * Gets or Sets address type of the address
     */
    public PreferredMailingAddress: boolean = false;

    /*
     * Gets or Sets isdeleted of the address
     */
    public IsDeleted: boolean = false;
}