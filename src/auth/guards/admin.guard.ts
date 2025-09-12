import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    //  A l'image du get-user decorator on crée une  méthode  qui prend en paramètre
    // context , instance de  ExecutionContext.
    // l'executionContext  contient des infos sur
    //l'exécution en cours, comme la requête HTTP.

    const request = context.switchToHttp().getRequest();

    // On récupère le user de la requête hhtp
    const user = request.user;

    // Si le nom du rôle est n'est pas admin alors erreur 403
    if (user && user.role && user.role.name === 'admin') {
      return true;
    } else {
      throw new ForbiddenException('Admin role required');
    }
  }
}
