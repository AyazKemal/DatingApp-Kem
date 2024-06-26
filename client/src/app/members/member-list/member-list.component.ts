import { Component, OnInit, inject } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MemberCardComponent } from "../member-card/member-card.component";
import { AccountService } from '../../_services/account.service';
import { UserParams } from '../../_models/userParams';
import { FormsModule } from '@angular/forms';
import { ButtonsModule} from 'ngx-bootstrap/buttons'


@Component({
  selector: 'app-member-list',
  standalone: true,
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
  imports: [FormsModule, MemberCardComponent, PaginationModule, ButtonsModule]
})
export class MemberListComponent implements OnInit {
  private accountService = inject(AccountService);
  memberService = inject(MembersService);
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]


  ngOnInit(): void {
    if (!this.memberService.paginatedResult()) this.loadMembers();
  }

  resetFilters(){
    this.memberService.resetUserParams();
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers()
  }

  pageChanged(event: any) {
    if (this.memberService.userParams().pageNumber !== event.page) {
      this.memberService.userParams().pageNumber = event.page;
      this.loadMembers();
    }
  }
}
