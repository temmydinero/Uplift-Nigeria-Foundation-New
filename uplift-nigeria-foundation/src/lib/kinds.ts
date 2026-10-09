export const KINDS:Record<string,{model:string;title:string;statuses:string[];search:string[]}>={
 volunteers:{model:"volunteer",title:"Volunteers",statuses:["NEW","CONTACTED","APPROVED","DECLINED","ARCHIVED"],search:["fullName","email"]},
 partnerships:{model:"partnershipRequest",title:"Partnership requests",statuses:["NEW","CONTACTED","APPROVED","DECLINED","ARCHIVED"],search:["organization","email","contactPerson"]},
 messages:{model:"contactMessage",title:"Contact messages",statuses:["UNREAD","READ","ARCHIVED"],search:["name","email","subject"]}};
