import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const cookies = request.headers.cookie as string | undefined;

    const cookie = cookies
      ? cookies.match(new RegExp(`(^| )${data}=([^;]+)`))
      : undefined;

    return cookie ? cookie[2] : cookie;
  },
);
