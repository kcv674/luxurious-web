const BOT_TOKEN = "8472949452:AAGm9FxxT0yQpTKCOWutJqeytlypnAqkDMg";
const ADMIN_CHAT_ID = "8572625619";
const GROUP_ID = "PASTE_PRIVATE_GROUP_ID";

export default async function handler(req,res){
 const body=req.body;

 // NEW APPLICATION
 if(body.type==="new"){
  const d=body.data;
  const text=`🛡 LUX APPLICATION

👤 ${d.username}
🎂 ${d.age}
📱 ${d.tg}
🎮 MP ${d.mp}
🎯 BR ${d.br}`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({
    chat_id:ADMIN_CHAT_ID,
    text,
    reply_markup:{
     inline_keyboard:[
      [
       {text:"✅ APPROVE",callback_data:`approve_${d.tg}`},
       {text:"❌ REJECT",callback_data:`reject_${d.tg}`}
      ]
     ]
    }
   })
  });
 }

 // BUTTON CLICK
 if(body.callback_query){
  const data=body.callback_query.data;
  const chat=body.callback_query.message.chat.id;

  if(data.startsWith("approve_")){
   const tg=data.replace("approve_","");

   await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({chat_id:chat,text:"✅ APPROVED"})
   });

   await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/inviteChatMember`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({chat_id:GROUP_ID,user_id:tg.replace("@","")})
   });
  }

  if(data.startsWith("reject_")){
   await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({chat_id:chat,text:"❌ REJECTED"})
   });
  }
 }

 res.status(200).send("OK");
}