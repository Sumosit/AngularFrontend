import {Component, OnInit} from '@angular/core';
import {UsersService} from "@layout/components/users/users.service";
import {UserInterface} from "@shared/interfaces/user-interface";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {RoleInterface} from "@shared/interfaces/role-interface";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(public usersService: UsersService) {
  }

  users: UserInterface[] = [];
  moderators: UserInterface[] = [];
  banned: UserInterface[] = []

  searchName: string = '';

  public username: string = '';

  ngOnInit(): void {
    this.getUsers()
    this.getModerators()
    this.getBanned()
  }

  sort(arr: any) {
    return arr.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id)
  }

  searchUsers(arr: UserInterface[]) {
    return arr.filter(item => item.username?.includes(this.searchName));
  }

  deleteUser(id: number) {
    this.usersService.deleteUser(id)
      // @ts-ignore
      .subscribe((data: RoleInterface | undefined) => {
        console.log(data)
        this.users = this.users.filter(x => x.id != id)
        this.moderators = this.moderators.filter(x => x.id != id)
        this.banned = this.banned.filter(x => x.id != id)
      })
  }

  addUser() {
    let sub = this.usersService.addUser(this.username).subscribe((data: UserInterface) => {
      let userRole
      data.role?.forEach(item => {
        userRole = item.name?.includes('ROLE_MODERATOR')
        if (item.name?.includes('ROLE_USER')) {
          this.users.push(data);
        } else if (item.name?.includes('ROLE_MODERATOR')) {
          this.moderators.push(data)
        } else if (item.name?.includes('ROLE_BANNED')) {
          this.banned.push(data)
        }
        return
      })
      sub?.unsubscribe();
    });
  }

  addRole(id: string, role: string) {
    this.usersService.addRole(id, role)
      .subscribe((data) => {
        // console.log(data)
        return data
      });
  }

  getUsers() {
    let sub = this.usersService.getAllByRole('ROLE_USER')
      .subscribe((data) => {
        // console.log(data);
        // @ts-ignore
        this.users = [...data];
        sub?.unsubscribe();
      })
  }

  getModerators() {
    let sub = this.usersService.getAllByRole('ROLE_MODERATOR')
      .subscribe((data) => {
        // console.log(data);
        // @ts-ignore
        this.moderators = [...data];
        sub?.unsubscribe();
      })
  }

  getBanned() {
    let sub = this.usersService.getAllByRole('ROLE_BANNED')
      .subscribe((data) => {
        // console.log(data);
        // @ts-ignore
        this.banned = [...data];
        sub?.unsubscribe();
      })
  }

  drop(event: CdkDragDrop<UserInterface[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let dragUser: UserInterface = event.item.data;
      let needRole: string = event.container.element.nativeElement.id;
      if (dragUser?.id && needRole) {
        // не нужно возвращать юзера и вручную вносить в соответсвующий
        // список, так как пользователь уже это сделал
        if (needRole === 'users') {
          this.addRole(dragUser.id.toString(), 'ROLE_USER');
        } else if (needRole === 'moderators') {
          this.addRole(dragUser.id.toString(), 'ROLE_MODERATOR');
        } else if (needRole === 'banned') {
          this.addRole(dragUser.id.toString(), 'ROLE_BANNED');
        }
      }

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
