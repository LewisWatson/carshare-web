import { JsonApiModelConfig, JsonApiModel, Attribute } from 'angular2-jsonapi';

@JsonApiModelConfig({
    type: 'users'
})
export class User extends JsonApiModel {
    id: string;

    @Attribute()
    username: string;

    @Attribute()
    firebaseUID: string;

    @Attribute()
    displayName: string;

    @Attribute()
    email: string;

    @Attribute()
    photoURL: string;

    @Attribute()
    isAnon: boolean;
}