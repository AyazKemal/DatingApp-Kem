import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private likeService = inject(LikesService);
  private presenceService = inject(PresenceService);
  baseUrl = environment.apiUrl;
  curentUser = signal<User | null>(null);
  roles = computed(() => {
    const user = this.curentUser();
    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    }
    return []
  })

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'accounts/login', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'accounts/register', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.curentUser.set(user);
    this.likeService.getLikeIds();
    this.presenceService.createHubConnection(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.curentUser.set(null);
    this.presenceService.stopHubConnection();
  }
}
