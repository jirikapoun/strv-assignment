import { Body, HttpCode, JsonController, Post, UnauthorizedError } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { UserService } from '../../logic';
import AuthenticateUserRequest from '../dto/request/authenticate-user.request';
import RegisterUserRequest from '../dto/request/register-user.request';
import UserAuthenticatedResponse from '../dto/response/user-authenticated.response';
import { badRequestResponse, responseWithPayload, unauthorizedResponse } from '../open-api.util';

@JsonController('/users')
@Service()
export default class UserController {

  public constructor(private readonly userService: UserService) {}

  @Post('/register')
  @HttpCode(201)
  @OpenAPI({
    summary: 'Register and authenticate a new user',
    responses: {
      ...responseWithPayload('201', 'User succesfully registered and authenticated', UserAuthenticatedResponse.name),
      ...badRequestResponse
    },
  })
  public async register(@Body() request: RegisterUserRequest): Promise<UserAuthenticatedResponse> {
    await this.userService.register(request.toRegistration());
    return this.login(request);
  }

  @Post('/auth')
  @OpenAPI({
    summary: 'Authenticate an existing user',
    responses: {
      ...responseWithPayload('200', 'User succesfully authenticated', UserAuthenticatedResponse.name),
      ...badRequestResponse,
      ...unauthorizedResponse,
    }
  })
  public async login(@Body() request: AuthenticateUserRequest): Promise<UserAuthenticatedResponse> {
    const token = await this.userService.authenticate(request.email, request.password);
    if (token) {
      return UserAuthenticatedResponse.fromToken(token);
    } else {
      throw new UnauthorizedError('Invalid credentials');
    }
  }
}
