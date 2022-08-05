import {Injectable} from '@angular/core';
import {UserInterface} from "@shared/interfaces/user-interface";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "@environment/environment.prod";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {
  }

  deleteUser(id: number) {
    let params = new HttpParams().set('id', id)
    return this.http.delete(environment.backend + "api/users/delete",
      {params: params});
  }

  addUser(username: string): Observable<UserInterface> {
    const httpOptions: any = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    // @ts-ignore
    return this.http.post(environment.backend + "api/users/add",
      JSON.stringify({username: username}), httpOptions)
  }

  addRole(id: string, role: string) {
    const httpOptions: any = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.post(environment.backend + "api/users/add/role",
      JSON.stringify({id: id, message: role}), httpOptions)
  }

  getAllByRole(role: string) {
    let params = new HttpParams()
      .set('role', role)
    // @ts-ignore
    return this.http.get(environment.backend + 'api/users/getAll/byRole',
      {params: params});
  }
}
