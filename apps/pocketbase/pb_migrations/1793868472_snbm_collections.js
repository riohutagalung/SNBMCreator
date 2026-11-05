migrate((app) => {
 const definitions = [
  {name:'snbm_enquiries', fields:[{name:'name',type:'text',required:true,max:120},{name:'email',type:'email',required:true},{name:'phone',type:'text',max:30},{name:'kind',type:'select',values:['Brand','Calon host','Pertanyaan'],maxSelect:1,required:true},{name:'message',type:'text',required:true,max:3000},{name:'weight',type:'number',min:0,max:200},{name:'style',type:'text',max:100},{name:'city',type:'text',max:120},{name:'consent',type:'bool',required:true}]},
  {name:'snbm_contacts',fields:[{name:'email',type:'email',required:true},{name:'consent',type:'bool',required:true}]},
  {name:'snbm_gmv',public:true,fields:[{name:'host_name',type:'text',required:true,max:120},{name:'period',type:'text',required:true,max:100},{name:'target',type:'number',min:0,required:true},{name:'achieved',type:'number',min:0},{name:'source',type:'text',max:200}]}
 ];
 for (const definition of definitions) {
  let exists = false;
  try { app.findCollectionByNameOrId(definition.name); exists = true; } catch (_) {}
  if (exists) continue;
  const collection = new Collection({name:definition.name,type:'base',listRule:definition.public ? '' : null,viewRule:definition.public ? '' : null,createRule:definition.public ? null : '',updateRule:null,deleteRule:null,fields:[...definition.fields,{name:'created',type:'autodate',onCreate:true,onUpdate:false},{name:'updated',type:'autodate',onCreate:true,onUpdate:true}]});
  app.save(collection);
 }
}, (app) => {
 for (const name of ['snbm_enquiries','snbm_contacts','snbm_gmv']) { try {app.delete(app.findCollectionByNameOrId(name));} catch (_) {} }
});
