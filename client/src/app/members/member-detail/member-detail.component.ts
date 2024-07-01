import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { PresenceService } from '../../_services/presence.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  presenceService = inject(PresenceService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.member && this.member.photos.map(p => {
          this.images.push(new ImageItem({src: p.url, thumb: p.url}))
        })
      }
    })

    // this.route.paramMap.subscribe({
    //   next: _ => this.onRouteParamsChange()
    // })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;

    if (this.activeTab.heading === 'Messages' && this.messages.length === 0 && this.member) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: messages=> this.messages =messages
      })
    }
    // this.activeTab = data;
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: {tab: this.activeTab.heading},
    //   queryParamsHandling: 'merge'
    // })
    // if (this.activeTab.heading === 'Messages' && this.member) {
    //   const user = this.accountService.currentUser();
    //   if (!user) return;
    //   this.messageService.createHubConnection(user, this.member.username);
    // } else {
    //   this.messageService.stopHubConnection();
    // }
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
      if (messageTab) messageTab.active = true;
    }
  }

  onUpdateMessages(event: Message){
    this.messages.push(event);
  }
  // loadMember() {
  //   const username = this.route.snapshot.paramMap.get('username');
  //   if (!username) return;
  //   this.memberService.getMember(username).subscribe({
  //     next: member => {
  //       this.member = member;
  //       member.photos.map(p => {
  //         this.images.push(new ImageItem({ src: p.url, thumb: p.url }))
  //       })
  //     }
  //   })
  // }
}
