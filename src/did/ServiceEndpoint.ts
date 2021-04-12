import { IsDefined } from 'class-validator';
export class ServiceEndpoint {
    @IsDefined()
    id: string;
    @IsDefined()
    type: string;
    @IsDefined()
    serviceEndpoint: string;
    @IsDefined()
    description?: string;
}
