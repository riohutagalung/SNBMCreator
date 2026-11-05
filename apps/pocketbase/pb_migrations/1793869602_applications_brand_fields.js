/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const hosts = app.findCollectionByNameOrId('snbm_host_applications');
  const add = (collection, field) => {
    try { collection.fields.getByName(field.name); } catch (_) { collection.fields.add(field); }
  };
  add(hosts, new NumberField({name:'daily_live_hours',min:0,max:24,required:true}));
  add(hosts, new NumberField({name:'best_daily_gmv',min:0,required:true}));
  add(hosts, new TextField({name:'social_accounts',max:1200,required:true}));
  add(hosts, new URLField({name:'trial_video_url',max:1000}));
  add(hosts, new FileField({name:'cv_file',required:true,maxSelect:1,maxSize:10485760,mimeTypes:['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],protected:true}));
  add(hosts, new FileField({name:'trial_video',maxSelect:1,maxSize:52428800,mimeTypes:['video/mp4','video/quicktime','video/webm'],protected:true}));
  app.save(hosts);
  const enquiries = app.findCollectionByNameOrId('snbm_enquiries');
  add(enquiries,new TextField({name:'brand_name',max:160}));
  add(enquiries,new TextField({name:'product_category',max:100}));
  add(enquiries,new TextField({name:'platform',max:100}));
  add(enquiries,new TextField({name:'service_interest',max:120}));
  add(enquiries,new URLField({name:'store_url',max:500}));
  app.save(enquiries);
}, (app) => {
  const hosts = app.findCollectionByNameOrId('snbm_host_applications');
  for (const name of ['daily_live_hours','best_daily_gmv','social_accounts','trial_video_url','cv_file','trial_video']) { try {hosts.fields.removeByName(name);}catch (_) {} }
  app.save(hosts);
  const enquiries = app.findCollectionByNameOrId('snbm_enquiries');
  for (const name of ['brand_name','product_category','platform','service_interest','store_url']) { try {enquiries.fields.removeByName(name);}catch (_) {} }
  app.save(enquiries);
});