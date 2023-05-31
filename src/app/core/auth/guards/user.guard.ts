import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';

import { UserService } from 'app/core/user/user.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root',
})
export class UserGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const url = state.url;
        const role = this.authService.role;

        const impersonate = LocalStorageUtils.impersonate;
        console.log('url >>>>', url);
        if (
            (url.match('/settings/integrations') ||
                url.match('/settings/sources') ||
                url.match('/settings/custom-request') ||
                url.match('/settings/product/attributes') ||
                url.match('/settings/groups') ||
                url.match('/settings/promotions') ||
                url.match('/settingss')) &&
            (role === 'masterUser' ||
                (role === 'superAdmin' && impersonate) ||
                (role === 'admin' && impersonate))
        ) {
            return true;
        } else if (
            (url.match('/dashboard/integration-status') ||
                url.match('/products') ||
                url.match('/products') ||
                url.match('/orders')) &&
            (role === 'masterUser' ||
                role === 'user' ||
                (role === 'superAdmin' && impersonate) ||
                (role === 'admin' && impersonate))
        ) {
            return true;
        } else {
            this.router.navigate(['page-not-found']);
            return false;
        }
    }
}
