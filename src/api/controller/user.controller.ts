import { Body, HttpCode, JsonController, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import UserService from '../../logic/service/user.service';
import RegisterUserRequest from '../dto/request/register-user.request';
import UserResponse from '../dto/response/user.response';
import { badRequestResponse, responseWithPayload, unauthorizedResponse } from '../openapi.util';

@JsonController('/users')
@Service()
export default class UserController {

  public constructor(private readonly userService: UserService) {}

  @Post('/register')
  @HttpCode(201)
  @OpenAPI({
    description: 'Register user',
    responses: {
      ...responseWithPayload('201', 'User succesfully registered', UserResponse.name),
      ...badRequestResponse
    },
  })
  public async register(@Body() request: RegisterUserRequest): Promise<UserResponse> {
    const user = await this.userService.register(request.toRegistration());
    return UserResponse.fromUser(user);
  }

  @Post('/login')
  @OpenAPI({
    description: 'Login user',
    responses: {
      ...responseWithPayload('200', 'User succesfully logged in', UserResponse.name),
      ...badRequestResponse,
      ...unauthorizedResponse,
    }
  })
  public async login(): Promise<void> {
    //@todo implement
  }
}
