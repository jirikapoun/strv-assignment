import { Authorized, Body, CurrentUser, HttpCode, JsonController, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { ContactService, User } from '../../logic';
import CreateContactRequest from '../dto/request/create-contact.request';
import ContactCreatedResponse from '../dto/response/contact-created.response';
import {
  badRequestResponse,
  jwtSecurity,
  responseWithPayload,
  unauthorizedResponse,
} from '../open-api.util';

@JsonController('/contacts')
@Authorized()
@Service()
export default class ContactController {

  public constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(201)
  @OpenAPI({
    summary: 'Create a new contact',
    ...jwtSecurity,
    responses: {
      ...responseWithPayload('201', 'Contact successfully created', ContactCreatedResponse.name),
      ...badRequestResponse,
      ...unauthorizedResponse
    },
  })
  public async createContact(
    @Body() request: CreateContactRequest,
    @CurrentUser({ required: true }) user: User,
  ): Promise<ContactCreatedResponse> {
    const contactCreation = request.toContactCreation();
    const contact = await this.contactService.createForUser(contactCreation, user.id);
    return ContactCreatedResponse.fromContact(contact);
  }
}
