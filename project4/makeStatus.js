// import the .env file so that we can keep our password outside of our script
require("dotenv").config();

// importing the masto library to interface with our mastodon server
const m = require("masto");

const masto = m.createRestAPIClient({
  url: "https://networked-media.itp.io/", // this is our mastodon server
  accessToken: process.env.TOKEN,
});

const stream = m.createStreamingAPIClient({
  accessToken: process.env.TOKEN,
  streamingApiUrl: "wss://networked-media.itp.io", // special url we use for sockets
});

async function makeStatus(text) {
  const status = await masto.v1.statuses.create({
    status: text,
    visibility: "public",
  });

  console.log(status.url);
}

// get the New York time

function getDayOfWeek() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
  });
  const formattedDate = formatter.format(now);
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = weekdays.indexOf(formattedDate);
  
  return weekdays[dayIndex];
}

//animation chart

let animation = {
  Sunday: `
        わんだふるぷりきゅあ! - 0:00
        FAIRY TAIL 100 YEARS QUEST - 4:30
        神之塔 二期 - 10:00
        転生貴族、鑑定スキルで成り上がる 〜弱小領地を受け継いだので、優秀な人材を増やしていたら、最強領地になってた〜 二期 - 10:30
        嘆きの亡霊は引退したい 〜最弱ハンターによる最強パーティ育成術〜 - 10:30
        黙示録の四騎士 二期 - 3:30
        LoveLive! SuperStar!! 三期 - 4:00
        妻、小学生になる。 - 9:00
        ぷにるはかわいいスライム - 10:45
        MFゴースト二期 - 11:00
        シャングリラ・フロンティア〜クソゲーハンター、神ゲーに挑まんとす〜 二期 - 4:00`,
  Monday: `
        最凶の支援職【話術士】である俺は世界最強クランを従える - 11:00
        ハイガクラ - 9:00
        鴨乃橋ロンの禁断推理 二期 - 9:30
        星降る王国のニナ - 9:30
        来世は他人がいい - 10:00
        夏目友人帳 七期 - 11:00
        精霊幻想記 二期 - 12:30
        >ありふれた職業で世界最強 三期 - 10:00`,
  Tuesday: `
        多数欠 - 1:00
        歴史に残る悪女になるぞ - 10:30
        甘神さんちの縁結び - 11:00
        妖怪学校の先生はじめました！ - 10:00`,
  Wednesday: `
        戦国妖狐 二期 - 11:00
        デリコズ・ナーサリー - 11:30
        Acro Trip - 9:00
        Re:ゼロから始める異世界生活 三期 - 9:30
        新テニスの王子様 U-17 WORLD CUP - 11:00
        GOD.app 二期 - 12:00
        やり直し令嬢は竜帝陛下を攻略中 - 10:00
        Murder Mystery Of The Dead - 14:15`,
  Thursday: `
        ひとりぼっちの異世界攻略 - 11:00
        菇狗 - 8:00
        ネガポジアングラー - 9:00
        結婚するって、本当ですか - 10:30
        アオのハコ - 11:00
        ダンダダン - 11:30
        メカウデ - 11:30
        ダンジョンに出会いを求めるのは間違っているだろうか 五期 - 11:03`,
  Friday: `
        新-るろうに剣心-明治剣客浪漫譚-二期 - 12:00
        トリリオンゲーム - 13:00
        さようなら竜生、こんにちは人生 - 13:00
        2.5次元の 誘惑 - 9:30
        株式会社マジルミエ - 10:00
        Gun Gale Online 二期 - 11:00
        アイドルマスターシャイニーカラーズ 二期 - 12:25
        合コンに行ったら女がいなかった話 - 12:30`,
  Saturday: `
        魔法使いになれなかった女の子の話 - 13:00
        里レート麻雀闘牌録冻牌 - 13:30
        ドラゴンボールDAIMA - 10:40
        魔王様、リトライ! - 10:00
        オーイ！とんぼ - 0:00
        科学×冒険 - 5:30
        BLEACH 千年血戦篇 三期 - 10:00
        ブルーロック 二期 - 10:30`,
};

//make automatic posts

function multipleStatuses() {
  let dayOfWeek = getDayOfWeek();
  let post = animation[dayOfWeek];
  makeStatus(`!!! Today's animation update: [${dayOfWeek}] ${post}`);
}

//set interval to once a day when 00:00:00

setInterval(() => {
  const now = new Date();
  if (
    now.getHours() === 0 &&
    now.getMinutes() === 0 &&
    now.getSeconds() === 0
  ) {
    multipleStatuses();
  }
}, 1000);

//reply to mentions

async function reply() {
  const notificationSubscription = await stream.user.notification.subscribe();

  for await (let notif of notificationSubscription) {
    let type = notif.payload.type;
    let acct = notif.payload.account.acct;
    let replyId = notif.payload.status.id;
    let replyContent = notif.payload.status.content;

    //check if emoji

    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    if (notif.payload.type == "mention") {
      const emojis = replyContent.match(emojiRegex);

      if (emojis && emojis.length > 0) {
        const emojiReply = `🙏🎬✨😊!`;

        const status = await masto.v1.statuses.create({
          status: emojiReply,
          visibility: "public",
          in_reply_to_id: replyId,
        });

        //reply the animation update if not emoji
      } else {
        let dayOfWeek = getDayOfWeek();
        let post = animation[dayOfWeek];

        const status = await masto.v1.statuses.create({
          status: `!!! Today's animation update: [${dayOfWeek}] ${post}`,
          visibility: "public",
          in_reply_to_id: replyId,
        });
      }
    }
  }
}

reply();
