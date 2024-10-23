import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    // Энд таны баталгаажуулах логикийг бичнэ
    return true; // Энийг жинхэнэ баталгаажуулах шалгалтаар солино уу
  }
}
