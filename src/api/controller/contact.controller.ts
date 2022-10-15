import { Body, CurrentUser, JsonController, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import User from '../../logic/model/user';
import ContactService from '../../logic/service/contact.service';
import CreateContactRequest from '../dto/request/create-contact.request';
import ContactResponse from '../dto/response/contact.response';
import { badRequestResponse, responseWithPayload, unauthorizedResponse } from '../openapi.util';

@JsonController('/contacts')
@Service()
export default class ContactController {

  public constructor(private readonly contactService: ContactService) {}

  @Post()
  @OpenAPI({
    responses: {
      ...responseWithPayload('201', 'Contact successfully created', ContactResponse.name),
      ...badRequestResponse,
      ...unauthorizedResponse
    },
  })
  public async createContact(
    @Body() request: CreateContactRequest,
    @CurrentUser({ required: true }) user: User,
  ): Promise<ContactResponse> {
    const contactCreation = request.toContactCreation();
    const contact = await this.contactService.createForUser(contactCreation, user.id);
    return ContactResponse.fromContact(contact);
  }
}
